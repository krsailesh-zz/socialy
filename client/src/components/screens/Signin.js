import React, {useState, useContext} from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'
import {UserContext} from '../../App'

const Signin = () => {
    const {state,dispatch} = useContext(UserContext)
    let history = useHistory()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const signinData = () => {
        if(!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) && email){
            M.toast({html: 'invalid email', classes:"#e53935 red darken-1"})
            return
        }
        fetch('/signin',{
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email,
                password
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error, classes:"#e53935 red darken-1"})
            }
            else{
                localStorage.setItem("token",data.token)
                localStorage.setItem("user",JSON.stringify(data.user))
                dispatch({type:"USER", payload:data.user})
                M.toast({html: 'signedin successfully!', classes:"#00897b teal darken-1"})
                console.log(data)
                history.push('/')
            }
        })
        .catch(err => console.log(err))
    }

    return (
        <div className='my-card'>
            <div className='card' style={{textAlign:"center", padding: '20px'}}>
                <h2 style={{"font-family": 'Grand Hotel'}}>Socially</h2>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br/>
                <br/>
                <button className="btn waves-effect waves-light blue darken-1" onClick={()=>signinData()}>Signin</button>
                <br/>
                <br/>
                <Link to='/signup'>Don't have an account?</Link>
            </div>
        </div>
    );
}

export default Signin