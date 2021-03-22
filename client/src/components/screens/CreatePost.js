import React, { useState, useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const CreatePost = () => {
    const history = useHistory()
    const [title, setTitle] = useState("")
    const [body, setBody] = useState("")
    const [url, setUrl] = useState("")
    const [photo, setPhoto] = useState("")

    useEffect(() => {
        if (url) {
            fetch('/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                },
                body: JSON.stringify({
                    title,
                    body,
                    url
                })
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: "#e53935 red darken-1" })
                    }
                    else {
                        M.toast({ html: 'posted successfully!', classes: "#00897b teal darken-1" })
                        console.log(data)
                        history.push('/')
                    }
                })
                .catch(err => console.log(err))
        }
    }, [url])

    const postData = () => {
        const formData = new FormData()
        formData.append('file', photo)
        formData.append('cloud_name', 'dyvfmtztg')
        formData.append('upload_preset', 'insta_clone')

        if (title && body) {
            fetch('https://api.cloudinary.com/v1_1/dyvfmtztg/image/upload', {
                method: 'POST',
                body: formData
            })
                .then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: "please upload a photo", classes: "#e53935 red darken-1" })
                    }
                    else {
                        setUrl(data.url)
                    }
                })
                .catch(err => console.log(err))
        }
        else{
            M.toast({ html: "Fill all the fields", classes: "#e53935 red darken-1" })
        }
    }

    return (
        <div className='card input-field' style={{ margin: "60px auto", padding: "30px 20px", textAlign: "center" }}>
            <input type="text" placeholder="title" value={title} onChange={(e) => setTitle(e.target.value)} />
            <input type="text" placeholder="body" value={body} onChange={(e) => setBody(e.target.value)} />
            <div className="file-field input-field">
                <div className="btn">
                    <span>Upload photo</span>
                    <input type="file" onChange={(e) => { setPhoto(e.target.files[0]) }} />
                </div>
                <div className="file-path-wrapper">
                    <input className="file-path validate" type="text" />
                </div>
            </div>
            <button className="btn waves-effect waves-light blue darken-1" onClick={() => postData()}>Submit Post</button>
        </div>
    );
}

export default CreatePost