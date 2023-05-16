import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ name: "", email: "", password: "" });

  const onChange = (e) => {
    setCredentials({ ...credentials, [e.target.name]: [e.target.value] });
  }

  const handleSubmit = async(e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/api/auth/createuser", {
      method:'POST',
      headers:{
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({name:credentials.name, email:credentials.email, password:credentials.password})
    })
    const json = await response.json();
      if(json.success){
        localStorage.setItem("authToken", json.authToken);
        navigate("/");
      }else{
        console.log(json)
        // alert("Something went wrong");
      }

  }


  return (
    <div>
      <h2 className='mt-1'>Create account to use iNotebook</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group my-2">
          <label htmlFor="name">Name</label>
          <input type="text" className="form-control" id="name" name='name' value={credentials.name} placeholder="Enter your name" onChange={onChange} />
        </div>
        <div className="form-group my-2">
          <label htmlFor="email">Email address</label>
          <input type="email" className="form-control" id="email" name='email' value={credentials.email} aria-describedby="emailHelp" placeholder="Enter email" onChange={onChange} />
        </div>
        <div className="form-group my-2">
          <label htmlFor="password">Password</label>
          <input type="password" className="form-control" id="password" value={credentials.password} name='password' placeholder="Set your password" onChange={onChange} />
        </div>
        <button type="submit" className="btn btn-primary my-2">Submit</button>
      </form>
    </div>
  )
}

export default Signup
