import './AboutUsSection.css';

import AboutUsLogo from '../../Logos/AboutUsLogo.svg';
import AboutUsImage from '../../Images/AboutUsImage.png';
import { ContactButton } from '../../components/ContactButton/ContactButton';

export const AboutUsSection = () => {
  return (
    <section className="about-section" id='o-nas'>
      <div className="about-container">
        <div className="about-logo-wrapper">
          <img
            src={AboutUsLogo}
            alt="Barber Poznan Logo"
            className="about-logo"
          />
        </div>

        <div className="about-image-wrapper">
          <img
            src={AboutUsImage}
            alt="Shaving"
            className="about-image"
          />
        </div>

        <div className="about-text-wrapper">
          <div className="about-text-inner">
            <h3 className="about-title">O nas</h3>
            <p className="about-text">
              Jesteśmy w centrum, z łatwym dojazdem. Mówimy po polsku,
              ukraińsku i rosyjsku. Kochamy tworzyć, a Twój uśmiech to
              nasza radość. Stale rozwijamy się, by zapewnić Ci
              najmodniejsze fryzury.
            </p>
            <ContactButton />
          </div>
        </div>
      </div>
    </section>
  );
};
