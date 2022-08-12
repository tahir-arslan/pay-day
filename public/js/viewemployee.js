const editTimesheet = (event) => {
    const id = event.target.id;
    document.querySelectorAll(".editable" + id).forEach(element => {
        element.setAttribute("contenteditable", true)
    });
    document.querySelector(".editbtn").style.display = "none";
    document.querySelector(".savebtn").style.display = "block";
};

const saveTimesheet = (event) => {
    const id = event.target.id;
    const date = document.querySelector(".date" + id).value.trim();

    const time_IN = document.querySelector(".timein" + id).value.trim();
    const time_OUT = document.querySelector(".timeout" + id).value.trim();

    if (time_IN && time_OUT) {
        const response = await fetch(`/api/time_registry/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                time_IN,
                time_OUT
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
    } else {
        document.querySelector('#alert-message').textContent = "Please do not leave time empty!";
        document.querySelector('#pop-up').style.display = 'block';
    }
}

document.querySelector(".editbtn").addEventListener("click", editTimesheet);
document.querySelector(".savebtn").addEventListener("click", saveTimesheet);