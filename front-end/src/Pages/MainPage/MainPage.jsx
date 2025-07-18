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
      <HeaderNavigation
        navItems={[
          { id: 'o-nas', label: 'O nas', href: '#o-nas' },
          { id: 'nasze-prace', label: 'Nasze prace', href: '#nasze-prace' },
          { id: 'jak-umowic', label: 'Jak umówić się?', href: '#kontakt' },
          { id: 'nasze-uslugi', label: 'Nasze usługi', href: '#uslugi' },
          { id: 'zespol', label: 'Zespół', href: '#zespol' },
          { id: 'profile', label: 'Profile' , route: '/profile'},
          { id: 'opinie', label: 'Opinie', href: '#opinie' },
          { id: 'kontakty', label: 'Kontakty', href: '#kontakty' },
        ]}
      />
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