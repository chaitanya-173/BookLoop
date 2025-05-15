import React from 'react'
import { NavLink } from 'react-router-dom'

import { FaHome } from "react-icons/fa";

const Navbar = () => {
  return (
    <div className='flex flex-row gap-4 place-content-evenly'>
      <NavLink
      to="/">
        Home
      </NavLink>

      <NavLink
      to="/pastes">
        Pastes
      </NavLink>
    </div>
  )
}

export default Navbar

