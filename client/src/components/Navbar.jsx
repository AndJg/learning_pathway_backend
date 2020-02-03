import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>logo</h1>
            <ul>
                <li>
                    <Link to="/">HOME</Link>
                </li>
                <li>
                    <Link to="/login">Login</Link>
                </li>

                <li>
                    <Link to="/user">USER</Link>
                </li>
            </ul>
        </nav>
    );
};

export default Navbar;
