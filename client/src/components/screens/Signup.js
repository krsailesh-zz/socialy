import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Signup = () => {
    let history = useHistory()
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [profilepic, setProfilepic] = useState("")
    const [picurl, setPicurl] = useState(undefined)

    useEffect(() => {
        if(picurl){
            submitAllfields()
        }
    },[picurl])

    const uploadPic = () => {
        const formData = new FormData()
        formData.append('file', profilepic)
        formData.append('cloud_name', 'dyvfmtztg')
        formData.append('upload_preset', 'insta_clone')

        fetch('https://api.cloudinary.com/v1_1/dyvfmtztg/image/upload', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                setPicurl(data.url)
            })
            .catch(err => console.log(err))
    }

    const submitAllfields = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) && email) {
            M.toast({ html: 'invalid email', classes: "#e53935 red darken-1" })
            return
        }
        fetch('/signup', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                profilepic:picurl
            })
        })
            .then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: "#e53935 red darken-1" })
                }
                else {
                    M.toast({ html: 'saved successfully!', classes: "#00897b teal darken-1" })
                    history.push('/signin')
                }
            })
            .catch(err => console.log(err))
    }

    const signupData = () => {
        if (profilepic) {
            uploadPic()
        }
        else {
            submitAllfields()
        }
    }

    return (
        <div className='my-card'>
            <div className='card' style={{ textAlign: "center" , padding: '20px'}}>
                <h2 style={{ "font-family": 'Grand Hotel' }}>Socially</h2>
                <input
                    type='text'
                    placeholder='Name'
                    value={name}
                    onChange={(e) => { setName(e.target.value) }}
                />
                <div className="file-field input-field">
                    <div className="btn">
                        <span>Upload photo</span>
                        <input type="file" onChange={(e) => { setProfilepic(e.target.files[0]) }} />
                    </div>
                    <div className="file-path-wrapper">
                        <input className="file-path validate" type="text" />
                    </div>
                </div>
                <input
                    type='email'
                    placeholder='Email'
                    value={email}
                    onChange={(e) => { setEmail(e.target.value) }}
                />
                <input
                    type='password'
                    placeholder='Password'
                    value={password}
                    onChange={(e) => { setPassword(e.target.value) }}
                />
                <br />
                <br />
                <button className="btn waves-effect waves-light blue darken-1" onClick={() => signupData()} >Signup</button>
                <br />
                <br />
                <Link to='/signin'>Already have an account?</Link>
            </div>
        </div>
    );
}

export default Signup