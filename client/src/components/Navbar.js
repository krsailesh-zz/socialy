import React, {useContext} from 'react'
import { Link } from 'react-router-dom'
import {UserContext} from '../App'

const Navbar = () => {
    const {state,dispatch} = useContext(UserContext)

    const logoutUser = () => {
        localStorage.clear()
        dispatch({type:"CLEAR"})
    }

    const renderList = () => {
        if(state){
            return ([
                <li><Link to="/profile">Profile</Link></li>,
                // <li><Link to="/followinguserposts">Following Users Posts</Link></li>,
                <li><Link to="/create">Create Post</Link></li>,
                <li><Link to="/signin" onClick={()=>logoutUser()} className="btn waves-effect waves-light red darken-1">Logout</Link></li>
            ])
        }
        else{
            return ([
                <li><Link to="/signup">Sign up</Link></li>,
                <li><Link to="/signin">Sign in</Link></li>
            ])
        }
    }

    return (
        <nav>
            <div className="nav-wrapper white">
                <Link to={state?"/":"/signin"} className="brand-logo left">Socially {state?"by " + state.name:""}</Link>
                <ul id="nav-mobile" className="right">
                    {renderList()}
                </ul>
            </div>
        </nav>
    );
}

export default Navbar