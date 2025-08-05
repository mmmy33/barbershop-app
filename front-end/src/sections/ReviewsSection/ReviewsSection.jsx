import './ReviewsSection.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      serviceTitle: 'Tonowanie brody',
      stars: 5,
      authorName: 'Artur',
      text: `Bardzo profesjonalnie, polecam!`,
      reviewer: 'Patryk',
      date: 'Jan 12, 2025',
    },
    {
      id: 2,
      serviceTitle: 'Fade + broda',
      stars: 5,
      authorName: 'Danil',
      text: `Sprawnie i szybko`,
      reviewer: 'Adrian',
      date: 'May 5, 2025',
    },
    {
      id: 3,
      serviceTitle: 'Komplet premium',
      stars: 5,
      authorName: 'Bohdan',
      text: `Chłopak bardzo zadowolony z efektu, mega profesjonalizm i dbałość o szczegóły. Polecam każdemu!`,
      reviewer: 'Wiktoria',
      date: 'May 2, 2025',
    },
    {
      id: 4,
      serviceTitle: 'Strzyżenie klasyczne',
      stars: 5,
      authorName: 'Danil',
      text: `Po raz pierwszy w życiu podobała mi się moja fryzura! Dziękuję za profesjonalizm i dbałość o szczegóły. Zdecydowanie polecam!`,
      reviewer: 'Denis',
      date: 'Jun 10, 2025',
    },
    {
      id: 5,
      serviceTitle: 'Stryżenie klasyczne + broda',
      stars: 5,
      authorName: 'Bohdan',
      text: `Pierwsza wizyta i bardzo pozytywne wrażenie. Super fryzura, bardzo starannie odświeżona broda. Dzięki`,
      reviewer: 'Robert',
      date: 'Jun 10, 2025',
    },
    {
      id: 6,
      serviceTitle: 'Strzyżenie klasyczne',
      stars: 5,
      authorName: 'Artur',
      text: `Miałem okazję skorzystać z strzyżenia przez Artura. Efekt bardziej niż zadawalający.`,
      reviewer: 'Dawid',
      date: 'Jun 10, 2025',
    },
  ];

  return (
    <section className="reviews-section" id='opinie'>
      <h2 className="reviews-title">Opinie</h2>

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
        className="reviews-swiper"
      >
        {reviews.map((rev) => (
          <SwiperSlide key={rev.id}>
            <div className="review-card">
              <div className="review-stars">
                {Array.from({ length: rev.stars }).map((_, i) => (
                  <span key={i} className="star">★</span>
                ))}
              </div>

              <div className="review-service-title">
                {rev.serviceTitle}
              </div>

              <div className="review-author">
                by {rev.authorName}
              </div>

              <div className="review-text">
                {rev.text}
              </div>

              <div className="review-footer">
                <span className="reviewer-name">{rev.reviewer}</span>
                <span className="review-date">• {rev.date}</span>
              </div>
            </div>
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
};
