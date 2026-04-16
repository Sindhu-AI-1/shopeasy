import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';

export default function Login() {
  const [username, setUsername]   = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [error, setError]         = useState('');
  const [errors, setErrors]       = useState({});
  const { login }                 = useApp();
  const navigate                  = useNavigate();

  function validate() {
    const e = {};
    if (!username.trim()) e.username = 'Username is required.';
    if (!password.trim() || password.trim() === '') e.password = 'Password is required.';
    if (password && password.trim() === '') e.password = 'Password cannot be blank or contain only spaces.';
    return e;
  }

  function handleSubmit(e) {
    e.preventDefault();
    setError('');
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }
    setErrors({});
    const result = login(username, password);
    if (result.success) {
      navigate('/products');
    } else {
      setError(result.error);
    }
  }

  return (
    <div style={styles.page}>
      <div style={styles.card}>
        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Sign in to continue</p>

        {error && (
          <div style={styles.errorBanner} data-testid="login-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} noValidate>
          {/* Username */}
          <div style={styles.field}>
            <label style={styles.label}>Username / Email</label>
            <input
              data-testid="username-input"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="you@example.com"
              style={{ ...styles.input, ...(errors.username ? styles.inputError : {}) }}
            />
            {errors.username && <span style={styles.fieldError} data-testid="username-error">{errors.username}</span>}
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>Password</label>
            <div style={styles.passWrap}>
              <input
                data-testid="password-input"
                type={showPass ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                style={{ ...styles.input, paddingRight: '44px', ...(errors.password ? styles.inputError : {}) }}
              />
              <button
                type="button"
                data-testid="toggle-password"
                onClick={() => setShowPass(!showPass)}
                style={styles.eyeBtn}
              >
                {showPass ? '🙈' : '👁️'}
              </button>
            </div>
            {errors.password && <span style={styles.fieldError} data-testid="password-error">{errors.password}</span>}
          </div>

          {/* Remember Me */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px' }}>
            <input type="checkbox" id="remember" data-testid="remember-me" />
            <label htmlFor="remember" style={{ fontSize: '14px', color: '#64748b' }}>Remember me</label>
          </div>

          <button type="submit" data-testid="login-btn" style={styles.btn}>
            Sign In
          </button>
        </form>

        <p style={styles.hint}>
          Demo credentials: <code>user@test.com</code> / <code>Test@1234</code>
        </p>
      </div>
    </div>
  );
}

const styles = {
  page:        { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f1f5f9' },
  card:        { background: '#fff', padding: '40px', borderRadius: '12px', boxShadow: '0 4px 24px rgba(0,0,0,0.08)', width: '100%', maxWidth: '420px' },
  title:       { margin: '0 0 4px', fontSize: '24px', fontWeight: '700', color: '#1e293b' },
  subtitle:    { margin: '0 0 24px', color: '#64748b', fontSize: '14px' },
  errorBanner: { background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', padding: '10px 14px', borderRadius: '8px', fontSize: '14px', marginBottom: '16px' },
  field:       { marginBottom: '16px' },
  label:       { display: 'block', fontSize: '13px', fontWeight: '500', color: '#475569', marginBottom: '6px' },
  input:       { width: '100%', padding: '10px 12px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '14px', outline: 'none', boxSizing: 'border-box' },
  inputError:  { borderColor: '#ef4444' },
  fieldError:  { fontSize: '12px', color: '#ef4444', marginTop: '4px', display: 'block' },
  passWrap:    { position: 'relative' },
  eyeBtn:      { position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px' },
  btn:         { width: '100%', padding: '12px', background: '#2563eb', color: '#fff', border: 'none', borderRadius: '8px', fontSize: '15px', fontWeight: '600', cursor: 'pointer' },
  hint:        { marginTop: '20px', fontSize: '12px', color: '#94a3b8', textAlign: 'center' },
};
