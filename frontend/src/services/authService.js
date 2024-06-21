// authService.js
export async function registerUser(name, email, password) {
    try {
      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
  
      const data = await response.json();
      if (response.ok) {
        console.log('Registration successful', data);
      } else {
        console.error('Registration failed', data);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  }
  