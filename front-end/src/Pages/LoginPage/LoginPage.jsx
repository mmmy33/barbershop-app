import './LoginPage.css'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeaderNavigation } from '../../sections/HeaderNavigation/HeaderNavigation';
import { API_BASE } from '../../api/config';

export function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Login failed');
      }
      const { access_token } = await res.json();
      localStorage.setItem('jwt', access_token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section-login">
      <HeaderNavigation navItems={[
          { id: 'main-page', label: 'Main', route: '/' },
        ]}
      />
      <div className="login-container">
        <div>
          <h1 className="title login-title">Login</h1>
          <form onSubmit={handleSubmit} className="box login-form">
            {error && <p className="notification is-danger">{error}</p>}
            <div className="field">
              <label className="label" htmlFor="email">Email</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  id="email"
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope" />
                </span>
              </div>
            </div>

            <div className="field">
              <label className="label" htmlFor="password">Hasło</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  id="password"
                  placeholder="Hasło"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock" />
                </span>
              </div>
            </div>

            <div className="field">
              <div className="control login-button-container">
                <button className="button is-primary login-button" type="submit">
                  Zaloguj się
                </button>
              </div>
            </div>
          </form>
          <p className='login-subtitle'>
            Nie masz konta? <Link className='login-link' to="/register">Zarejestruj się tutaj</Link>
          </p>
          <p className='reset-password-subtitle'>
            <Link className='reset-password-link' to="/reset-request">
              Zapomniałeś hasła?
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}