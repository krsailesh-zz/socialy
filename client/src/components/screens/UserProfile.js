import React, { useState, useEffect, useContext } from 'react'
import { useParams } from 'react-router-dom'
import { UserContext } from '../../App'

const UserProfile = () => {
    const { state, dispatch } = useContext(UserContext)
    const { userid } = useParams()
    const [userprofile, setUserprofile] = useState(null)

    useEffect(() => {
        fetch(`/user/${userid}`, {
            method: 'GET',
            headers: {
                'Authorization': localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                setUserprofile(data)
            })
            .catch(err => console.log(err))
    }, [])

    const followUser = () => {
        fetch(`/follow/${userid}`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: 'UPDATE', payload: { followers: data.followingUser.followers, following: data.followingUser.following } })
                localStorage.setItem("user", JSON.stringify(data.followingUser))
                // console.log(data.followedUser)
                setUserprofile(pre => {
                    return {
                        ...pre,
                        user: data.followedUser
                    }
                })
            })
            .catch(err => console.log(err))
    }

    const unfollowUser = () => {
        fetch(`/unfollow/${userid}`, {
            method: 'PUT',
            headers: {
                'Authorization': localStorage.getItem("token")
            }
        })
            .then(res => res.json())
            .then(data => {
                dispatch({ type: 'UPDATE', payload: { followers: data.followingUser.followers, following: data.followingUser.following } })
                localStorage.setItem("user", JSON.stringify(data.followingUser))
                setUserprofile(pre => {
                    return {
                        ...pre,
                        user: data.followedUser
                    }
                })
            })
            .catch(err => console.log(err))
    }

    return (
        <>
            {
                userprofile
                    ? <div className="profile">
                        <div className="profile-up row">
                            <div className="col m2">
                                <img className="profile-image" src={userprofile.user.profilepic} />
                            </div>
                            <div className="col m8">
                                <h4>{userprofile.user.name}</h4>
                                <h5>{userprofile.user.email}</h5>
                                <div className="profile-status">
                                    <h6>{userprofile.posts.length} posts</h6>
                                    <h6>{userprofile.user.followers.length} follower</h6>
                                    <h6>{userprofile.user.following.length} following</h6>
                                </div>
                                {
                                    userprofile.user.followers.includes(state._id)
                                        ?
                                        <button className="waves-effect waves-light btn blue darken-1 btn-small" onClick={() => unfollowUser()} style={{ marginTop: '8px' }}>Unfollow</button>
                                        :
                                        <button className="waves-effect waves-light btn blue darken-1 btn-small" onClick={() => followUser()} style={{ marginTop: '8px' }}>Follow</button>
                                }
                            </div>
                        </div>

                        <div className="profile-down">
                            {
                                userprofile.posts.map(post => {
                                    return (
                                        <img key={post._id} className="post-image" src={post.photo} />
                                    )
                                })
                            }
                        </div>
                    </div>

                    :
                    <h3>Loading...</h3>
            }
        </>
    );
}

export default UserProfile