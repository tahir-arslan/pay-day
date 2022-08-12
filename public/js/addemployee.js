async function createFormHandler(event) {
    event.preventDefault();

    const first_name = document.querySelector('#first-name').value.trim();
    const last_name = document.querySelector('#last-name').value.trim();
    const department = document.querySelector('#department').value.trim();
    const hourly_wage = document.querySelector('#hourly-wage').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (first_name && last_name && department && hourly_wage && password) {
        if (department === "none") {
            document.querySelector('#alert-message').textContent = "Please select a department.";
            document.querySelector('#pop-up').style.display = 'block';
            return;
        }
        
        const response = await fetch('/api/employees', {
            method: 'POST',
            body: JSON.stringify({
                first_name,
                last_name,
                department,
                hourly_wage,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/dashboard');
        } else {
            const res = await response.json()
            document.querySelector('#alert-message').textContent = res.message;
            document.querySelector('#pop-up').style.display = 'block';
        }
    } else {
        document.querySelector('#alert-message').textContent = "Please fill out the missing information";
        document.querySelector('#pop-up').style.display = 'block';
    }
};

document.querySelector('.create-employee-form').addEventListener('submit', createFormHandler);