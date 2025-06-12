import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function RegistrationPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, phone_number }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Registration failed');
      }

      const { access_token } = await res.json();
      localStorage.setItem('jwt', access_token);
      navigate('/main');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section">
      <div className="container">
        <h1 className="title">Register</h1>
        <form onSubmit={handleSubmit} className="box">
          {error && <p className="notification is-danger">{error}</p>}
          <div className="field">
            <label className="label">Username</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="text"
                placeholder="Choose a username"
                value={username}
                onChange={e => setUsername(e.target.value)}
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user-plus" />
              </span>
            </div>
          </div>

          <div className="field">
            <label className="label">Phone Number</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="tel"
                placeholder="+48 123 456 789"
                value={phone_number}
                onChange={e => setPhone_number(e.target.value)}
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-phone" />
              </span>
            </div>
          </div>

          <div className="field">
            <label className="label">Password</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="password"
                placeholder="Choose a password"
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
            <div className="control">
              <button className="button is-primary" type="submit">
                Register
              </button>
            </div>
          </div>
        </form>
        <p>
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </section>
  );
}