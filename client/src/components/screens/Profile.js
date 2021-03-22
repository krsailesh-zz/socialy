import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'

const Profile = () => {
    const { state, dispatch } = useContext(UserContext)
    const [myPosts, setMyposts] = useState([])
    const [updatepicurl, setUpdatepicurl] = useState("")

    useEffect(() => {
        fetch('/myposts', {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                setMyposts(data.posts)
            })
    }, [])

    useEffect(() => {
        if (updatepicurl) {
            fetch('/updateprofilepic', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': localStorage.getItem("token")
                },
                body: JSON.stringify({
                    url: updatepicurl
                })
            })
                .then(res => res.json())
                .then(data => {
                    localStorage.setItem('user', JSON.stringify(data))
                    dispatch({ type: 'UPDATEPROPIC', payload: { profilepic: updatepicurl } })
                })
        }
    }, [updatepicurl])

    const updatepropic = (file) => {
        const formData = new FormData()
        formData.append('file', file)
        formData.append('cloud_name', 'dyvfmtztg')
        formData.append('upload_preset', 'insta_clone')

        fetch('https://api.cloudinary.com/v1_1/dyvfmtztg/image/upload', {
            method: 'POST',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                setUpdatepicurl(data.url)
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="profile">
            <div className="profile-up row">
                <div className="file-field input-field" style={{marginLeft: '12%'}}>
                    <div className="circle">
                        <img className="profile-pic" src={state ? state.profilepic : "loading..."} style={{clipPath: 'circle()'}}/>
                    </div>
                    <div className="p-image">
                        <span><i className="material-icons upload-button">camera_alt</i></span>
                        <input type="file" onChange={(e) => { updatepropic(e.target.files[0]) }} className="file-upload" />
                    </div>
                </div>

                <div className="col m8">
                    <h3>{state ? state.name : "loading..."}</h3>
                    <div className="profile-status">
                        <h6>{myPosts.length} posts</h6>
                        <h6>{state ? state.followers.length : 0} followers</h6>
                        <h6>{state ? state.following.length : 0} following</h6>
                    </div>
                </div>
            </div>

            <div className="profile-down">
                {
                    myPosts.map(post => {
                        return (
                            <img key={post._id} className="post-image" src={post.photo} />
                        )
                    })
                }
            </div>
        </div>
    );
}

export default Profile