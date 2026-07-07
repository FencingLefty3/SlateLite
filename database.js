const db = new Dexie("SlateLite");

db.version(1).stores({

    lists: "id, title, createdAt",

    writes: "id, title, updatedAt",

    settings: "key"
});

async function createList(title) {
    return await db.lists.add({

        id: crypto.randomUUID(),

        title,

        createdAt: Date.now()
    });
}

async function getLists() {
    return await db.lists.toArray();
}

async function updateList(id, title) {
    await db.lists.update(id, { title });
}

async function deleteList(id) {
    await db.lists.delete(id);
}

async function createWrite(title) {
    return await db.writes.add({

        id: crypto.randomUUID(),

        title,

        updatedAt: Date.now()
    });
}

async function getWrites() {
    return await db.writes.toArray();
}

async function updateWrite(id, title) {
    await db.writes.update(id, { title });
}

async function deleteWrite(id) {
    await db.writes.delete(id);
}



console.log("database.js loaded");
console.log(typeof createList);