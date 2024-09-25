function goBack() {
    window.history.back('passengers_home.html');
}

const prices = {
    multimedia: 50.00,
    downtown: 100.00,
    airport: 150.00,
    cbd: 200
};

function updatePrice() {
    const destination = document.getElementById('destination').value;
    const priceDisplay = document.getElementById('price');
    if (destination in prices) {
        priceDisplay.innerHTML = prices[destination].toFixed(2);
    } else {
        priceDisplay.innerHTML = "0.00";
    }
}

function sendPayment() {
    const selectedBillingMethod = document.querySelector('input[name="billing"]:checked');
    const seatNumber = document.getElementById('seat-number').value;
    const destination = document.getElementById('destination').value;

    if (!selectedBillingMethod) {
        alert("Please select a billing method.");
        return;
    }

    if (!destination) {
        alert("Please select a destination.");
        return;
    }

    alert(`Payment sent for seat ${seatNumber} to ${destination} using ${selectedBillingMethod.value}.`);
}

function refundPayment() {
    // Logic to handle refunds
    alert("Refund initiated.");
}
