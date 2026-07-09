//const lists = [];
//const writes = [];

async function renderLists() {
    const listContainer = document.getElementById("listContainer");
    const lists = await getLists();
    
    listContainer.innerHTML = "";

    lists.forEach(list => {
        const point = document.createElement("div");
        point.className = "point";
        point.innerHTML = `<span>${list.title}</span> <button class="point-delete-btn" data-id="${list.id}"><img class="ico" src="icons/trash.svg" alt="trash"></button>`;
        listContainer.appendChild(point);
    });
}

const createListButton = document.getElementById("createListButton");

createListButton.addEventListener("click", async () => {
    const title = prompt("Enter the title for the new list:");
    
    if (!title) { return; }
    
    await createList(title);

    renderLists();
});

listContainer.addEventListener("click", async (event) => {
    if (event.target.classList.contains("point-delete-btn")) {
        const id = event.target.dataset.id;
        
        if (!id) { return; }
        
        await deleteList(id);
        
        renderLists();
    }
});

//-------------------------------------------------------------------------//

async function renderWrites() {
    const writeContainer = document.getElementById("writeContainer");
    const writes = await getWrites();
    
    writeContainer.innerHTML = "";

    writes.forEach(write => {
        const line = document.createElement("div");
        line.className = "point";
        line.innerHTML = `<span>${write.title}</span> <button class="line-delete-btn" id="deleteWriteButton" data-id="${write.id}"><img class="ico" src="icons/trash.svg" alt="trash"></button>`;
        writeContainer.appendChild(line);
    });
}

const createWriteButton = document.getElementById("createWriteButton");

createWriteButton.addEventListener("click", async () => {
    const title = prompt("Enter the title for the new write:");
    
    if (!title) { return; }
    
    await createWrite(title);
    
    renderWrites();
});

writeContainer.addEventListener("click", async (event) => {
    if (event.target.classList.contains("line-delete-btn")) {
        const id = event.target.dataset.id;
        
        if (!id) { return; }
        
        await deleteWrite(id);
        
        renderWrites();
    }
});
//-------------------------------------------------------------------------//


const writeCreateDialog = document.getElementById("writeCreate");
const listCreateDialog = document.getElementById("listCreate");

const writeCreateForm = document.getElementById("writeCreateFrm");
const listCreateForm = document.getElementById("listCreateFrm");

function openWriteCreateDialog() {
    writeCreateDialog.showModal();
}

function openListCreateDialog() {
    listCreateDialog.showModal();
}

//--//

const queryString = window.location.search;
const urlParams = new URLSearchParams(queryString);
const action = urlParams.get('action');

console.log("Action parameter:", action);

if (action === 'write') {
    console.log("Opening write create dialog");
    openWriteCreateDialog();
} else if (action === 'list') {
    console.log("Opening list create dialog");
    openListCreateDialog();
}

//-------------------------------------------------------------------------//
renderLists();
renderWrites();

async function clearDatabase() {
    const confirmation = confirm("Are you sure you want to clear the database? This action cannot be undone.");

    if (confirmation) {
        await db.lists.clear();
        await db.writes.clear();

        renderLists();
        renderWrites();
    }  
}

const clearDatabaseButton = document.getElementById("clearDatabaseButton");
clearDatabaseButton.addEventListener("click", clearDatabase);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('./sw.js')
};