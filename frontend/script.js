document.getElementById('registerForm').addEventListener('submit', async function(event) {
    event.preventDefault();
    
    const phoneNumber = document.getElementById('phoneNumber').value;
    const errorMessage = document.getElementById('error-message');
    const successMessage = document.getElementById('success-message');
    
    // Simple phone number validation (just checking for basic format like +1234567890)
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (!phoneRegex.test(phoneNumber)) {
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
        return;
    }
    
    // Clear error message if valid
    errorMessage.style.display = 'none';

    try {
        const response = await fetch('http://localhost:6000/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ phoneNumber })
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                successMessage.style.display = 'block';
            }
        } else {
            errorMessage.style.display = 'block';
        }
    } catch (err) {
        console.error('Error:', err);
        errorMessage.style.display = 'block';
    }
});
