import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export const RegistrationPage = () => {
  const [name, setName] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [isLoginForm, setIsLoginForm] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://127.0.0.1:8000/api/auth/register', {
        name,
        phone_number,
        email,
        password,
      });

      if (response.data.token) {
        localStorage.setItem('jwt', response.data.token);
        navigate('/main');
      }
    } catch (error) {
      setErrorMessage('Ошибка регистрации. Попробуйте снова.');
    }
  };

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('https://your-api-endpoint.com/login', {
        email: loginEmail,
        password: loginPassword,
      });


      if (response.data.token) {
        localStorage.setItem('jwt', response.data.token);
        navigate('/main');
      }
    } catch (error) {
      setErrorMessage('Ошибка входа. Проверьте введенные данные.');
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2 has-text-centered">{isLoginForm ? 'Вход' : 'Регистрация'}</h2>
      
      <div className="box">
        {!isLoginForm ? (
          <form onSubmit={handleRegister}>
            <div className="field">
              <label className="label">Имя</label>
              <div className="control">
                <input
                  type="text"
                  className="input"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Номер телефона</label>
              <div className="control">
                <input
                  type="tel"
                  className="input"
                  value={phone_number}
                  onChange={(e) => setPhone_number(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Почта</label>
              <div className="control">
                <input
                  type="email"
                  className="input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Пароль</label>
              <div className="control">
                <input
                  type="password"
                  className="input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="notification is-danger">{errorMessage}</div>
            )}

            <div className="field">
              <div className="control">
                <button type="submit" className="button is-primary is-fullwidth">
                  Зарегистрироваться
                </button>
              </div>
            </div>
          </form>
        ) : (
          <form onSubmit={handleLogin}>
            <div className="field">
              <label className="label">Почта</label>
              <div className="control">
                <input
                  type="email"
                  className="input"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="field">
              <label className="label">Пароль</label>
              <div className="control">
                <input
                  type="password"
                  className="input"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>
            </div>

            {errorMessage && (
              <div className="notification is-danger">{errorMessage}</div>
            )}

            <div className="field">
              <div className="control">
                <button type="submit" className="button is-primary is-fullwidth">
                  Войти
                </button>
              </div>
            </div>
          </form>
        )}
        
        <div className="field">
          <p className="has-text-centered">
            {isLoginForm ? (
              <>
                Нет аккаунта?{' '}
                <a href="#" onClick={() => setIsLoginForm(false)}>Зарегистрироваться</a>
              </>
            ) : (
              <>
                Уже есть аккаунт?{' '}
                <a href="#" onClick={() => setIsLoginForm(true)}>Войти</a>
              </>
            )}
          </p>
        </div>
      </div>
    </div>
  );
};
