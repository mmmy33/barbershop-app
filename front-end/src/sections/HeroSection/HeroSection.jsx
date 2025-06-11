import React from 'react';
import './HeroSection.css';
import { ContactButton } from '../../components/ContactButton/ContactButton';
import HeroImage from '../../Images/HeroImage.png';

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-left-side">
          <h1 className="hero-title">
            Twój styl,<br /> nasza kawa.
          </h1>
          <p className="hero-text">
            Stwórz swoją nową odsłonę w relaksującej atmosferze – gdzie dbałość
            o detale spotyka się z przyjemnością chwili.
          </p>
          <ContactButton />
        </div>
      </div>
    </section>
  );
};
