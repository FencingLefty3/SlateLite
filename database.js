const db = new Dexie("SlateLite");

db.version(1).stores({

    lists: "id, title, createdAt",

    writes: "id, title, updatedAt",

    settings: "key"
});

async function createList(title, date) {
    return await db.lists.add({

        id: crypto.randomUUID(),

        title,
        date,

        createdAt: Date.now()
    });
}

async function getLists() {
    return await db.lists.toArray();
}

async function updateList(id, title, date) {
    await db.lists.update(id, { title, date });
}

async function deleteList(id) {
    await db.lists.delete(id);
}

async function createWrite(title, content) {
    return await db.writes.add({

        id: crypto.randomUUID(),

        title,
        content,

        updatedAt: Date.now()
    });
}

async function getWrites() {
    return await db.writes.toArray();
}

async function updateWrite(id, title, content) {
    await db.writes.update(id, { title, content });
}

async function deleteWrite(id) {
    await db.writes.delete(id);
}



console.log("database.js loaded");
console.log(typeof createList);