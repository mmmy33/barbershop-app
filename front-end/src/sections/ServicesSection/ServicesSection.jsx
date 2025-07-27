import './ServicesSection.css';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';

import ServiceImg1 from '../../Images/Service-1.png';
import ServiceImg2 from '../../Images/Service-1.png';
import ServiceImg3 from '../../Images/Service-1.png';
import ServiceImg4 from '../../Images/Service-1.png';
import ServiceImg5 from '../../Images/Service-1.png';
import ServiceImg6 from '../../Images/Service-1.png';

export const ServicesSection = () => {
  const services = [
    { id: 1, img: ServiceImg1, title: 'Premium Komplet (włosy + broda)' },
    { id: 2, img: ServiceImg2, title: 'Strzyżenie klasyczne' },
    { id: 3, img: ServiceImg3, title: 'Barberskie modelowanie brody' },
    { id: 4, img: ServiceImg4, title: 'Goleniowa sesja pielęgnacyjna' },
    { id: 5, img: ServiceImg5, title: 'Koloryzacja włosów' },
    { id: 6, img: ServiceImg6, title: 'Męska regeneracja skóry głowy' },
  ];

  return (
    <section className="services-section" id='uslugi'>
      <h2 className="services-title">Nasze usługi</h2>
      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        loop={true}
        breakpoints={{
          1440: { slidesPerView: 4 },
          1024: { slidesPerView: 3 },
          640: { slidesPerView: 2 },
          320: { slidesPerView: 1 }
        }}
        className="services-swiper"
      >
        {services.map((svc) => (
          <SwiperSlide key={svc.id} className="services-swiper-slide">
            <div className="service-card">
              <img src={svc.img} alt={svc.title} className="service-image" />
              <div className="service-info">
                <span className="service-name">{svc.title}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
