import './ReviewsSection.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Pagination } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/pagination';

export const ReviewsSection = () => {
  const reviews = [
    {
      id: 1,
      serviceTitle: 'Tonowania brody',
      stars: 5,
      authorName: 'Daniel',
      text: `Serdecznie dziękuję mistrzowi Daniel za wykonaną pracę. W salonie panuje wyjątkowa atmosfera, a zespół wyróżnia się uprzejmością, komunikatywnością i pełnym profesjonalizmem. Z pełnym przekonaniem polecam to miejsce.`,
      reviewer: 'Mikita P',
      date: 'Jan 12, 2025',
    },
    {
      id: 2,
      serviceTitle: 'Fade + broda',
      stars: 5,
      authorName: 'Artur',
      text: `Profesjonalizm w każdym calu. Fryzura idealna, broda dopracowana. A do tego energetyk i dobra rozmowa – czego chcieć więcej?`,
      reviewer: 'Agnieszka S',
      date: 'May 5, 2025',
    },
    {
      id: 3,
      serviceTitle: 'Komplet premium',
      stars: 5,
      authorName: 'Daniel',
      text: `Profesjonalizm w każdym calu. Fryzura idealna, broda dopracowana. A do tego energetyk i dobra rozmowa – czego chcieć więcej?`,
      reviewer: 'Yan K',
      date: 'May 2, 2025',
    },
    {
      id: 4,
      serviceTitle: 'Strzyżenie klasyczne',
      stars: 5,
      authorName: 'Bartek',
      text: `Świetne podejście, polecam każdemu. Atmosfera jak w domu, a efekt na głowie—rewelacja.`,
      reviewer: 'Katarzyna W',
      date: 'Jun 10, 2025',
    },
    {
      id: 5,
      serviceTitle: 'Strzyżenie klasyczne',
      stars: 5,
      authorName: 'Bartek',
      text: `Świetne podejście, polecam każdemu. Atmosfera jak w domu, a efekt na głowie—rewelacja.`,
      reviewer: 'Katarzyna W',
      date: 'Jun 10, 2025',
    },
    {
      id: 6,
      serviceTitle: 'Strzyżenie klasyczne',
      stars: 5,
      authorName: 'Bartek',
      text: `Świetne podejście, polecam każdemu. Atmosfera jak w domu, a efekt na głowie—rewelacja.`,
      reviewer: 'Katarzyna W',
      date: 'Jun 10, 2025',
    },
  ];

  return (
    <section className="reviews-section" id='opinie'>
      <h2 className="reviews-title">Opinie</h2>

      <Swiper
        modules={[Pagination]}
        spaceBetween={24}
        pagination={{ clickable: true }}
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
