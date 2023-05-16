import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate();

    const [cred, setCred] = useState({email:"", password:""});

    const onChange = (e) => {
        setCred({...cred, [e.target.name]: [e.target.value]});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        const response = await fetch("http://localhost:5000/api/auth/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email:cred.email, password:cred.password })
        })
        const json = await response.json();
        if(json.success){
            // save token in the local storage and redirect
            localStorage.setItem('authToken', json.authToken);
            navigate("/");
        }else{
            alert("Invalid credentials");
        }
    }

    return (
        <div>
            <h2 className='mt-1'>Login to see your notes</h2>
            <form onSubmit={handleSubmit}>
                <div className="form-group my-2">
                    <label htmlFor="email">Email address</label>
                    <input type="email" className="form-control" id="email" name='email' value={cred.email} aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange} />
                    <small id="emailHelp" className="form-text text-muted">We'll never share your email with anyone else.</small>
                </div>
                <div className="form-group my-2">
                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" value={cred.password} name='password' placeholder="Password" onChange={onChange} />
                </div>
                <button type="submit" className="btn btn-primary my-2">Submit</button>
            </form>
        </div>
    )
}

export default Login
