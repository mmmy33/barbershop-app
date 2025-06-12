import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma/css/bulma.min.css';

import { Routes, Route, Navigate } from 'react-router-dom';

import { LoginPage } from './Pages/LoginPage/LoginPage';
import { RegistrationPage } from './Pages/RegistrationPage/RegistrationPage';
import { MainPage } from './Pages/MainPage/MainPage';

function App() {
  const isAuthenticated = localStorage.getItem('jwt');

  return (
    <Routes>
      <Route path="/" element={isAuthenticated ? <Navigate to="/main" /> : <LoginPage />} />
      <Route path="/main" element={isAuthenticated ? <MainPage /> : <Navigate to="/" />} />
      <Route path="/register" element={<RegistrationPage />} />
    </Routes>
  );
}

export default App;
