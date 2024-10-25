// Toggle edit mode
document.getElementById('edit-btn').addEventListener('click', function () {
    document.getElementById('name-display').style.display = 'none';
    document.getElementById('email-display').style.display = 'none';
    document.getElementById('designation-display').style.display = 'none';
    
    document.getElementById('edit-fields').style.display = 'block';

    document.getElementById('edit-btn').style.display = 'none';
    document.getElementById('save-btn').style.display = 'inline-block';
});

// Save the changes and update display
document.getElementById('save-btn').addEventListener('click', function () {
    const name = document.getElementById('name-input').value;
    const email = document.getElementById('email-input').value;
    const designation = document.getElementById('designation-input').value;

    // Update the display values
    document.getElementById('name-display').textContent = name;
    document.getElementById('email-display').textContent = email;
    document.getElementById('designation-display').textContent = designation;

    // Hide the edit fields
    document.getElementById('edit-fields').style.display = 'none';

    // Show the updated display fields
    document.getElementById('name-display').style.display = 'block';
    document.getElementById('email-display').style.display = 'block';
    document.getElementById('designation-display').style.display = 'block';

    // Switch back to edit mode
    document.getElementById('edit-btn').style.display = 'inline-block';
    document.getElementById('save-btn').style.display = 'none';
});
