import './RegistrationPage.css'
import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export function RegistrationPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone_number, setPhone_number] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    try {
      const res = await fetch('http://127.0.0.1:8000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone_number }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.detail || 'Registration failed');
      }

      const { access_token } = await res.json();

      localStorage.setItem('jwt', access_token);
      navigate('/');
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <section className="section-registration">
      <div>
        <h1 className="title">Register</h1>
        <form onSubmit={handleSubmit} className="box registration-form">
          {error && <p className="notification is-danger">{error}</p>}

          <div className="field">
            <label className="label">Name</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="text"
                placeholder="Name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
              <span className="icon is-small is-left">
                <i className="fas fa-user-plus" />
              </span>
            </div>
          </div>

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
            <label className="label">Phone Number</label>
            <div className="control has-icons-left">
              <input
                className="input"
                type="tel"
                placeholder="48123456789"
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
              <button className="button is-primary register-button" type="submit">
                Register
              </button>
            </div>
          </div>
        </form>
        <p>
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </section>
  );
}
