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


