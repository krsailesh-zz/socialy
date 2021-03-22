import React, { useEffect, useState, useContext } from 'react'
import { UserContext } from '../../App'
import { Link, useHistory } from 'react-router-dom'
import M from 'materialize-css'

const Home = () => {
    const { state, dispatch } = useContext(UserContext)
    const [allpost, setPost] = useState([])

    useEffect(() => {
        fetch('/subscribedposts', {
            headers: {
                'Authorization': localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                setPost(data)
            })
            .catch(err => console.log(err))
    }, [])

    const likePost = (postId) => {
        fetch('/like', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
            body: JSON.stringify({
                postId
            })
        })
            .then(res => res.json())
            .then(data => {
                const newAllPosts = allpost.map(post => {
                    if (data._id == post._id) {
                        return data
                    }
                    else {
                        return post
                    }
                })
                setPost(newAllPosts)
            })
            .catch(err => console.log(err))
    }

    const unlikePost = (postId) => {
        fetch('/unlike', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
            body: JSON.stringify({
                postId
            })
        })
            .then(res => res.json())
            .then(data => {
                const newAllPosts = allpost.map(post => {
                    if (data._id == post._id) {
                        return data
                    }
                    else {
                        return post
                    }
                })
                setPost(newAllPosts)
            })
            .catch(err => console.log(err))
    }

    const commentPost = (text, postId) => {
        fetch('/comment', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': localStorage.getItem("token")
            },
            body: JSON.stringify({
                text,
                postId
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const newPost = allpost.map((post) => {
                    if (post._id == data._id) {
                        return data
                    }
                    else {
                        return post
                    }
                })

                setPost(newPost)
            })
            .catch(err => console.log(err))
    }

    const deletePost = (postId) => {
        fetch(`/deletepost/${postId}`, {
            method: 'DELETE',
            headers: {
                'Authorization': localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)
                const newPost = allpost.filter((post) => {
                    return post._id != data._id
                })

                setPost(newPost)
                M.toast({ html: "successfully deleted", classes: "#00897b teal darken-1" })
            })
            .catch(err => console.log(err))
    }

    return (
        <div className="home">
            {
                allpost.map((post) => {
                    return (
                        <div key={post._id} className="card home-card">
                            <h5 style={{ padding: "12px 10px 0px 12px" }} className='post-header'>
                            <img className="profile-image" src={post.postedBy.profilepic} style={{ width: '35px', height: '35px' }} />
                                <span><Link to={state._id != post.postedBy._id ? `/profile/${post.postedBy._id}` : "/profile"}>{post.postedBy.name}</Link></span> {
                                    state._id == post.postedBy._id
                                    && <i onClick={() => deletePost(post._id)} className="material-icons" style={{ cursor: "pointer", float: "right" }}>delete</i>
                                } </h5>
                            <div className="card-image">
                                <img src={post.photo} />
                            </div>
                            <div className="card-content">
                                <i className="material-icons" style={{ color: "red" }}>favorite</i>
                                {
                                    post.likes.includes(state._id)
                                        ? <i onClick={() => unlikePost(post._id)} className="material-icons" style={{ marginLeft: "15px", cursor: "pointer" }}>thumb_down</i>
                                        : <i onClick={() => likePost(post._id)} className="material-icons" style={{ marginLeft: "15px", cursor: "pointer" }}>thumb_up</i>
                                }
                                <p>{post.likes.length} likes</p>
                                <h6>{post.title}</h6>
                                <p>{post.body}</p>
                                {
                                    post.comments.map((data) => {
                                        return (
                                            <h6 key={data._id}><span><b>{data.commentedBy.name}</b></span> {data.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {
                                    e.preventDefault()
                                    commentPost(e.target[0].value, post._id)
                                    e.target[0].value = ""
                                }}>
                                    <input type="text" placeholder="comment" />
                                </form>
                            </div>
                        </div>
                    )
                })
            }
        </div>
    )
}

export default Home