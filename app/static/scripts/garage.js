document.getElementById('garage-setup-form').addEventListener('submit', function (event) {
    event.preventDefault();

    // Get form values
    const garageName = document.getElementById('garage-name').value;
    const garageEmail = document.getElementById('garage-email').value;
    const garageLocation = document.getElementById('garage-location').value;
    const userPassword = document.getElementById('user-password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    // Validate password match
    if (userPassword !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    // Simulate form submission (for this example)
    alert(`Garage Setup Complete:
    Garage Name: ${garageName}
    Garage Email: ${garageEmail}
    Location: ${garageLocation}`);
});
