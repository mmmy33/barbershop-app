import React, { useEffect, useState } from 'react';
import './HowToBookSection.css';

import HowToBookImage from "../../Images/HowToBookImage.png";
import { ContactButton } from '../../components/ContactButton/ContactButton';

export const HowToBookSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const steps = [
    'Wprowadzić dane osobiste',
    'Wybierz barbera',
    'Wybierz service',
    'Umów się o wizytę',
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveStep((prevStep) => (prevStep + 1) % steps.length);
    }, 1200);

    return () => clearInterval(interval);
  }, [steps.length]);

  return (
    <section className="how-to-book-section" id='kontakt'>
      <div className="how-to-book-upper-box">
        <h2 className="how-to-book-title">Jak Umówić się? To Proste!</h2>
        
        <div className="stepper-box desktop-stepper">
          {steps.map((step, index) => (
            <React.Fragment key={index}>
              <span
                className={`step ${index === activeStep ? 'active' : ''}`}
              >
                {step}
              </span>
              {index < steps.length - 1 && (
                <span className="step-separator">&gt;</span>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="how-to-book-lower-box">
        <img src={HowToBookImage} alt="How to book" className="how-to-book-image" />
        <div className="how-to-book-right-box">
          <h2 className="how-to-book-title bottom-margin">
            Nie tylko fryzura. <br /> To cały rytuał.
          </h2>
          <p className='how-to-book-text'>
            W Barber Poznań #1 zadbamy o Twój wygląd i samopoczucie.
            Usiądź wygodnie, wybierz ulubiony napój – kawa, energetyk albo
            zimna Coca-Cola są w cenie. O resztę zadbamy my.
          </p>
          <ContactButton />
        </div>
      </div>
    </section>
  );
};
