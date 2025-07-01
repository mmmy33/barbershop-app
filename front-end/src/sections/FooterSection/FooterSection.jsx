import './FooterSection.css';
import { ContactButton } from '../../components/ContactButton/ContactButton';

export const FooterSection = () => {
  return (
    <footer className="footer-section">
      <div className="footer-cta">
        <h2 className="footer-cta-title">Masz dość złych fryzur?</h2>
        <ContactButton />
      </div>

      <div className="footer-bottom" id='kontakty'>
        <div className="footer-map-container">
          <a
            href="https://goo.gl/maps/djvQtDkHuvndrRmt9"
            target="_blank"
            rel="noopener noreferrer"
            className="footer-map-link"
            title="Zobacz na mapie Google"
          >
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2450.803234391503!2d16.918408916008385!3d52.39508467977366!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x4704cad6cafdd0d5%3A0xfa35f01d611d4f49!2sGrobla%201B%2C%2061-827%20Pozna%C5%84%2C%20Polska!5e0!3m2!1sen!2sde!4v1695678888888!5m2!1sen!2sde"
              width="100%"
              height="240"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              title="Grobla 1B Poznań"
            ></iframe>
          </a>
        </div>

        <div className="footer-info-container">
          <div className="footer-contact">
            <div>
              <div className="footer-contact-item">
                <i className="fas fa-map-marker-alt footer-icon"></i>
                <a
                  href="https://goo.gl/maps/djvQtDkHuvndrRmt9"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="footer-contact-link"
                >
                  Grobla 1B
                </a>
              </div>

              <div className="footer-contact-item">
                <i className="fas fa-phone footer-icon"></i>
                <a href="tel:+48883776309" className="footer-contact-link">
                  883 776 309
                </a>
              </div>
            </div>

            <div className='footer-socials'>
              <a
                href="https://www.facebook.com/YourBarberPoznan"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook-f"></i>
              </a>
              <a
                href="https://www.instagram.com/barber.poznan1?igsh=MWRmNmc2YTJhOWFhag=="
                target="_blank"
                rel="noopener noreferrer"
                className="footer-social-link"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </div>
          </div>

          <div className="footer-hours">
            <div className="footer-copy">
              <p>©2025 Barber Poznań №1</p>
            </div>

            <div>
              <div>Pon–Sob: 9:00 – 20:00</div>
              <div>Niedziela: 9:00 – 18:00</div>
            </div>
          </div>
        </div>
      </div>
    </footer>

  );
};
