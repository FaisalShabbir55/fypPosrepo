import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../Layout/sidebar.js';
import './signup.css';

function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState(false);

    const handleName = (e) => {
        setName(e.target.value);
    };

    const handleEmail = (e) => {
        setEmail(e.target.value);
    };

    const handlePassword = (e) => {
        setPassword(e.target.value);
    };

    const handleRole = (e) => {
        setRole(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!name || !email || !password || !role) {
            setError('Please fill in all fields.');
            return;
        }

        try {
            const response = await fetch('https://your-api-endpoint.com/signup', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, role }),
            });

            if (response.ok) {
                setSubmit(true);
                setError('');
                setName('');
                setEmail('');
                setPassword('');
                setRole('');
                setTimeout(() => {
                    setSubmit(false);
                }, 3000);
            } else {
                const data = await response.json();
                setError(data.message || 'Signup failed');
            }
        } catch (err) {
            setError('An error occurred during signup.');
        }
    };

    return (
        <div className='main' style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            padding: '20px'
        }}>
            <Sidebar />
            <div className='form-container' style={{
                maxWidth: '500px',
                width: '100%',
                margin: '0 auto',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center'
            }}>
                <div className='header'>
                    <h1>Registration</h1>
                    <div className='auth-links'>
                        <Link to="/login" className='logout-link'>LOGIN</Link>
                        <span className='separator'>/</span>
                        <span className='dashboard-text'>Admin Dashboard</span>
                    </div>
                </div>
                <div className='form-section'>
                    <h3>Enter new User Info</h3>
                                    
                    {error && <div className='error-message'>{error}</div>}
                    {submit && <div className='success-message'>Signup successful!</div>}
                    <div className='form-group'>
                        <label htmlFor='name'>Name</label>
                        <input 
                            id='name'
                            type='text' 
                            placeholder='Enter User Name' 
                            onChange={handleName} 
                            value={name} 
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
                        />
                    </div>
                    <div className='form-group'>
                        <label htmlFor='role'>Role</label>
                        <select 
                            id='role'
                            onChange={handleRole} 
                            value={role}
                            className='role-select'
                        >
                            <option value="">Select Role</option>
                            <option value="admin">Admin</option>
                            <option value="manager">Manager</option>
                            <option value="employee">Employee</option>
                        </select>
                    </div>
                    <button onClick={handleSubmit} type='submit' className='save-btn'>Save</button>
                </div>
            </div>
        </div>
    );
}

export default Signup;
