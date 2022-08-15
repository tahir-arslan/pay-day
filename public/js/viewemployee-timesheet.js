const editTimesheet = event => {
    const id = event.target.getAttribute("edit-id");
    document.querySelector(`[sheet-id="${id}"] :nth-child(2)`).setAttribute("contenteditable", true);
    document.querySelector(`[sheet-id="${id}"] :nth-child(3)`).setAttribute("contenteditable", true);
    document.querySelector(".edittimebtn").style.display = "none";
    document.querySelector(".savetimebtn").style.display = "inline-block";
    document.querySelector(".canceltimebtn").style.display = "inline-block";
};

async function saveTimesheet(event) {
    const id = event.target.getAttribute("save-id");

    const date = document.querySelector(`[sheet-id="${id}"] :nth-child(1)`).textContent.trim();
    const time_in = document.querySelector(`[sheet-id="${id}"] :nth-child(2)`).textContent.trim();
    const time_out = document.querySelector(`[sheet-id="${id}"] :nth-child(3)`).textContent.trim();

    const checkTime = new RegExp("^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$");
    if (!checkTime.test(time_in) || !checkTime.test(time_out)) {
        document.querySelector('#alert-message').textContent = "Please ensure you enter valid time in right format.";
        document.querySelector('#pop-up').style.display = 'block';
        return;
    }

    const response = await fetch(`/api/timesheet/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            date,
            time_in,
            time_out
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    });

    if (response.ok) {
        document.location.reload();
    } else {
        const res = await response.json()
        document.querySelector('#alert-message').textContent = res.message;
        document.querySelector('#pop-up').style.display = 'block';
    }
}

document.querySelector(".edittimebtn").addEventListener("click", editTimesheet);
document.querySelector(".savetimebtn").addEventListener("click", saveTimesheet);
document.querySelector(".canceltimebtn").addEventListener("click", cancelFunction);