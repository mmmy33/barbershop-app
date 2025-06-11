import './App.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bulma/css/bulma.min.css';

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

import { RegistrationPage } from './components/Registration/Registration';
import { Main } from './components/Main/Main';

function App() {
  const isAuthenticated = localStorage.getItem('jwt');

  return (
    <Router>
      <Routes>
        {!isAuthenticated ? (
          <Route path="/" element={<RegistrationPage />} />
        ) : (
          <Route path="/" element={<Navigate to="/main" />} />
        )}

        <Route
          path="/main"
          element={<Main />}
        />
      </Routes>
    </Router>
  );
}

export default App;
