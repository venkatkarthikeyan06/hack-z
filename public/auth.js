document.addEventListener('DOMContentLoaded', () => {
    // Handle login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('login-email').value.trim();
            const password = document.getElementById('login-password').value.trim();

            if (!email || !password) {
                alert('Please fill in all fields.');
                return;
            }

            try {
                const response = await fetch('/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password }),
                });

                if (response.ok) {
                    const { token } = await response.json();
                    localStorage.setItem('token', token);
                    // Redirect to personalization.html after successful login
                    window.location.href = '/personalization.html';
                } else {
                    const error = await response.json();
                    alert(`Login unsuccessful: ${error.error || 'Unknown error'}`);
                }
            } catch (err) {
                console.error('Error logging in:', err);
                alert('Login unsuccessful: An error occurred.');
            }
        });
    }

    // The rest of the script remains unchanged
});