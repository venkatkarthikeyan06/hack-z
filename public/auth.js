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
                    window.location.href = '/personalization.html'; // Redirect after login
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
       // Handle register form submission
       const registerForm = document.getElementById('register-form');
       if (registerForm) {
           registerForm.addEventListener('submit', async (e) => {
               e.preventDefault();
               const name = document.getElementById('register-name').value.trim();
               const email = document.getElementById('register-email').value.trim();
               const password = document.getElementById('register-password').value.trim();
   
               if (!name || !email || !password) {
                   alert('Please fill in all fields.');
                   return;
               }
   
               try {
                   const response = await fetch('/register', {
                       method: 'POST',
                       headers: { 'Content-Type': 'application/json' },
                       body: JSON.stringify({ name, email, password }),
                   });
   
                   if (response.ok) {
                       alert('Registration successful! You can now log in.');
                       registerForm.reset();
                   } else {
                       const error = await response.json();
                       alert(`Registration failed: ${error.error || 'Unknown error'}`);
                   }
               } catch (err) {
                   console.error('Error registering:', err);
                   alert('Registration failed: An error occurred.');
               }
           });
       }
   
       // Modal functionality
       const loginModal = document.getElementById('loginModal');
       const registerModal = document.getElementById('registerModal');
       const loginLink = document.getElementById('login-link');
       const registerLink = document.getElementById('register-link');
       const closeLogin = document.getElementById('closeLogin');
       const closeRegister = document.getElementById('closeRegister');
   
       if (loginLink && registerLink && loginModal && registerModal) {
           loginLink.onclick = () => (loginModal.style.display = 'block');
           registerLink.onclick = () => (registerModal.style.display = 'block');
           closeLogin.onclick = () => (loginModal.style.display = 'none');
           closeRegister.onclick = () => (registerModal.style.display = 'none');
   
           window.onclick = (event) => {
               if (event.target === loginModal) loginModal.style.display = 'none';
               if (event.target === registerModal) registerModal.style.display = 'none';
           };
       }
});
