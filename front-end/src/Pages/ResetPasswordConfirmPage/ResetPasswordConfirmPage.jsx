import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../../api/config";
import './ResetPasswordConfirmPage.css';

export const ResetPasswordConfirmPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const [tokenFromUrl, setTokenFromUrl] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const urlToken = params.get("token");
    if (urlToken) {
      setTokenFromUrl(urlToken);
    } else {
      setError("Nieprawidłowy link. Brak tokena w URL.");
    }
  }, []);

  const handleApiError = useCallback((err, fallbackMsg) => {
    if (err instanceof Response) {
      err.text().then(text => {
        try {
          const data = JSON.parse(text);
          if (Array.isArray(data.detail) && data.detail.length > 0 && data.detail[0].msg) {
            setError(data.detail[0].msg);
          } else if (typeof data.detail === "string") {
            setError(data.detail);
          } else {
            setError(fallbackMsg);
          }
        } catch {
          setError(fallbackMsg);
        }
      });
    } else {
      setError(fallbackMsg);
    }
  }, []);

  const handleConfirm = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    const token = tokenFromUrl;
    if (!token || !newPassword || !repeatPassword) {
      setError("Wypełnij wszystkie pola");
      return;
    }
    if (newPassword !== repeatPassword) {
      setError("Hasła nie pasują");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/auth/password-reset/confirm?token=${encodeURIComponent(token)}&new_password=${encodeURIComponent(newPassword)}`,
        { method: "POST" }
      );
      if (!res.ok) throw res;
      setMsg("Hasło zostało pomyślnie zmienione.");
    } catch (err) {
      handleApiError(err, "Błąd podczas zmiany hasła. Sprawdź poprawność tokena i spróbuj ponownie.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (msg) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [msg, navigate]);

  return (
    <div className="confirm-wrapper">
      <div className="confirm-container">
        <div className="auth-box">
          <h2 className="title confirm-title">Zmiana hasła</h2>
            <form
              onSubmit={handleConfirm}
              autoComplete="off"
              className="confirm-form"
            >
              <div className="field">
                <label className="label" htmlFor="reset-new-password">Nowe hasło</label>
                <div className="control has-icons-left">
                  <input
                    id="reset-new-password"
                    className="input"
                    type="password"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    placeholder="Nowe hasło"
                    required
                    minLength={8}
                  />
                  <span className="icon is-small is-left">
                    <i className="fas fa-lock" />
                  </span>
                </div>
              </div>
              
              <div className="field">
                <label className="label" htmlFor="reset-repeat-password">Powtórz hasło</label>
                <div className="control has-icons-left">
                <input
                  id="reset-repeat-password"
                  className="input"
                  type="password"
                  value={repeatPassword}
                  onChange={e => setRepeatPassword(e.target.value)}
                  placeholder="Powtórz hasło"
                  required
                  minLength={8}
                  autoComplete="new-password"
                />
                <span className="icon is-small is-left">
                  <i className="fas fa-lock" />
                </span>
                </div>
              </div>

              <button className="button confirm-button" type="submit" disabled={loading}>
                {loading ? "Zapisuję..." : "Zmień hasło"}
              </button>
              {error && <div className="confirm-error" role="alert">{error}</div>}
              {msg && <div className="confirm-success">{msg}</div>}
            </form>
        </div>
      </div>
    </div>

  );
};