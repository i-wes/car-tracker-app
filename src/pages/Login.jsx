import React, { useRef, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Car, AlertCircle } from 'lucide-react';
import './Login.css';

const Login = () => {
  const emailRef = useRef();
  const passwordRef = useRef();
  const { login } = useAuth();
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    try {
      setError('');
      setLoading(true);
      await login(emailRef.current.value, passwordRef.current.value);
      navigate('/');
    } catch (err) {
      console.error(err);
      setError('Nie udało się zalogować. Błędny email lub hasło.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card glass-panel">
        <div className="auth-header">
          <Car size={48} className="auth-icon" />
          <h2>CarFlow</h2>
          <p className="text-muted">Zaloguj się, aby zarządzać wydatkami.</p>
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

          <button disabled={loading} type="submit" className="btn btn-primary w-100" style={{ marginTop: '1rem' }}>
            {loading ? 'Logowanie...' : 'Zaloguj się'}
          </button>
        </form>

        <div className="auth-footer">
          <p className="text-muted">
            Nie masz konta? <Link to="/signup">Zarejestruj się</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
