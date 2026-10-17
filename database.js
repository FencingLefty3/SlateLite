const db = new Dexie("SlateLite");

const legacySchema = {
    lists: "id, title, createdAt, completedAt",
    writes: "id, title, updatedAt",
    settings: "theme, index",
    elo: "score"
};

db.version(4).stores(legacySchema);

const currentSchema = {
    ...legacySchema,
    eloEntries: "id, date, score"
};

db.version(5).stores(currentSchema).upgrade(async transaction => {
    const legacyScores = await transaction.table("elo").toArray();
    const now = Date.now();

    await transaction.table("eloEntries").bulkPut(legacyScores.map((entry, index) => ({
        id: `legacy-${index}`,
        date: now,
        score: entry.score
    })));
});

db.version(9).stores(currentSchema);

async function createList(title, date, tag) {
    
        return await db.lists.add({

        id: crypto.randomUUID(),

        title,
        date,
        tag: tags[tag] || "icons/blank.svg",

        createdAt: Date.now()
    });
}

async function completeList(id) {
    const list = await db.lists.get(id);
    if (!list || list.completedAt) return null;

    const now = Date.now();
    await db.lists.update(id, { completedAt: now, lastTouchedAt: now });

    return { outcome: "completed", points: 0 };
}

async function undoCompleteList(id) {
    const list = await db.lists.get(id);
    if (!list || !list.completedAt) return null;

    await CalculateElo("undoComplete", id);

    await db.lists.update(id, { completedAt: null, lastTouchedAt: Date.now() });

    return { outcome: "restored" };
}

async function getLists() {
    return await db.lists.toArray();
}

async function updateList(id, title, date, tag) {
    return await db.lists.update(id, { title, date, tag: tags[tag] || "icons/blank.svg" });
}

async function deleteList(id) {
    await db.lists.delete(id);
}

async function createWrite(title, content, tag) {
    return await db.writes.add({

        id: crypto.randomUUID(),

        title,
        content,
        tag: tags[tag] || tags[0],

        updatedAt: Date.now()
    });
}

async function getWrites() {
    return await db.writes.toArray();
}

async function updateWrite(id, title, content, tag) {
    return await db.writes.update(id, { title, content, tag: tags[tag] || tags[0] });
}

async function createSettings(theme, index) {
    return await db.settings.put({ theme: theme || ":root", index: index || 0 });
}

async function deleteWrite(id) {
    await db.writes.delete(id);
}

async function getSettings() {
    return await db.settings.toArray();
}

async function updateSettings(theme, index) {
    return await createSettings(theme, index);
}

async function createElo(id, date, score) {
    return await db.eloEntries.put({ id, date, score });
}

async function getElo() {
    return await db.eloEntries.toArray();
}

async function deleteElo(id) {
    return await db.eloEntries.delete(id);
}

async function pruneElo(beforeDate) {
    return await db.eloEntries.where("date").below(beforeDate).delete();
w}



console.log("database.js loaded");
console.log(typeof createList);