const API =
"https://script.google.com/macros/s/AKfycbx_tNALR_xwJGBRQVFXrNOQ2SD-wTReEoStbPbZaPCl38oVxzcOhbeC2oQ4E6ph5mgK/exec";

// ============================
// SEARCH BUTTON
// ============================

document.getElementById("searchButton")
    .addEventListener("click", searchStudent);

// Enter key support
document.getElementById("searchInput")
    .addEventListener("keydown", function(e){
        if(e.key === "Enter") searchStudent();
    });

// ============================
// MAIN SEARCH FUNCTION
// ============================

async function searchStudent(){

    const index = document
        .getElementById("searchInput")
        .value
        .trim();

    const resultDiv = document.getElementById("result");

    if(!index){
        alert("Please enter Index Number");
        return;
    }

    resultDiv.innerHTML =
        `<div class="loading">Searching...</div>`;

    try {

        // STEP 1: GET STUDENT
        const res = await fetch(
            `${API}?action=student&index=${index}`
        );

        const data = await res.json();

        if(!data.success){
            resultDiv.innerHTML =
                `<div class="not-found">${data.message}</div>`;
            return;
        }

        const student = data.student;

        renderStudent(student);

        // STEP 2: LOAD PHOTO (lazy)
        loadPhoto(index);

    } catch(err){

        console.error(err);

        resultDiv.innerHTML =
            `<div class="not-found">Error loading data</div>`;
    }
}

// ============================
// RENDER STUDENT CARD
// ============================

function renderStudent(student){

    let html = `
    <div class="student-card">

        <div class="photo">
            <img id="studentPhoto"
                 src="https://via.placeholder.com/220x280?text=Loading">
        </div>

        <div class="info">
    `;

    for(const key in student){

        html += `
        <div class="row">
            <div class="label">${key}</div>
            <div class="value">${student[key]}</div>
        </div>
        `;
    }

    html += `
        </div>
    </div>
    `;

    document.getElementById("result").innerHTML = html;
}

// ============================
// LOAD PHOTO (BASE64)
// ============================

async function loadPhoto(index){

    try {

        const res = await fetch(
            `${API}?action=photo&index=${index}`
        );

        const data = await res.json();

        if(data.photo){

            const img = document.getElementById("studentPhoto");

            img.src =
                "data:image/jpeg;base64," + data.photo;
        }

    } catch(err){
        console.error("Photo load failed", err);
    }
}