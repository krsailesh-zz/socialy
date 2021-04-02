import React, { useContext, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { UserContext } from '../App'
import M from 'materialize-css'

const Navbar = () => {
    const searchModel = useRef(null)
    const [search, setSearch] = useState('')
    const [searchedusers, setSearchedUsers] = useState([])
    const { state, dispatch } = useContext(UserContext)

    const logoutUser = () => {
        localStorage.clear()
        dispatch({ type: "CLEAR" })
    }

    const triggerSearchModel = () => {
        M.Modal.init(searchModel.current)
    }

    const searchUsers = (query) => {
        setSearch(query)
        fetch('/search-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                query
            })
        })
            .then(res => res.json())
            .then(users => {
                setSearchedUsers(users)
            })
            .catch(err => console.log(err))
    }

    const renderList = () => {
        if (state) {
            return ([
                <li key="1"><i onClick={() => triggerSearchModel()} href="#modal1" className="material-icons modal-trigger" style={{ color: 'black', cursor: 'pointer' }}>search</i></li>,
                <li key="2"><Link to="/profile">Profile</Link></li>,
                // <li><Link to="/followinguserposts">Following Users Posts</Link></li>,
                <li key="3"><Link to="/create">Create Post</Link></li>,
                <li key="4"><Link to="/signin" onClick={() => logoutUser()} className="btn waves-effect waves-light red darken-1">Logout</Link></li>
            ])
        }
        else {
            return ([
                <li key="5"><Link to="/signup">Sign up</Link></li>,
                <li key="6"><Link to="/signin">Sign in</Link></li>
            ])
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state ? "/" : "/signin"} className="brand-logo left">Socially {state ? "by " + state.name : ""}</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
            <div ref={searchModel} id="modal1" className="modal" style={{ color: 'black' }}>
                <div className="modal-content">
                    <input
                        type='text'
                        placeholder='Search users'
                        value={search}
                        onChange={(e) => searchUsers(e.target.value)}
                    />
                    <ul className="collection">
                        {
                            searchedusers.map((user) => {
                                return <Link to={user._id !==state._id ? "/profile/"+user._id : "/profile"} key={user._id}><li onClick={() => {
                                    M.Modal.getInstance(searchModel.current).close()
                                    setSearch('')
                                    setSearchedUsers([])
                                }} className="collection-item">{user.email}</li>
                                </Link>
                            })
                        }
                    </ul>
                </div>
                <div className="modal-footer">
                    <a className="modal-close waves-effect waves-green btn-flat" onClick={() => {
                        setSearch('')
                        setSearchedUsers([])
                    }}>Close</a>
                </div>
            </div>
        </nav>
    );
}

export default Navbar