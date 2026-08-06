//const lists = [];
//const writes = [];

const tags = {
    0: "icons/funnel.svg",
    1: "icons/tags/info.svg",
    2: "icons/tags/star.svg",
    3: "icons/tags/tally-2.svg",
    4: "icons/tags/tally-3.svg",
    5: "icons/tags/tally-4.svg"
};

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
        const tagPath = list.tag === "icons/funnel.svg" || list.tag === "0" || !list.tag
            ? "icons/blank.svg"
            : list.tag;
        point.innerHTML = `<div class="point-content">
                <span>${list.title}</span>
                <p class="content-text">${formatShortDate(list.date)}<img style="width: 1rem; height: 1rem; padding-left: 5px;" class="ico" src="${tagPath}" alt="Tag"></p>
            </div>

        </div>
        <button class="point-delete-btn" data-id="${list.id}"><img class="ico" src="icons/trash.svg" alt="trash"></button>`;
        listContainer.appendChild(point);
    });
}

const createListButton = document.getElementById("createListButton");

const listForm = document.getElementById("listCreateFrm");
const listTagInput = document.getElementById("listTagInput");
const listFilterButton = document.getElementById("listFilterInput");

listFilterButton.addEventListener("click", () => {
    const nextTag = (parseInt(listTagInput.value || "0", 10) + 1) % Object.keys(tags).length;
    listTagInput.value = nextTag;
    listFilterButton.querySelector("img").src = tags[nextTag];
});
       

listForm.addEventListener("submit", async (event) => { 
       
        console.log("Form submitted");
        const formData = new FormData(listForm);
        const title = formData.get("title");
        const date = formData.get("date");
        const tag = formData.get("tag") ?? 0;
        console.log("Form read: ", title, date, tag);
        if (!title) { return; }
    
        await createList(title, date, tag);
    
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
        const tagPath = write.tag === "icons/funnel.svg" || write.tag === "0" || !write.tag
            ? "icons/blank.svg"
            : write.tag;
        line.innerHTML = ` <div class="line-content">
                <span>${write.title}</span>
                <p class="content-text">${write.content}<img style="width: 1rem; height: 1rem; padding-left: 5px;" class="ico" src="${tagPath}" alt="Tag"></p>
            </div>
        </div>
        <button class="line-delete-btn" id="deleteWriteButton" data-id="${write.id}">
            <img class="ico" src="icons/trash.svg" alt="trash">
        </button>`;
        writeContainer.appendChild(line);
    });
}

const createWriteButton = document.getElementById("createWriteButton");

const writeForm = document.getElementById("writeCreateFrm");
const writeTagInput = document.getElementById("writeTagInput");
const writeFilterButton = document.getElementById("writeFilterInput");

writeFilterButton.addEventListener("click", () => {
    const nextTag = (parseInt(writeTagInput.value || "0", 10) + 1) % Object.keys(tags).length;
    writeTagInput.value = nextTag;
    writeFilterButton.querySelector("img").src = tags[nextTag];
});

writeForm.addEventListener("submit", async (event) => { 
       
        console.log("Form submitted");
        const formData = new FormData(writeForm);
        const title = formData.get("title");
        const content = formData.get("content");
        const tag = formData.get("tag") ?? 0;
        console.log("Form read: ", title, content, tag);
        if (!title) { return; }
    
        await createWrite(title, content, tag);
    
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

const points = document.querySelectorAll('.point');
points.forEach(point => {
    point.addEventListener('click', () => {
        const title = point.querySelector('span').textContent;
        const date = point.querySelector('.content-text').textContent;
        console.log(`Point clicked: ${title} - ${date}`);
        listCreateDialog.querySelector('[name="title"]').value = title;
        listCreateDialog.querySelector('[name="date"]').value = date;
        openListCreateDialog()
    });
});

const lines = document.querySelectorAll('.line');
lines.forEach(line => {
    line.addEventListener('click', () => {
        const title = line.querySelector('span').textContent;
        const content = line.querySelector('.content-text').textContent;
        console.log(`Line clicked: ${title} - ${content}`);
        writeCreateDialog.querySelector('[name="title"]').value = title;
        writeCreateDialog.querySelector('[name="content"]').value = content;
        openWriteCreateDialog()
    });
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
