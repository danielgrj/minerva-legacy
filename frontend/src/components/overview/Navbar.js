import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { CSSTransitionGroup } from 'react-transition-group'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

import AUTH_SERVICE from './../../services/auth'

import './navbar.css'

export default function Navbar(props) {
  const [isUsernavbarVisible, setIsUsernabarVisible] = useState(false)
  const [ user, setUser ] = useState({})

  useEffect(() => {
    if(localStorage.user) setUser(JSON.parse(localStorage.user))
  }, [])

  const logout = async () => {
    await AUTH_SERVICE.logout()
    localStorage.clear();
    props.history.push('/')
  }

  return (
    <>
      <nav className="navbar">
        <div className="navbar-left">
          <FontAwesomeIcon icon={faBars} />
          <div className="minerva"><Link to="/main">Minerva</Link></div>
        </div>
        <div className="navbar-center">
        </div>
        <div className="navbar-right">
          <div className="avatar" onClick={() => setIsUsernabarVisible(!isUsernavbarVisible)}>
            <img src={user.avatar} alt="user" />
          </div>
        </div>
      </nav>
      <CSSTransitionGroup
        transitionName="navbars"
        transitionEnterTimeout={250}
        transitionLeaveTimeout={200}
      >
        { isUsernavbarVisible ? 
          <nav className="user-sidebar">
            <h3>{user.name}</h3>
            <div className="session">
              <button onClick={logout}>Logout</button>
            </div>
          </nav>
        : undefined }
      </CSSTransitionGroup>
      
    </>
    
  )
}
