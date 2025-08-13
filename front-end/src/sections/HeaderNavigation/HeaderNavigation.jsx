import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HeaderNavigation.css';

import HeaderLogo from '../../Logos/HeaderLogo.svg';
import BurgerTablet from '../../Icons/IconBurgerBig.svg';
import BurgerMobile from '../../Icons/IconBurgerSmall.svg';
import IconClose from '../../Icons/IconCloseBig.svg';

export const HeaderNavigation = ({ navItems }) => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  useEffect(() => {
    if (isMenuOpen) {
      document.body.classList.add('no-scroll');
    } else {
      document.body.classList.remove('no-scroll');
    }
    return () => document.body.classList.remove('no-scroll');
  }, [isMenuOpen]);

  const handleScrollToSection = (href) => {
    const element = document.querySelector(href);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

 return (
    <>
      <div className="header-navigation">
        <div className="header-logo-container">
          <a href="/">
            <img
              src={HeaderLogo}
              alt="Barber Poznan Logo"
              className="header-logo"
            />
          </a>
        </div>

        {/* Full navigation (visible on desktop ≥1025px) */}
        <nav className="nav-desktop">
          {navItems.map((item) => (
            <button
              key={item.id}
              className="nav-button"
              onClick={() => {
                if (item.action) {
                  item.action();
                } else if (item.route) {
                  navigate(item.route);
                } else if (item.href) {
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
                    closeMenu();
                    if (item.action) {
                      item.action();
                    } else if (item.route) {
                      navigate(item.route);
                    } else if (item.href) {
                      setTimeout(() => handleScrollToSection(item.href), 100);
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
