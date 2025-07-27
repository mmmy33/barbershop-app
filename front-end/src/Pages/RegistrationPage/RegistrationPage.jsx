// import './RegistrationPage.css';
// import { useState } from 'react';
// import { useNavigate, Link } from 'react-router-dom';
// import { HeaderNavigation } from '../../sections/HeaderNavigation/HeaderNavigation';
// import { API_BASE, getAuthHeaders } from '../../api/config';


// export function RegistrationPage() {
//   const [step, setStep] = useState(1);           // 1 — ввод данных, 2 — ввод кода
//   const [name, setName] = useState('Admin');
//   const [email, setEmail] = useState('');
//   const [phone, setPhone] = useState('48');
//   const [password, setPassword] = useState('Admin1234!');
//   const [code, setCode] = useState('');
//   const [error, setError] = useState(null);

//   const navigate = useNavigate();
//   const API_BASE = '/api';

//   async function handleRegister(e) {
//     e.preventDefault();
//     setError(null);
//     try {
//       const res = await fetch(`${API_BASE}/auth/register`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({
//           name,
//           email,
//           password,
//           phone_number: phone
//         }),
//       });
//       const text = await res.text();
//       // Проверяем специальное сообщение от сервера
//       if (res.status === 400 && text.includes('Verification code already sent')) {
//         setStep(2);
//         setError('Verification code already sent. Please check your email and enter the code below.');
//         return;
//       }
//       if (res.status !== 201) throw new Error(text || 'Registration failed');
//       setStep(2);
//     } catch (err) {
//       try {
//         const obj = JSON.parse(err.message);
//         setError(obj.detail || err.message);
//       } catch {
//         setError(err.message);
//       }
//     }
//   }

// // Шаг 2: верификация кода (активирует аккаунт)
//   async function handleVerify(e) {
//     e.preventDefault();
//     setError(null);
//     try {
//       const params = new URLSearchParams({ email, code });
//       const res = await fetch(`${API_BASE}/auth/verify-email?${params}`, {
//         method: 'POST'
//       });
//       const text = await res.text();
//       if (res.status !== 200) throw new Error(text || 'Verification failed');
//       // после верификации нужно залогиниться, или сразу направить пользователя на логин
//       navigate('/login');
//     } catch (err) {
//       setError(err.message);
//     }
//   }

//   return (
//     <section className="section-registration">
//       <HeaderNavigation navItems={[
//          { id: 'main-page', label: 'Main', route: '/' },
//         ]}
//       />
//       <div className="registration-container">
//         <h1 className="title">
//           {step === 1 ? 'Utwórz konto' : 'Email Verification'}
//         </h1>

//         {error && (
//           <div className="notification is-danger">
//             {error}
//           </div>
//         )}

//         {step === 1
//           ?
//           <form onSubmit={handleRegister} className="box registration-form">
//             {/* Name */}
//             <div className="field">
//               <label className="label">Imię</label>
//               <div className="control has-icons-left">
//                 <input
//                   className="input"
//                   type="text"
//                   placeholder="Your name"
//                   value={name}
//                   onChange={e => setName(e.target.value)}
//                   required
//                 />
//                 <span className="icon is-small is-left">
//                   <i className="fas fa-user" />
//                 </span>
//               </div>
//             </div>

//             {/* Email */}
//             <div className="field">
//               <label className="label">Email</label>
//               <div className="control has-icons-left">
//                 <input
//                   className="input"
//                   type="email"
//                   placeholder="you@example.com"
//                   value={email}
//                   onChange={e => setEmail(e.target.value)}
//                   required
//                 />
//                 <span className="icon is-small is-left">
//                   <i className="fas fa-envelope" />
//                 </span>
//               </div>
//             </div>

//             {/* Phone */}
//             <div className="field">
//               <label className="label">Numer telefonu</label>
//               <div className="control has-icons-left">
//                 <input
//                   className="input"
//                   type="tel"
//                   placeholder="+48123456789"
//                   value={phone}
//                   onChange={e => setPhone(e.target.value)}
//                   required
//                 />
//                 <span className="icon is-small is-left">
//                   <i className="fas fa-phone" />
//                 </span>
//               </div>
//             </div>

//             {/* Password */}
//             <div className="field">
//               <label className="label">Hasło</label>
//               <div className="control has-icons-left">
//                 <input
//                   className="input"
//                   type="password"
//                   placeholder="••••••••"
//                   value={password}
//                   onChange={e => setPassword(e.target.value)}
//                   required
//                 />
//                 <span className="icon is-small is-left">
//                   <i className="fas fa-lock" />
//                 </span>
//               </div>
//             </div>

//             {/* Submit */}
//             <div className="field">
//               <div className="control">
//                 <button className="button is-primary registration-button" type="submit">
//                   Zweryfikuj
//                 </button>
//               </div>
//             </div>
//           </form>

//           : // Code verification step
//           <form onSubmit={handleVerify} className="box registration-form">
//             <div className="field">
//               <label className="label">Verification Code</label>
//               <div className="control">
//                 <input
//                   className="input"
//                   type="text"
//                   placeholder="Enter code"
//                   value={code}
//                   onChange={e => setCode(e.target.value)}
//                   required
//                 />
//               </div>
//             </div>

//             <div className="field">
//               <div className="control">
//                 <button className="button is-success" type="submit">
//                   Verify & Continue
//                 </button>
//               </div>
//             </div>
//           </form>
//         }

//         <p className="login-link">
//           {step === 1
//             ? <>Already have an account? <Link to="/login">Login here</Link></>
//             : <>Didn't get code? <button onClick={() => setStep(1)} className="button is-text">Try again</button></>
//           }
//         </p>
//       </div>
//     </section>
//   );
// }

import './RegistrationPage.css';
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { HeaderNavigation } from '../../sections/HeaderNavigation/HeaderNavigation';

export function RegistrationPage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('+48');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState(null);

  // поля для ошибок
  const [nameError, setNameError] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');

  const navigate = useNavigate();
  const API_BASE = '/api';

  // Валидация
  const validateName = (value) => /^[A-Za-zżźćńółęąśŻŹĆĄŚĘŁÓŃ\s-]+$/.test(value);
  const validatePhone = (value) => /^\+48\d{9}$/.test(value);
  const validatePassword = (value) =>
    /[A-Z]/.test(value) && /\d/.test(value) && /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(value) && value.length >= 8;
  const validateEmail = (value) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

  // Обработчик регистрации
  async function handleRegister(e) {
    e.preventDefault();
    setError(null);

    // Проверка полей
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

  // Шаг 2: верификация кода
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

        <p className="login-link">
          {step === 1
            ? <>Już masz konto? <Link to="/login">Zaloguj się</Link></>
            : <>Nie otrzymałeś kodu? <button onClick={() => setStep(1)} className="button is-text">Spróbuj ponownie</button></>
          }
        </p>
      </div>
    </section>
  );
} 