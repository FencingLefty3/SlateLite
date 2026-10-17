async function CalculateElo(what, id) {
    if (what === "complete") {
        const list = await db.lists.get(id);
        if (!list) return null;
        const taskDate = new Date(list.date).getTime();
        const points = taskDate >= Date.now() ? 10 : 5;
        await createElo(id, Date.now(), points);
    } else if (what === "undoComplete") {
        await deleteElo(id);
    }

    await updateScore();
}

