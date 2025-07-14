import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderNavigation.css';

import HeaderLogo from '../../Logos/HeaderLogo.svg';
import BurgerTablet from '../../Icons/IconBurgerBig.svg';
import BurgerMobile from '../../Icons/IconBurgerSmall.svg';
import IconClose from '../../Icons/IconCloseBig.svg';

export const HeaderNavigation = ({ navItems }) => {
  const navigate = useNavigate();
  // const [isLoggedIn, setIsLoggedIn] = useState(false);
  // const [isAdmin, setIsAdmin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);


  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  const handleScrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // useEffect(() => {
  //   const token = localStorage.getItem('jwt');
  //   if (token) {
  //     setIsLoggedIn(true);

  //     fetch('http://127.0.0.1:8000/api/auth/me', {
  //       headers: {
  //         'Authorization': `Bearer ${token}`,
  //       }
  //     })
  //       .then(response => response.json())
  //       .then(data => {
  //         if (data.role === 'admin') {
  //           setIsAdmin(true);
  //         }
  //       })
  //       .catch(error => console.error('Error fetching user data:', error));
  //   } else {
  //     setIsLoggedIn(false);
  //   }
  // }, []);

  // const navItems = [
  //   ...(isAdmin ? [{ id: 'admin', label: 'Admin', route: '/admin' }] : []),
  //   { id: 'o-nas', label: 'O nas', href: '#o-nas' },
  //   { id: 'nasze-prace', label: 'Nasze prace', href: '#nasze-prace' },
  //   { id: 'jak-umowic', label: 'Jak umówić się?', href: '#kontakt' },
  //   { id: 'nasze-uslugi', label: 'Nasze usługi', href: '#uslugi' },
  //   { id: 'zespol', label: 'Zespół', href: '#zespol' },
  //   { id: 'opinie', label: 'Opinie', href: '#opinie' },
  //   { id: 'kontakty', label: 'Kontakty', href: '#kontakty' },
  //   { id: 'profile', label: isLoggedIn ? 'Profile' : 'Log in', route: isLoggedIn ? '/profile' : '/login' },
  // ];


 return (
    <>
      <div className="header-navigation">
        <div className="header-logo-container">
          <img
            src={HeaderLogo}
            alt="Barber Poznan Logo"
            className="header-logo"
          />
        </div>

        {/* Full navigation (visible on desktop ≥1025px) */}
        <nav className="nav-desktop">
          {navItems.map((item) => (
            <button
              key={item.id}
              className="nav-button"
              onClick={() => {
                if (item.route) {
                  navigate(item.route);
                } else {
                  handleScrollToSection(item.href);
                }
              }}
            >
              {item.label}
            </button>
          ))}
        </nav>

        {/* Burger menu (visible on tablet ≤1024px and phone ≤640px) */}
        <div className="burger-container" onClick={openMenu}>
          <button className="burger-button" aria-label="Open menu">
            <picture>
              {/* If phone, show the small burger */}
              <source srcSet={BurgerMobile} media="(max-width: 640px)" />
              {/* If tablet, show the large burger */}
              <source srcSet={BurgerTablet} media="(max-width: 1024px)" />
              {/* Fallback for desktop */}
              <img className="burger-button-icon" src={BurgerTablet} alt="Menu" />
            </picture>
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="burger-menu-overlay">
          <div className="burger-menu-content">
            <div className="burger-menu-header">
              <img
                src={HeaderLogo}
                alt="Barber Poznan Logo"
                className="burger-menu-logo"
              />

              <button
                className="burger-menu-close-button"
                onClick={closeMenu}
                aria-label="Close menu"
              >
                <img
                  src={IconClose}
                  alt="Close"
                  className="burger-menu-close-icon"
                />
              </button>
            </div>

            <div className="burger-menu-nav">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  className="burger-menu-nav-button"
                  onClick={() => {
                    if (item.route) {
                      navigate(item.route);
                    } else {
                      handleScrollToSection(item.href);
                      closeMenu();
                    }
                  }}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
};
