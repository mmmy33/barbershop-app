import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma/css/bulma.min.css';

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Loader } from './components/Loader/Loader';
import { LoginPage } from './Pages/LoginPage/LoginPage';
import { RegistrationPage } from './Pages/RegistrationPage/RegistrationPage';
import { MainPage } from './Pages/MainPage/MainPage';
import { UserProfile } from './Pages/UserProfile/UserProfile';
import AdminPage from './Pages/AdminPage/AdminPage';
import { AppointmentsPage } from './Pages/AppointmentsPage/AppointmentsPage.jsx';



function App() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return <Loader />;
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/" element={<MainPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} /> {/*barberId={1} */}
    </Routes>
  );
}

export default App;
