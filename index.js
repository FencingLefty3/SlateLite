//const lists = [];
//const writes = [];

const writeCreateDialog = document.getElementById("writeCreate");
const listCreateDialog = document.getElementById("listCreate");
const listContainer = document.getElementById("listContainer");
const writeContainer = document.getElementById("writeContainer");

const writeCreateForm = document.getElementById("writeCreateFrm");
const listCreateForm = document.getElementById("listCreateFrm");

function openWriteCreateDialog() {
    writeCreateDialog.showModal();
}

function openListCreateDialog() {
    listCreateDialog.showModal();
}

function attachDialogCloseBehavior(dialog) {
    dialog.addEventListener('click', (event) => {
        const rect = dialog.getBoundingClientRect();
        const clickedInside =
            event.clientX >= rect.left &&
            event.clientX <= rect.right &&
            event.clientY >= rect.top &&
            event.clientY <= rect.bottom;

        if (!clickedInside) {
            dialog.close();
            const form = dialog.querySelector('form');
            if (form) form.reset();
        }
    });

    dialog.addEventListener('cancel', () => {
        const form = dialog.querySelector('form');
        if (form) form.reset();
    });
}

attachDialogCloseBehavior(writeCreateDialog);
attachDialogCloseBehavior(listCreateDialog);

//--//

async function renderLists() {
    const listContainer = document.getElementById("listContainer");
    const lists = await getLists();
    
    const formatShortDate = (datetimeLocalStr) => {
    if (!datetimeLocalStr) return "";

    const dateObj = new Date(datetimeLocalStr);
    const today = new Date();

    // Strip hours/minutes/seconds to accurately check if it is the same calendar day
    const isToday = dateObj.setHours(0,0,0,0) === today.setHours(0,0,0,0);
    
    // Re-parse the original string to get the user's selected time back
    const finalDate = new Date(datetimeLocalStr);
    const dateStr = finalDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

    return isToday 
        ? `Today ${finalDate.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }).toLowerCase().replace(' ', '')}`
        : dateStr;
    };


    listContainer.innerHTML = "";

    lists.forEach(list => {
        const point = document.createElement("div");
        point.className = "point";
        point.innerHTML = `<div class="point-content"><span>${list.title}</span><p class="content-text">${formatShortDate(list.date)}</p></div> <button class="point-delete-btn" data-id="${list.id}"><img class="ico" src="icons/trash.svg" alt="trash"></button>`;
        listContainer.appendChild(point);
    });
}

const createListButton = document.getElementById("createListButton");

const listForm = document.getElementById("listCreateFrm");

listForm.addEventListener("submit", async (event) => { 
       
        console.log("Form submitted");
        const formData = new FormData(listForm);
        const title = formData.get("title");
        const date = formData.get("date");
        console.log("Form read: ", title, date);
        if (!title) { return; }
    
        await createList(title, date);
    
        renderLists();
    });

createListButton.addEventListener("click", async () => {
    openListCreateDialog()    
});

listContainer.addEventListener("click", async (event) => {

    const button = event.target.closest(".point-delete-btn");

    if (!button) return;

    const id = button.dataset.id;

    await deleteList(id);

    await renderLists();

});

//-------------------------------------------------------------------------//

async function renderWrites() {
    const writeContainer = document.getElementById("writeContainer");
    const writes = await getWrites();
    
    writeContainer.innerHTML = "";

    writes.forEach(write => {
        const line = document.createElement("div");
        line.className = "line";
        line.innerHTML = `<div class="line-content"><span>${write.title}</span><p class="content-text">${write.content}</p></div> <button class="line-delete-btn" id="deleteWriteButton" data-id="${write.id}"><img class="ico" src="icons/trash.svg" alt="trash"></button>`;
        writeContainer.appendChild(line);
    });
}

const createWriteButton = document.getElementById("createWriteButton");

const writeForm = document.getElementById("writeCreateFrm");

writeForm.addEventListener("submit", async (event) => { 
       
        console.log("Form submitted");
        const formData = new FormData(writeForm);
        const title = formData.get("title");
        const content = formData.get("content");
        console.log("Form read: ", title, content);
        if (!title) { return; }
    
        await createWrite(title, content);
    
        renderWrites();
    });

createWriteButton.addEventListener("click", async () => {
    openWriteCreateDialog()    
});

writeContainer.addEventListener("click", async (event) => {

    const button = event.target.closest(".line-delete-btn");

    if (!button) return;

    const id = button.dataset.id;

    await deleteWrite(id);

    await renderWrites();

});
//-------------------------------------------------------------------------//


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
