

import React, { useState } from 'react';
import './signup.css';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Sidebar from '../Layout/sidebar.js';

export default function Signup() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('');
    const [error, setError] = useState('');
    const [submit, setSubmit] = useState(false);

    const handleName = (e) => setName(e.target.value);
    const handleEmail = (e) => setEmail(e.target.value);
    const handlePassword = (e) => setPassword(e.target.value);
    const handleRole = (e) => setRole(e.target.value);

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
        if (password.length < 8) return 'Password must be at least 8 characters';
        if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) return 'Password must contain a special character';
        return '';
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const emailError = validateEmail(email);
        const passwordError = validatePassword(password);

        if (!name || !email || !password || !role) {
            setError('All fields are required');
        } else if (emailError) {
            setError(emailError);
        } else if (passwordError) {
            setError(passwordError);
        } else {
            setError('');

            axios.post('http://localhost:3001/api/auth/signup', {
                name,
                email,
                password,
                role
            })
            .then((response) => {
                if (response.data.success) {
                    setSubmit(true);
                } else {
                    setError(response.data.message);
                }
            })
            .catch((err) => {
                console.error('Signup error:', err);
                setError('Error occurred during signup');
            });
        }
    };

    return (
        <div className='main'>
            <Sidebar />
            <div className='form-container'>
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


















//1
// import React from 'react'
// import './signup.css'
// import { useState } from 'react'

// import { Link } from 'react-router-dom';


// import axios from 'axios'

// export default function Signup() {
//     const [name, setName] = useState('');
//     const[email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError ] = useState('')
//     const [submit, setSubmit] = useState('')

//     function handleName (e) {
//         setName(e.target.value)
//     }

//     function handleEmail(e){
//         setEmail(e.target.value)
//     }
//      const validateEmail = (email) => {
//         if (email===''){
//             return "email is required"
//         }
//         else{

//           const Valid =  String(email)
//             .toLowerCase()
//             .match(
//               /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//             );
//             return Valid ? '' : "email is inValid"
//         }
       
//       };

//     function handlePassword(e){
//         setPassword(e.target.value)
//     }
//     const validatePassword=( password) =>{

//         if (password.length <8){
//             return 'password should be atleast 8 charcters long';

//         } 
//         else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//             return 'Password should contain at least one special character';
//         } else {
//             return '';
//         }
//     } 


// function handleSubmit (e){
//     e.preventDefault();
//     const emailError = validateEmail(email);
//     const passwordError = validatePassword(password)
//     if (name === '' || email === '' || password === '') {
//         setError('All fields are required');
//     } else if (emailError) {
//         setError(emailError);
//     } else if (passwordError) {
//         setError(passwordError);
//     } else {
//         setError('');

//         axios.post('http://localhost:3001/api/signup', { name, email, password })
//         .then(response => {
//             if (response.data.success) {
//                 setSubmit(true);
//             } else {
//                 setError(response.data.message);
//             }
//         })
//         .catch(error => {
//             console.error('There was an error!', error);
//             setError('Error occurred during signup');
//         });
        

//         setSubmit(true);
//     }

// }

//   return (



//     <div className='main' >
//         <div className='form-container'>  
//       {error && <div style={{ color: 'red' }}>{error}</div>}
//       {submit && <div style={{ color: 'green' }}>Signup successful!</div>}
    
//     <input type='text'  placeholder='Name' 
//      onChange={handleName} value={name}
    
//     ></input>

//     <input
//     type='text' placeholder='Email'
//     value={email} onChange={handleEmail}
    
//     >
//     </input>

//     <input
//     type='text' placeholder='password'
//     value={password} onChange={handlePassword}
//     >
//     </input>
      
// <button  onClick={handleSubmit}  type='submit'>
//     Signup</button>
//     <p>Already have an account? <Link to="/login">Login here</Link></p>
//     </div>
//     </div>


//   )
// }































//2

// import React, { useState } from 'react';
// import './signup.css';
// import { Link } from 'react-router-dom';
// import axios from 'axios';


// export default function Signup() {



//     console.log("Signup component rendered"); 
//     const [name, setName] = useState('');
//     const [email, setEmail] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');
//     const [submit, setSubmit] = useState('');

//     const handleName = (e) => {
//         setName(e.target.value);
//     };

//     const handleEmail = (e) => {
//         setEmail(e.target.value);
//     };

//     const validateEmail = (email) => {
//         if (email === '') {
//             return 'Email is required';
//         } else {
//             const valid = String(email)
//                 .toLowerCase()
//                 .match(
//                     /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
//                 );
//             return valid ? '' : 'Email is invalid';
//         }
//     };

//     const handlePassword = (e) => {
//         setPassword(e.target.value);
//     };

//     const validatePassword = (password) => {
//         if (password.length < 8) {
//             return 'Password should be at least 8 characters long';
//         } else if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
//             return 'Password should contain at least one special character';
//         } else {
//             return '';
//         }
//     };

//     const handleSubmit = (e) => {
//         e.preventDefault();
//         const emailError = validateEmail(email);
//         const passwordError = validatePassword(password);

//         if (name === '' || email === '' || password === '') {
//             setError('All fields are required');
//         } else if (emailError) {
//             setError(emailError);
//         } else if (passwordError) {
//             setError(passwordError);
//         } else {
//             setError('');

//             axios.post('http://localhost:3001/api/auth/signup', { name, email, password })
//                 .then(response => {
//                     if (response.data.success) {
//                         setSubmit(true);
//                     } else {
//                         setError(response.data.message);
//                     }
//                 })
//                 .catch(error => {
//                     console.error('There was an error!', error);
//                     setError('Error occurred during signup');
//                 });
//         }
//     };

//     return (      
        
        
//         <div className='main'>
//             <div className='form-container'>
//                 {error && <div style={{ color: 'red' }}>{error}</div>}
//                 {submit && <div style={{ color: 'green' }}>Signup successful!</div>}

//                 <input type='text' placeholder='Name' onChange={handleName} value={name} />
//                 <input type='text' placeholder='Email' value={email} onChange={handleEmail} />
//                 <input type='text' placeholder='Password' value={password} onChange={handlePassword} />

//                 <button onClick={handleSubmit} type='submit'>
//                     Signup
//                 </button>
//                 <p>Already have an account? <Link to="/login">Login here</Link></p>
//                 <p>productspage <Link to="/products">Login here</Link></p>
                
//             </div>
//         </div>
//     );
// }

