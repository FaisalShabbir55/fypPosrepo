import React, { useState } from 'react';
import './signup.css'; // Reuse signup styles
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = 'service_u96y7bx';
    const EMAILJS_TEMPLATE_ID = 'template_z8w7ubc';
    const EMAILJS_PUBLIC_KEY = 'sNp_8ujlFAPgxFptv';

    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const valid = String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        return valid ? '' : 'Email is invalid';
    };

    // Function to send login notification email
    const sendLoginNotification = async (userEmail, userName) => {
        try {
            const templateParams = {
                to_email: userEmail,
                to_name: userName || 'User',
                from_name: 'POS System',
                message: 'You have successfully logged into your POS account.',
                login_time: new Date().toLocaleString(),
                login_location: 'Web Application',
                device_info: navigator.userAgent.split(')')[0] + ')',
                ip_address: 'Your current location', // You can get actual IP if needed
                subject: 'Login Notification - POS System'
            };

            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            console.log('Login notification email sent successfully:', result);
            return true;
        } catch (error) {
            console.error('Failed to send login notification email:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const emailError = validateEmail(email);

        if (!email || !password) {
            setError('All fields are required');
            setIsLoading(false);
        } else if (emailError) {
            setError(emailError);
            setIsLoading(false);
        } else {
            setError('');

            try {
                const response = await axios.post('http://localhost:3001/api/auth/login', {
                    email,
                    password
                });

                if (response.data.success) {
                    // Store user data and token in localStorage
                    localStorage.setItem('token', response.data.token);
                    localStorage.setItem('user', JSON.stringify(response.data.user));
                    
                    // Send login notification email
                    const emailSent = await sendLoginNotification(
                        email, 
                        response.data.user.name || response.data.user.email
                    );
                    
                    // Show success message
                    if (emailSent) {
                        alert(`🎉 Login successful!\n\n📧 A login notification has been sent to your email: ${email}\n\nRedirecting to dashboard...`);
                    } else {
                        alert(`🎉 Login successful!\n\n⚠️ Note: Email notification could not be sent, but login was successful.\n\nRedirecting to dashboard...`);
                    }
                    
                    // Redirect to dashboard or main page
                    navigate('/products');
                } else {
                    setError(response.data.message || 'Login failed');
                }
            } catch (err) {
                console.error('Login error:', err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Error occurred during login');
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='login-container'>
            <div className='form-container login-form'>
                <div className='header'>
                    <h1>Login</h1>
                    <div className='auth-links'>
                        <Link to="/signup" className='logout-link'>SIGNUP</Link>
                        <span className='separator'>/</span>
                        <span className='dashboard-text'>Admin Portal</span>
                    </div>
                </div>

                <div className='form-section'>
                    <h3>Enter your credentials</h3>
                    
                    {error && <div className='error-message'>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor='email'>Email</label>
                            <input 
                                id='email'
                                type='email' 
                                placeholder='Enter Email' 
                                onChange={handleEmail} 
                                value={email}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='password'>Password</label>
                            <input 
                                id='password'
                                type='password' 
                                placeholder='Enter Password' 
                                onChange={handlePassword} 
                                value={password}
                                required
                            />
                        </div>

                        <button 
                            type='submit' 
                            className='save-btn'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Logging in...' : 'Login'}
                        </button>
                    </form>

                    <div className='auth-footer'>
                        <p>Don't have an account? <Link to="/signup">Sign up here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}
