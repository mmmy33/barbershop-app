import { useEffect } from 'react';
import './OurWorkSection.css';

import OurWorkImg1 from '../../Images/OurWorkImg-1.png';
import OurWorkImg2 from '../../Images/OurWorkImg-2.png';
import OurWorkImg3 from '../../Images/OurWorkImg-3.png';
import OurWorkImg4 from '../../Images/OurWorkImg-4.png';
import OurWorkImg5 from '../../Images/OurWorkImg-5.png';
import OurWorkImg6 from '../../Images/OurWorkImg-6.png';

import mobileOurWorkImg1 from '../../Images/OW-M-1.jpg';
import mobileOurWorkImg2 from '../../Images/OW-M-2.jpg';
import mobileOurWorkImg3 from '../../Images/OW-M-3.jpg';
import mobileOurWorkImg4 from '../../Images/OW-M-4.jpg';
import mobileOurWorkImg5 from '../../Images/OW-M-5.jpg';

export const OurWorkSection = () => {
  const mobileWorkImages = [
    { id: 1, src: mobileOurWorkImg1, alt: 'Work 1' },
    { id: 2, src: mobileOurWorkImg2, alt: 'Work 2' },
    { id: 3, src: mobileOurWorkImg3, alt: 'Work 3' },
    { id: 4, src: mobileOurWorkImg4, alt: 'Work 4' },
    { id: 5, src: mobileOurWorkImg5, alt: 'Work 5' },
  ];

  useEffect(() => {
    if (window.Splide) {
      const splide = new window.Splide('.our-work-splide', {
        type: 'loop',
        perPage: 1,
        gap: 16,
        arrows: false,
        breakpoints: {
          1024: { perPage: 2 },
          640: { perPage: 1 },
        },
      });

      splide.mount();
    } else {
      console.error('Splide is not defined');
    }
  }, []);

  return (
    <section className="our-work-section" id='nasze-prace'>
      <h2 className="our-work-title">Zobacz nasze prace!</h2>

      <div className="our-work-grid">
        <img src={OurWorkImg1} alt="Work 1" className="work-img img-1" />
        <img src={OurWorkImg2} alt="Work 2" className="work-img img-2" />
        <img src={OurWorkImg3} alt="Work 3" className="work-img img-3" />
        <img src={OurWorkImg4} alt="Work 4" className="work-img img-4" />
        <img src={OurWorkImg5} alt="Work 5" className="work-img img-5" />
        <img src={OurWorkImg6} alt="Work 6" className="work-img img-6" />
      </div>

      <div className="work-swiper our-work-splide">
        <div className="splide__track">
          <ul className="splide__list">
            {mobileWorkImages.map((img) => (
              <li key={img.id} className="our-work-slide splide__slide">
                <div className="our-work-slide-wrapper">
                  <img src={img.src} alt={img.alt} className="our-work-img slide-img" />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
