const db = new Dexie("SlateLite");

db.version(1).stores({

    lists: "id, title, createdAt",

    writes: "id, title, updatedAt",

    settings: "key"
});

async function createList(title, date, tag) {
    
        return await db.lists.add({

        id: crypto.randomUUID(),

        title,
        date,
        tag: tags[tag] || "icons/blank.svg",

        createdAt: Date.now()
    });
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

async function deleteWrite(id) {
    await db.writes.delete(id);
}



console.log("database.js loaded");
console.log(typeof createList);