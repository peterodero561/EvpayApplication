document.querySelector('.login-btn').addEventListener('click', () => {
    window.location.href = '/auth/login';
});

document.querySelector('.google-login-btn').addEventListener('click', () => {
    alert('Google login functionality here.');
});

document.addEventListener('DOMContentLoaded', function() {
    const driverBtn = document.getElementById('driver-btn');
    const phoneField = document.getElementById('phone-field');
    const userBtn = document.getElementById('user-btn');
    const form = document.getElementById('signup-form');
    const responseMessage = document.getElementById('response-message');

    // set default
    userBtn.classList.add('active');
    phoneField.style.display = 'none';
    form.action = '/auth/register_user';

    driverBtn.addEventListener('click', function() {
        phoneField.style.display = 'block';
        userBtn.classList.remove('active');
        driverBtn.classList.add('active');
        form.action = '/auth/register_driver';
    });

    userBtn.addEventListener('click', function(){
        phoneField.style.display = 'none';
        driverBtn.classList.remove('active');
        userBtn.classList.add('active');
        form.action = '/auth/register_user';
    });

    // forwarding data to server side
    form.addEventListener('submit', function(event) {
        event.preventDefault();

        // get form data
        const formData = new FormData(form);
        fetch(form.action, {method: 'POST', body: formData})
        .then(response => response.json())
        .then(data => {
            responseMessage.style.display = 'block';
            responseMessage.textContent = data.message || 'Registration sucessful';
            responseMessage.className = data.status === 'error'? 'error': 'success';
        })
        .catch(error => {
            responseMessage.style.display = 'block';
            responseMessage.textContent = 'An error occured' + error.message;
            responseMessage.className = 'error';
        });
    });
});