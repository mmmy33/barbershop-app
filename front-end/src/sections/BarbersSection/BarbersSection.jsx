import './BarbersSection.css';
import { ContactButton } from '../../components/ContactButton/ContactButton';

import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';

import BarberImg3 from '../../Images/BarberBohdan.png';
import BarberImg2 from '../../Images/BarberDanil.png';
import BarberImg1 from '../../Images/BarberArtur.png';

export const BarbersSection = () => {
  const barbers = [
    { id: 1, name: 'Artur', img: BarberImg1 },
    { id: 2, name: 'Daniel', img: BarberImg2 },
    { id: 3, name: 'Bohdan', img: BarberImg3 },
  ];

  return (
    <section className="barbers-section" id='zespol'>

      <h2 className="barbers-title">Pasja, precyzja, Twoje zadowolenie!</h2>
      <div className="barbers-grid">
        {barbers.map((barber) => (
          <div key={barber.id} className="barber-card">
            <img src={barber.img} alt={barber.name} className="barber-image" />
          </div>
        ))}
      </div>

      {/* Mobile slider */}
      <div className="barbers-swiper">
        <Swiper
          spaceBetween={24}
          slidesPerView={1.5}
          centeredSlides={true}
          initialSlide={1}
          pagination={{ clickable: true }}
        >
          {barbers.map((barber) => (
            <SwiperSlide key={barber.id}>
              <div className="barber-card">
                <img src={barber.img} alt={barber.name} className="barber-image" />
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>

      <div className="barbers-cta">
        <h2 className="barbers-cta-title">Masz dość złych fryzur?</h2>
        <div className="barbers-cta-button-box">
          <ContactButton />
        </div>
        
      </div>
    </section>
  );
};
