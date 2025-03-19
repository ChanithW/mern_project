import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

function Header() {
  const location = useLocation();
  const [activeLink, setActiveLink] = useState(location.pathname);

  useEffect(() => {
    setActiveLink(location.pathname); // Update active link whenever the location changes
  }, [location]);

  return (
    <header className="bg-green-600 text-white p-4">
      <nav className="flex justify-center space-x-6">
        <Link
          to="/"
          className={`hover:text-black ${activeLink === '/' ? 'text-black' : ''}`}
        >
          Home
        </Link>
        <Link
          to="/about-us"
          className={`hover:text-black ${activeLink === '/about-us' ? 'text-black' : ''}`}
        >
          About Us
        </Link>
        <Link
          to="/faq"
          className={`hover:text-black ${activeLink === '/faq' ? 'text-black' : ''}`}
        >
          FAQ
        </Link>
      </nav>
    </header>
  );
}

export default Header;

