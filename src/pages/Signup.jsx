import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Car, AlertCircle } from 'lucide-react';
import './Login.css'; // Współdzieli ostylowanie z Login

const Signup = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signup } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Hasła nie są identyczne.');
    }

    try {
      setError('');
      setLoading(true);
      await signup(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Nie udało się utworzyć konta. Hasło musi mieć min. 6 znaków.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <Car size={48} className="auth-icon" />
          <h2>Utwórz Konto</h2>
          <p className="text-muted">Dołącz do nas i miej auto pod kontrolą.</p>
        </div>

        {error && (
          <div className="auth-error">
            <AlertCircle size={18} />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Adres E-mail</label>
            <input type="email" ref={emailRef} className="input-field" required />
          </div>
          
          <div className="form-group">
            <label>Hasło</label>
            <input type="password" ref={passwordRef} className="input-field" required />
          </div>

          <div className="form-group">
            <label>Potwierdź Hasło</label>
            <input type="password" ref={passwordConfirmRef} className="input-field" required />
          </div>

          <button disabled={loading} type="submit" className="btn btn-primary w-100" style={{ marginTop: '1rem' }}>
            {loading ? 'Rejestracja...' : 'Utwórz konto'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-muted">
            Masz już konto? <Link to="/login">Zaloguj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
