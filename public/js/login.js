async function loginFormHandler(event) {
    event.preventDefault();
    
    const username = document.querySelector('#username-login').value.trim();
    const password = document.querySelector('#password-login').value.trim();
    
    
    if (username && password) {
        const employeeName = username.split("_");
        const first_name = employeeName[0].charAt(0).toUpperCase() + employeeName[0].slice(1).toLowerCase();
        const last_name = employeeName[1].charAt(0).toUpperCase() + employeeName[1].slice(1).toLowerCase();
        const response = await fetch('/api/employees/login', {
            method: 'post',
            body: JSON.stringify({
                first_name,
                last_name,
                password
            }),
            headers: { 'Content-Type': 'application/json' }
        });
        
        if (response.ok) {
           const res = await response.json() 
        //    this need to be modified once backend is set
           if (res.employees.is_manager) {
            document.location.replace('/manager-dashboard');
           } else {
            document.location.replace('/employee-clockin');
           }
        } else {
            const res = await response.json();
            document.querySelector('#alert-message').textContent = res.message;
            document.querySelector('#pop-up').style.display = 'block'
        }
    } else {
        document.querySelector('#alert-message').textContent = "Please fill out the missing information";
        document.querySelector('#pop-up').style.display = 'block';
    };
};

document.querySelector('.login-form').addEventListener('submit', loginFormHandler);