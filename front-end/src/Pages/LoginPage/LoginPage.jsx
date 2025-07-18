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
          <h1 className="title">Login</h1>
          <form onSubmit={handleSubmit} className="box login-form">
            {error && <p className="notification is-danger">{error}</p>}
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input
                  className="input"
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
              <label className="label">Password</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  placeholder="Password"
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
                  Login
                </button>
              </div>
            </div>
          </form>
          <p className='login-subtitle'>
            Don't have an account? <Link to="/register">Register here</Link>
          </p>
        </div>
      </div>

    </section>
  );
}