import { useEffect, useState } from 'react';

export function Loader({ duration = 1500 }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), duration);
    return () => clearTimeout(timer);
  }, [duration]);

  if (!visible) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
      }}
    >
      <div style={{marginBottom: 26, fontSize: 28, letterSpacing: 2}}>Barber Poznan #1</div>
      <div className="loader is-loading is-size-3"></div>
    </div>
  );
}
