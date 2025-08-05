import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeaderNavigation } from '../../sections/HeaderNavigation/HeaderNavigation';
import { FooterSection } from '../../sections/FooterSection/FooterSection';
import './RegistrationPage.css';

export function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+48');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  // Error fields
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate();
  const API_BASE = '/api';

  // Validation functions
  const validateName = (value) => /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s-]+$/.test(value);
  const validatePhone = (value) => /^\+48\d{9}$/.test(value);
  const validatePassword = (value) =>
    /[A-Z]/.test(value) && /\d/.test(value) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) && value.length >= 8;
  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Registration handler
  async function handleRegister(e) {
    e.preventDefault();
    setError(null);

    // Validate fields
    let valid = true;
    if (!validateName(name)) {
      setNameError('Imię może zawierać tylko litery i spacje');
      valid = false;
    } else setNameError('');

    if (!validateEmail(email)) {
      setEmailError('Wprowadź poprawny adres email');
      valid = false;
    } else setEmailError('');

    if (!validatePhone(phone)) {
      setPhoneError('Wprowadź numer w formacie +48123456789');
      valid = false;
    } else setPhoneError('');

    if (!validatePassword(password)) {
      setPasswordError('Minimalna długość 8 znaków, jedna wielka litera, jedna cyfra i jeden znak specjalny');
      valid = false;
    } else setPasswordError('');

    if (!valid) return;

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
      if (res.status === 400 && text.includes('Verification code already sent')) {
        setStep(2);
        setError('Kod weryfikacyjny został już wysłany. Sprawdź swoją skrzynkę i wprowadź kod poniżej.');
        return;
      }
      if (res.status !== 201) throw new Error(text || 'Rejestracja nie powiodła się');
      setStep(2);
    } catch (err) {
      try {
        const obj = JSON.parse(err.message);
        setError(obj.detail || err.message);
      } catch {
        setError(err.message);
      }
    }
  }

  // Step 2: Verify email
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
        <h1 className="title registration-title">
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
                  className={`input${nameError ? ' is-danger' : ''}`}
                  type="text"
                  placeholder="Imię"
                  value={name}
                  onChange={e => {
                    setName(e.target.value);
                    setNameError('');
                  }}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-user" />
                </span>
              </div>
              {nameError && <p className="help is-danger">{nameError}</p>}
            </div>

            {/* Email */}
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input
                  className={`input${emailError ? ' is-danger' : ''}`}
                  type="email"
                  placeholder="email@example.com"
                  value={email}
                  onChange={e => {
                    setEmail(e.target.value);
                    setEmailError('');
                  }}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-envelope" />
                </span>
              </div>
              {emailError && <p className="help is-danger">{emailError}</p>}
            </div>

            {/* Phone */}
            <div className="field">
              <label className="label">Telefon</label>
              <div className="control has-icons-left">
                <input
                  className={`input${phoneError ? ' is-danger' : ''}`}
                  type="tel"
                  placeholder="+48123456789"
                  value={phone}
                  onChange={e => {
                    setPhone(e.target.value);
                    setPhoneError('');
                  }}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-phone" />
                </span>
              </div>
              {phoneError && <p className="help is-danger">{phoneError}</p>}
            </div>

            {/* Password */}
            <div className="field">
              <label className="label">Hasło</label>
              <div className="control has-icons-left">
                <input
                  className={`input${passwordError ? ' is-danger' : ''}`}
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => {
                    setPassword(e.target.value);
                    setPasswordError('');
                  }}
                  required
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock" />
                </span>
              </div>
              {passwordError && <p className="help is-danger">{passwordError}</p>}
            </div>

            {/* Submit */}
            <div className="field">
              <div className="control">
                <button className="button is-primary registration-button" type="submit">
                  Zarejestruj
                </button>
              </div>
            </div>
          </form>
          :
          <form onSubmit={handleVerify} className="box registration-form verify-form">
            <div className="field">
              <label className="label verify-label">Kod weryfikacyjny</label>
              <div className="control">
                <input
                  className="input verify-input"
                  type="text"
                  placeholder="Wprowadź kod"
                  value={code}
                  onChange={e => setCode(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <div className="control">
                <button className="button is-success" type="submit">
                  Zweryfikuj i kontynuuj
                </button>
              </div>
            </div>
          </form>
        }

        <p className="registration-login-text">
          {step === 1
            ? <>Już masz konto? <Link className="registration-login-link" to="/login">Zaloguj się</Link></>
            : <>Nie otrzymałeś kodu? <button onClick={() => setStep(1)} className="button is-text">Spróbuj ponownie</button></>
          }
        </p>
      </div>
      <FooterSection />
    </section>
  );
} 