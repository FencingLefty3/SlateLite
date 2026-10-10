async function CalculateElo(what, id) {
    if (what === "complete") {
        const list = await db.lists.get(id);
        if (!list) return null;
        await changeElo(list.date, 1);
    } else if (what === "undoComplete") {
        const list = await db.lists.get(id);
        if (!list) return null;
        await changeElo(list.date, -1);
    }
}

async function changeElo(date, direction) {
    const elo = await db.elo.toCollection().first();
    const currentElo = elo?.score ?? 0;
    const taskDate = new Date(date).getTime();
    const points = taskDate >= Date.now() ? 10 : 5;
    console.log(`Changing Elo: ${currentElo} + (${direction} * ${points})`);
    await db.elo.put({
        score: currentElo + direction * points
    });
    await updateScore();
}

const SCORE_WINDOW_DAYS = 7; // or 30

function windowStart() {
    const d = new Date();
    d.setHours(0, 0, 0, 0); // local midnight, so points don't expire mid-afternoon
    return d.getTime() - (SCORE_WINDOW_DAYS - 1) * 86400000;
}

function pointsFor(date) {
    if (!date) return 10; // no due date can't be late; your call
    // A date-only value ("2026-09-14") parses as UTC midnight, which makes
    // tasks due today read as late. Treat it as end of that local day.
    const due = date.length === 10
        ? new Date(date + "T23:59:59").getTime()
        : new Date(date).getTime();
    return due >= Date.now() ? 10 : 5;
}

async function CalculateElo(what, id) {
    if (what === "complete") {
        const list = await db.lists.get(id);
        if (!list) return null;

        // Guard against a double-tap awarding twice
        if (await db.scoreLog.where("listId").equals(id).count()) return null;

        await db.scoreLog.add({
            listId: id,
            points: pointsFor(list.date), // frozen at completion
            at: Date.now()
        });
    } else if (what === "undoComplete") {
        // Delete the row instead of writing a negative one. It cancels
        // exactly what was awarded, even if it was awarded days ago.
        await db.scoreLog.where("listId").equals(id).delete();
    }
    await updateScore();
}

async function getScore() {
    const rows = await db.scoreLog
        .where("at").aboveOrEqual(windowStart())
        .toArray();
    return rows.reduce((sum, r) => sum + r.points, 0);
}
