async function editFormHandler(event) {
    event.preventDefault();

    const first_name = document.querySelector('#first-name').value.trim();
    const last_name = document.querySelector('#last-name').value.trim();
    const department = document.querySelector('#department').value.trim();
    const hourly_wage = document.querySelector('#hourly-wage').value.trim();
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];

    if (title && content) {
        const response = await fetch(`/api/employees/${id}`, {
            method: 'PUT',
            body: JSON.stringify({
                first_name,
                last_name,
                department,
                hourly_wage
            }),
            headers: {
                'Content-Type': 'application/json'
            }
        });
    
        if (response.ok) {
            document.location.replace('/dashboard/');
        } else {
            const res = await response.json()
            document.querySelector('#alert-message').textContent = res.message;
            document.querySelector('#pop-up').style.display = 'block';
        }
    } else {
        document.querySelector('#alert-message').textContent = "Please make sure to fill out all the information of the employee!";
        document.querySelector('#pop-up').style.display = 'block';
    }
};

async function deleteHandler(event) {
    event.preventDefault();

    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    const response = await fetch(`/api/employees/${id}`, {
        method: 'DELETE'
    });

    if (response.ok) {
        document.location.replace('/dashboard/');
    } else {
        const res = await response.json()
        document.querySelector('#alert-message').textContent = res.message;
        document.querySelector('#pop-up').style.display = 'block';
    }
};

document.querySelector('.delete-post-btn').addEventListener('click', deleteHandler);
document.querySelector('.edit-employee-form').addEventListener('submit', editFormHandler);