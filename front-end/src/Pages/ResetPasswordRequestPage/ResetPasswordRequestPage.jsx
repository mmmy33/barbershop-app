import { useState } from "react";
import { API_BASE } from "../../api/config";
import './ResetPasswordRequestPage.css';

export const ResetPasswordRequestPage = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");

  const handleRequest = async (e) => {
    e.preventDefault();
    setError(""); setMsg("");
    if (!email) return setError("Wprowadź email.");
    setLoading(true);
    try {
      const res = await fetch(
        `${API_BASE}/auth/password-reset/request?email=${encodeURIComponent(email)}`,
        { method: "POST" }
      );
      if (!res.ok) throw res;
      setMsg("Link do resetowania hasła został wysłany na email.");
      setEmail("")
    } catch (error) {
      setError("Nie udało się wysłać linka. Sprawdź czy email jest poprawny.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-wrapper">
      <div className="reset-container">
        <div className="reset-box">
          <h2 className="title reset-title">Reset Password</h2>
          <form
            className="reset-form"
            onSubmit={handleRequest}
            autoComplete="off"
          >
            <div className="fied">
              <label className="label reset-request-label" htmlFor="reset-email">Email</label>
              <div className="control has-icons-left">
              <input
                style={{ width: "100%", backgroundColor: "#fff"}}
                id="reset-email"
                className="input"
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value.trim())}
                placeholder="Email"
                required
                autoFocus
              />
              <span className="icon is-small is-left">
                <i className="fas fa-envelope" />
              </span>
            </div>
            </div>

            <button className="button reset-button" type="submit" disabled={loading}>
              {loading ? "Wysyłanie..." : "Wyślij link"}
            </button>
            {error && <div className="auth-error" role="alert">{error}</div>}
            {msg && <div className="auth-success">
              {msg} <br />
              <a href="/" className="reset-back-btn">
                Powrót na stronę główną
              </a>
            </div>}
          </form>
        </div>
      </div>
    </div>

  );
};