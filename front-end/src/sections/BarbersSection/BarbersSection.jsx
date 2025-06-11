import './BarbersSection.css';

import BarberImg1 from '../../Images/BarberDanil.png';
import BarberImg2 from '../../Images/BarberArtur.png';

export const BarbersSection = () => {
  const barbers = [
    { id: 1, name: 'Daniel', img: BarberImg1 },
    { id: 2, name: 'Artur', img: BarberImg2 },
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
    </section>
  );
};
