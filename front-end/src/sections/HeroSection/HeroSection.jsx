import './HeroSection.css';
import { ContactButton } from '../../components/ContactButton/ContactButton';

export const HeroSection = () => {
  return (
    <section className="hero-section">
      <div className="hero-overlay">
        <div className="hero-box">
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
