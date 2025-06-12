import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api.js';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, refresh_token } = response.data;
      if (access_token) {
        localStorage.setItem('jwt', access_token);
        if (refresh_token) {
          localStorage.setItem('refreshToken', refresh_token);
        }
        navigate('/main');
      }
    } catch (error) {
      setErrorMessage('Ошибка входа. Проверьте введенные данные.');
    }
  };

  return (
    <div className="container">
      <h2 className="title is-2 has-text-centered">Вход</h2>
      <div className="box">
        <form onSubmit={handleLogin}>
          <div className="field">
            <label className="label">Почта</label>
            <div className="control">
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Введите вашу почту"
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
                placeholder="Введите ваш пароль"
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

          <div className="field">
            <p className="has-text-centered">
              Нет аккаунта? <a href="/register">Зарегистрироваться</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};