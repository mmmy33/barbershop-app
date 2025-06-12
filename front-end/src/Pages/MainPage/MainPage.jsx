import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma/css/bulma.min.css';

import { HeaderNavigation } from '../../sections/HeaderNavigation/HeaderNavigation';
import { HeroSection } from '../../sections/HeroSection/HeroSection';
import { AboutUsSection } from '../../sections/AboutUsSection/AboutUsSection';
import { OurWorkSection } from '../../sections/OurWorkSection/OurWorkSection';
import { HowToBookSection } from '../../sections/HowToBookSection/HowToBookSection';
import { ServicesSection} from '../../sections/ServicesSection/ServicesSection';
import { ReviewsSection } from '../../sections/ReviewsSection/ReviewsSection';
import { BarbersSection } from '../../sections/BarbersSection/BarbersSection';
import { FooterSection } from '../../sections/FooterSection/FooterSection';

export const MainPage = () => {
  return (
    <>
      <HeaderNavigation />
      <HeroSection />
      <div className="main-container">
        <AboutUsSection />
        <OurWorkSection />
        <HowToBookSection />
        <ServicesSection />
        <ReviewsSection />
        <BarbersSection />
      </div>
      <FooterSection />
    </>
  )
}