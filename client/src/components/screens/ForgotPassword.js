import React, { useState } from 'react'
import M from 'materialize-css'
import {useParams, useHistory} from 'react-router-dom'

const ForgotPassword = () => {
    const params = useParams()
    const history = useHistory()
    const [password, setPassword] = useState('')

    const resetPassword = () => {
        fetch('/newpassword', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                password,
                token: params.token
            })
        })
        .then(res => res.json())
        .then(data => {
            if(data.error){
                M.toast({html: data.error, classes:"#e53935 red darken-1"})
            }
            else{
                M.toast({html: data.message, classes:"#00897b teal darken-1"})
                history.push('/signin')
            }
        })
    }

    return (
        <div className='my-card'>
            <div className='card' style={{ textAlign: "center", padding: '20px' }}>
                <h2 style={{ "font-family": 'Grand Hotel' }}>Socially</h2>
                <input
                    type='password'
                    placeholder='new password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <br />
                <br />
                <button className="btn waves-effect waves-light blue darken-1" onClick={() => resetPassword()}>Confirm</button>
            </div>
        </div>
    );
}

export default ForgotPassword