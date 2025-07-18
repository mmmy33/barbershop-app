import './RegistrationPage.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeaderNavigation } from '../../sections/HeaderNavigation/HeaderNavigation';
// import { API_BASE, getAuthHeaders } from '../../api/config';


export function RegistrationPage() {
  const [step, setStep] = useState(1);           // 1 — ввод данных, 2 — ввод кода
  const [name, setName] = useState('Admin');
  const [email, setEmail] = useState('dimitrenkok73@gmail.com');
  const [phone, setPhone] = useState('48566620292');
  const [password, setPassword] = useState('Admin1234!');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_BASE = '/api';

  // Шаг 1: регистрация (отправляет код на почту)
  async function handleRegister(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone_number: phone
        }),
      });
      const text = await res.text();
      if (res.status !== 201) throw new Error(text || 'Registration failed');
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
  }

  // Шаг 2: верификация кода (активирует аккаунт)
  async function handleVerify(e) {
    e.preventDefault();
    setError(null);
    try {
      const params = new URLSearchParams({ email, code });
      const res = await fetch(`${API_BASE}/auth/verify-email?${params}`, {
        method: 'POST'
      });
      const text = await res.text();
      if (res.status !== 200) throw new Error(text || 'Verification failed');
      // после верификации нужно залогиниться, или сразу направить пользователя на логин
      navigate('/login');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section-registration">
      <HeaderNavigation navItems={[
         { id: 'main-page', label: 'Main', route: '/' },
        ]}
      />
      <div className="registration-container">
        <h1 className="title">
          {step === 1 ? 'Utwórz konto' : 'Email Verification'}
        </h1>

        {error && (
          <div className="notification is-danger">
            {error}
          </div>
        )}

        {step === 1
          ?
          <form onSubmit={handleRegister} className="box registration-form">
            {/* Name */}
            <div className="field">
              <label className="label">Imię</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="text"
                  placeholder="Your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user" />
                </span>
              </div>
            </div>

            {/* Email */}
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope" />
                </span>
              </div>
            </div>

            {/* Phone */}
            <div className="field">
              <label className="label">Numer telefonu</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="tel"
                  placeholder="+48123456789"
                  value={phone}
                  onChange={e => setPhone(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-phone" />
                </span>
              </div>
            </div>

            {/* Password */}
            <div className="field">
              <label className="label">Hasło</label>
              <div className="control has-icons-left">
                <input
                  className="input"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock" />
                </span>
              </div>
            </div>

            {/* Submit */}
            <div className="field">
              <div className="control">
                <button className="button is-primary registration-button" type="submit">
                  Zweryfikuj
                </button>
              </div>
            </div>
          </form>

          : // Code verification step
          <form onSubmit={handleVerify} className="box registration-form">
            <div className="field">
              <label className="label">Verification Code</label>
              <div className="control">
                <input
                  className="input"
                  type="text"
                  placeholder="Enter code"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button className="button is-success" type="submit">
                  Verify & Continue
                </button>
              </div>
            </div>
          </form>
        }

        <p className="login-link">
          {step === 1
            ? <>Already have an account? <Link to="/login">Login here</Link></>
            : <>Didn't get code? <button onClick={() => setStep(1)} className="button is-text">Try again</button></>
          }
        </p>
      </div>
    </section>
  );
}

