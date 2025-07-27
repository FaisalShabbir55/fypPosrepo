import React, { useState } from 'react';
import './signup.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import emailjs from '@emailjs/browser';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    // EmailJS configuration
    const EMAILJS_SERVICE_ID = 'service_u96y7bx';
    const EMAILJS_TEMPLATE_ID = 'template_z8w7ubc';
    const EMAILJS_PUBLIC_KEY = 'sNp_8ujlFAPgxFptv';

    const handleName = (e) => setName(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleConfirmPassword = (e) => setConfirmPassword(e.target.value);

    const validateEmail = (email) => {
        if (!email) return 'Email is required';
        const valid = String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
        return valid ? '' : 'Email is invalid';
    };

    const validatePassword = (password) => {
        if (!password) return 'Password is required';
        if (password.length < 6) return 'Password must be at least 6 characters';
        return '';
    };

    // Function to send welcome email
    const sendWelcomeEmail = async (userEmail, userName) => {
        try {
            const templateParams = {
                to_email: userEmail,
                to_name: userName,
                from_name: 'POS System',
                message: `Welcome to our POS System! Your account has been successfully created.`,
                signup_time: new Date().toLocaleString(),
                account_details: 'Your account is now active and ready to use.',
                next_steps: 'You can now log in and start using all the features of our POS system.',
                subject: 'Welcome to POS System - Account Created Successfully'
            };

            const result = await emailjs.send(
                EMAILJS_SERVICE_ID,
                EMAILJS_TEMPLATE_ID,
                templateParams,
                EMAILJS_PUBLIC_KEY
            );

            console.log('Welcome email sent successfully:', result);
            return true;
        } catch (error) {
            console.error('Failed to send welcome email:', error);
            return false;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (!name || !email || !password || !confirmPassword) {
            setError('All fields are required');
            setIsLoading(false);
        } else if (emailError) {
            setError(emailError);
            setIsLoading(false);
        } else if (passwordError) {
            setError(passwordError);
            setIsLoading(false);
        } else if (password !== confirmPassword) {
            setError('Passwords do not match');
            setIsLoading(false);
        } else {
            setError('');

            try {
                const response = await axios.post('http://localhost:3001/api/auth/signup', {
                    name,
                    email,
                    password
                });

                if (response.data.success) {
                    // Send welcome email
                    const emailSent = await sendWelcomeEmail(email, name);
                    
                    // Show success message
                    if (emailSent) {
                        alert(`🎉 Account created successfully!\n\n📧 A welcome email has been sent to: ${email}\n\nRedirecting to login...`);
                    } else {
                        alert(`🎉 Account created successfully!\n\n⚠️ Note: Welcome email could not be sent, but your account was created successfully.\n\nRedirecting to login...`);
                    }
                    
                    // Redirect to login page
                    navigate('/login');
                } else {
                    setError(response.data.message || 'Signup failed');
                }
            } catch (err) {
                console.error('Signup error:', err);
                if (err.response && err.response.data && err.response.data.message) {
                    setError(err.response.data.message);
                } else {
                    setError('Error occurred during signup');
                }
            } finally {
                setIsLoading(false);
            }
        }
    };

    return (
        <div className='signup-container'>
            <div className='form-container'>
                <div className='header'>
                    <h1>Sign Up</h1>
                    <div className='auth-links'>
                        <Link to="/login" className='logout-link'>LOGIN</Link>
                        <span className='separator'>/</span>
                        <span className='dashboard-text'>Admin Portal</span>
                    </div>
                </div>

                <div className='form-section'>
                    <h3>Create your account</h3>
                    
                    {error && <div className='error-message'>{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className='form-group'>
                            <label htmlFor='name'>Full Name</label>
                            <input 
                                id='name'
                                type='text' 
                                placeholder='Enter Full Name' 
                                onChange={handleName} 
                                value={name}
                                required
                            />
                        </div>

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
                                placeholder='Enter Password (min 6 characters)' 
                                onChange={handlePassword} 
                                value={password}
                                required
                            />
                        </div>

                        <div className='form-group'>
                            <label htmlFor='confirmPassword'>Confirm Password</label>
                            <input 
                                id='confirmPassword'
                                type='password' 
                                placeholder='Confirm Password' 
                                onChange={handleConfirmPassword} 
                                value={confirmPassword}
                                required
                            />
                        </div>

                        <button 
                            type='submit' 
                            className='save-btn'
                            disabled={isLoading}
                        >
                            {isLoading ? 'Creating Account...' : 'Create Account'}
                        </button>
                    </form>

                    <div className='auth-footer'>
                        <p>Already have an account? <Link to="/login">Login here</Link></p>
                    </div>
                </div>
            </div>
        </div>
    );
}

