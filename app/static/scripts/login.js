// // Handle login button click
// document.querySelector('.login-btn').addEventListener('click', () => {
//     const email = document.getElementById('email').value;
//     const password = document.getElementById('password').value;

//     if (email && password) {
//         // alert(`Logging in with email: ${email}`);
//         // Add actual login logic here, e.g., validation and authentication
//     } else {
//         alert('Please enter both email and password.');
//     }
// });

// Querring server side for login
document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('login-form');
    const responseMessage = document.getElementById('response-message');

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // fetch data from form
        const formData = new FormData(form);

        //send data to server
        fetch('/auth/login_pass', {method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
            responseMessage.style.display = 'block';
            responseMessage.textContent = data.message;
            responseMessage.className = data.status === 'error'? 'error': 'success';

            if (data.message === 'Logged in successfully!') {
                window.location.href = '/auth/home';
            }
        })
        .catch(error => {
            responseMessage.style.display = 'block';
            responseMessage.textContent = 'An error occured' + error.message;
            responseMessage.className = 'error';
        });
    });
});

// Handle Google login button click
document.querySelector('.google-login-btn').addEventListener('click', () => {
    alert('Google login functionality here.');
});

// Handles create account button click
document.querySelector('.create-account-btn').addEventListener('click', () => {
    window.location.href = '/auth/register';
});
