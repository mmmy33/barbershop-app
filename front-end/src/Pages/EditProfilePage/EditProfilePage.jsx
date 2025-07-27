import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuthHeaders, API_BASE } from '../../api/config';
import { FooterSection } from '../../sections/FooterSection/FooterSection';
import './EditProfilePage.css';

export const EditProfilePage = ({ user, setUser }) => {
  const navigate = useNavigate();

  const [name, setName] = useState(user?.name || '');
  const [phoneNumber, setPhoneNumber] = useState(user?.phone || user?.phone_number || '');
  const [email, setEmail] = useState(user?.email || '');
  const [saveMsg, setSaveMsg] = useState('');
  const [loading, setLoading] = useState(false);

    useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE}/auth/me`, {
          headers: getAuthHeaders(),
        });
        if (!res.ok) throw new Error('Error loading user data');
        const data = await res.json();
        setName(data.name || '');
        setPhoneNumber(data.phone || data.phone_number || '');
        setEmail(data.email || '');
        setUser && setUser(data);
      } catch (err) {
        setSaveMsg('Błąd: ' + err.message);
      }
    }
    fetchUser();
  }, [setUser]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaveMsg('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/auth/me`, {
        method: 'PUT',
        headers: {
          ...getAuthHeaders(),
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          phone_number: phoneNumber,
          name,
        }),
      });
      if (!res.ok) throw new Error('Error saving data');
      setSaveMsg('Dane zostały zapisane!');
      setUser && setUser(prev => ({ ...prev, email, phone: phoneNumber, name }));
      setTimeout(() => navigate('/profile'), 1200);
    } catch (err) {
      setSaveMsg('Błąd: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
      <div className="edit-profile-page">
        <form className="edit-profile-form" onSubmit={handleSave}>
          <h2 className="edit-profile-title">Informacje osobiste</h2>

          <div className="field edit-profile-field">
            <label className="label edit-profile-label">Imię</label>
            <input
              disabled
              className="input edit-profile-input"
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              required
            />
          </div>

          <div className="field edit-profile-field">
            <label className="label edit-profile-label">Numer telefonu</label>
            <input
              className="input edit-profile-input"
              type="tel"
              value={phoneNumber}
              onChange={e => setPhoneNumber(e.target.value)}
              required
            />
          </div>

          <div className="field" style={{ marginBottom: 32 }}>
            <label className="label edit-profile-label">Twój e-mail</label>
            <input
              className="input edit-profile-input"
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="edit-profile-actions">
            <button
              className="button edit-profile-save"
              type="submit"
              disabled={loading}
            >
              Zapisz
            </button>
            <button
              className="button edit-profile-cancel"
              type="button"
              onClick={() => navigate('/profile')}
              disabled={loading}
            >
              Anulować
            </button>
          </div>
          {saveMsg && (
            <div
              className={`edit-profile-msg ${saveMsg.startsWith('Błąd') ? 'error' : 'success'}`}
            >
              {saveMsg}
            </div>
          )}
        </form>
        <FooterSection />
      </div>
  );
}