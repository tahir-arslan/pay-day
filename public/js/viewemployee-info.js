// const { response } = require("express");

const cancelFunction = () => {
    document.location.reload()
};

const editInfo = () => {
    const id = document.querySelector(".editinfobtn").getAttribute("edit-id");
    document.querySelector(`[employee-id="${id}"] :nth-child(4)`).setAttribute("contenteditable", true);
    document.querySelector(".editinfobtn").style.display = "none";
    document.querySelector(".saveinfobtn").style.display = "inline-block";
    document.querySelector(".cancelinfobtn").style.display = "inline-block";
    document.querySelector(".dltinfobtn").style.display = "inline-block";
}

async function deleteFunction () {
    const id = document.querySelector(".dltinfobtn").getAttribute("destroy-id");
    const response = await fetch(`/api/employees/${id}`, {
        method: 'delete',
    })
    if (response.ok) {
        document.location.replace('/manager/dashboard');
    } else {
        const res = await response.json()
        document.querySelector('#alert-message').textContent = res.message;
        document.querySelector('#pop-up').style.display = 'block';
    }
};

async function saveInfo() {
    const id = document.querySelector(".saveinfobtn").getAttribute("save-id");
    const hourly_wage = document.querySelector(`[employee-id="${id}"] :nth-child(4)`).textContent.trim();
    if (isNaN(hourly_wage)) {
        document.querySelector('#alert-message').textContent = "Please enter a valid hourly wage.";
        document.querySelector('#pop-up').style.display = 'block';
        return;
    };

    const response = await fetch(`/api/employees/${id}`, {
        method: 'PUT',
        body: JSON.stringify({
            hourly_wage
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

document.querySelector(".editinfobtn").addEventListener("click", editInfo);
document.querySelector(".saveinfobtn").addEventListener("click", saveInfo);
document.querySelector(".cancelinfobtn").addEventListener("click", cancelFunction);
document.querySelector(".dltinfobtn").addEventListener("click", deleteFunction);