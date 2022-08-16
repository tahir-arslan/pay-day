async function createFormHandler(event) {
    event.preventDefault();

    const first_name = document.querySelector('#first-name').value.trim();
    const last_name = document.querySelector('#last-name').value.trim();
    const hourly_wage = document.querySelector('#hourly-wage').value.trim();
    const password = document.querySelector('#password').value.trim();

    if (first_name && last_name && hourly_wage && password) {
        const response = await fetch('/api/employees', {
            method: 'POST',
            body: JSON.stringify({
                first_name,
                last_name,
                hourly_wage,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });

        if (response.ok) {
            document.location.replace('/manager/dashboard');
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