import React from 'react'
import './Navbar.css'
import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <nav className="navbar">
      <h1 className="navbar__title">
        <Link to="/">Movies</Link>
      </h1>
    </nav>
  )
}

export default Navbar