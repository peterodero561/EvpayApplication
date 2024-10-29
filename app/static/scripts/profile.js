// load profile data from server
document.addEventListener('DOMContentLoaded', function() {
    fetch_data();
});

// function to go to home page
function goBack() {
    window.history.back('passengers_home.html');
}

//function to fetch data from server of current user
function fetch_data() {
    fetch('/profiles/account_data', {method: 'GET'})
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        return response.json();
    })
    .then(data => {
        if (data.userRole === 'driver'){
            document.getElementById('add-btn').style.display = 'inline-block';
        }
        document.querySelector('.profile-pic').innerHTML = `
            <img id="profile-image" src="/static/images/profiles/${encodeURIComponent(data.userProfilePic || 'default.jpg')}" alt="Profile Picture">
        `;

        document.querySelector('.profile-info').innerHTML = `
            <h3>My Information</h3>
            <p><strong>Name:</strong> <span id="name-display">${data.userName}</span></p>
            <p><strong>Email:</strong> <span id="email-display">${data.userEmail}</span></p>
            <p><strong>Designation:</strong> <span id="designation-display">EV ${data.userRole}</span></p>
        `;
    })
    .catch(error => {
        console.error('Error fetching account infromation: ', error);
        document.querySelector('.profile-info').innerHTML = `
            <h2>Error ${error}</h2>
        `;
    });
}

// Toggle edit mode
document.getElementById('edit-btn').addEventListener('click', function () {
    document.querySelector('.profile-info').style.display = 'none'
    document.querySelector('.profile-pic').style.display = 'none'
    document.getElementById('add-btn').style.display = 'none';
    
    document.getElementById('edit-fields').style.display = 'block';

    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('save-btn').style.display = 'inline-block';
});

// Save the changes and update display
document.getElementById('save-btn').addEventListener('click', function () {

    const form = document.querySelector('.update-form');
    const formData = new FormData(form);
    const newPasswd = document.getElementById('new-password').value;
    const confirmPasswd = document.getElementById('confirm-new-password').value;

    if (newPasswd !== confirmPasswd) {
        document.querySelector('.update-message').style.display = 'block';
        document.querySelector('.update-message').innerHTML = `
            <h2>New Password and Confirm password do not match</h2>
        `;
        document.getElementById('new-password').style.border = '1px solid red';
        document.getElementById('confirm-new-password').style.border = '1px solid red';
    } else {
        // disable save button
        document.getElementById('save-btn').disabled = true;

        fetch('/profiles/account_update', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // enable save button
            document.getElementById('save-btn').disabled = false;
            if (data.status === 'success') {
                window.location.href = '/profiles/account'
            } else {
                document.querySelector('.update-message').style.display = 'block';
                document.querySelector('.update-message').innerHTML = `
                    <h2>${data.message}</h2>
                `;
            }
        })
        .catch(error => {
            // enable save button
            document.getElementById('save-btn').disabled = false;
            document.querySelector('.update-message').style.display = 'block';
                document.querySelector('.update-message').innerHTML = `
                    <h2>Error: ${error}</h2>
                `;
        });
    }
});

document.getElementById('add-btn').addEventListener('click', function() {
    document.querySelector('.profile-info').style.display = 'none';
    document.querySelector('.profile-pic').style.display = 'none';
    document.getElementById('edit-btn').style.display = 'none';

    document.querySelector('#add-bus-form').style.display = 'block';
});