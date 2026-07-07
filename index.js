const lists = [];
const writes = [];

function renderLists() {
    const listContainer = document.getElementById("listContainer");
    listContainer.innerHTML = "";

    lists.forEach(list => {
        const point = document.createElement("div");
        point.className = "point";
        point.innerHTML = `<span>${list.title}</span> <button class="delete-btn" data-id="${list.id}">Delete</button>`;
        listContainer.appendChild(point);
    });
}

const createListButton = document.getElementById("createListButton");

createListButton.addEventListener("click", () => {
    const title = prompt("Enter the title for the new list:");
    if (!title) {
        return;
    }
    lists.push({
        id: Date.now(),
        title: title
    });
    renderLists();
});

function renderWrites() {
    const writeContainer = document.getElementById("writeContainer");
    writeContainer.innerHTML = "";

    writes.forEach(write => {
        const point = document.createElement("div");
        point.className = "point";
        point.innerHTML = `<span>${write.title}</span> <button class="delete-btn" data-id="${write.id}">Delete</button>`;
        writeContainer.appendChild(point);
    });
}

const createWriteButton = document.getElementById("createWriteButton");

createWriteButton.addEventListener("click", () => {
    const title = prompt("Enter the title for the new write:");
    if (!title) {
        return;
    }
    writes.push({
        id: Date.now(),
        title: title
    });
    renderWrites();
});

async function testDatabase() {

    await createList("Homework");

    console.log(await getLists());

}
testDatabase();