import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma/css/bulma.min.css';

import { useState, useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';

import { Loader } from './components/Loader/Loader';

import { LoginPage } from './Pages/LoginPage/LoginPage';
import { RegistrationPage } from './Pages/RegistrationPage/RegistrationPage';
import { MainPage } from './Pages/MainPage/MainPage';
import { AdminPage } from './Pages/AdminPage/AdminPage';
import { UserProfilePage } from './Pages/UserProfilePage/UserProfilePage';
import { AppointmentsPage } from './Pages/AppointmentsPage/AppointmentsPage';
import { EditProfilePage } from './Pages/EditProfilePage/EditProfilePage';
import { ResetPasswordRequestPage } from './Pages/ResetPasswordRequestPage/ResetPasswordRequestPage';
import { ResetPasswordConfirmPage } from './Pages/ResetPasswordConfirmPage/ResetPasswordConfirmPage';

function App() {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

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
      <Route path="/profile" element={<UserProfilePage />} />
      <Route path="/admin" element={<AdminPage />} />
      <Route path="/appointments" element={<AppointmentsPage />} />
      <Route path="/edit" element={<EditProfilePage user={user} setUser={setUser} />} />
      <Route path="/reset-request" element={<ResetPasswordRequestPage />} />
      <Route path="/reset-confirm" element={<ResetPasswordConfirmPage />} />
    </Routes>
  );
}

export default App;
