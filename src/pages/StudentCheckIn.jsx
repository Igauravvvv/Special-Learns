import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, AlertCircle, ArrowRight, UserCheck, Shield, Clock, BookOpen } from 'lucide-react';
import Seo from '../components/Seo.jsx';

export default function StudentCheckIn() {
  const [identifier, setIdentifier] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const clean = identifier.trim();
    if (!clean) {
      setError('Please enter your Student Roll Number or Phone Number.');
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const res = await fetch('/api/attendance/check-in', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier: clean }),
      });

      const data = await res.json();
      if (!res.ok || !data.ok) {
        setError(data.message || 'Student not found. Please double-check your Roll Number.');
      } else {
        setResult(data);
        setIdentifier('');
      }
    } catch (err) {
      setError('Could not connect to the attendance service. Please inform the teacher.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Seo
        title="Student Daily Check-in — Special Learns Institute"
        description="Mark your daily attendance at Special Learns Institute with your Roll Number or phone."
        path="/attendance"
      />

      <div className="checkin-page">
        <div className="checkin-card">
          <span className="checkin-badge">
            <UserCheck size={14} aria-hidden="true" />
            Lab & Classroom Check-in
          </span>

          <h1 className="checkin-title">Student Attendance</h1>
          <p className="checkin-text">
            Welcome to class! Enter your <strong>Roll Number</strong> (e.g. SL-2026-001) or <strong>Registered Phone</strong> to check in for today.
          </p>

          {error && (
            <div className="admin-alert-banner" style={{ background: '#fef2f2', borderColor: '#fca5a5', padding: '12px', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#b91c1c', fontSize: '0.88rem', fontWeight: 600 }}>
                <AlertCircle size={18} />
                <span>{error}</span>
              </div>
            </div>
          )}

          {result ? (
            <div className="checkin-success-box">
              <div className="checkin-success-icon">
                <CheckCircle2 size={32} />
              </div>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '0 0 6px', color: '#15803d' }}>
                {result.alreadyMarked ? 'Already Checked In!' : 'Attendance Confirmed!'}
              </h2>
              <p style={{ margin: '0 0 16px', color: '#166534', fontSize: '0.92rem' }}>
                {result.message}
              </p>

              <div style={{ background: '#ffffff', borderRadius: '12px', padding: '14px', border: '1px solid #bbf7d0', textAlign: 'left', fontSize: '0.88rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Student Name:</span>
                  <strong style={{ color: '#0f172a' }}>{result.student.name}</strong>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Roll Number:</span>
                  <code style={{ background: '#f1f5f9', padding: '2px 6px', borderRadius: '4px', fontWeight: 700 }}>{result.student.rollNo}</code>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ color: '#64748b' }}>Course:</span>
                  <span style={{ color: '#1d4ed8', fontWeight: 600 }}>{result.student.course}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Date & Time:</span>
                  <span style={{ color: '#334155' }}>
                    {new Date(result.record?.timestamp || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
              </div>

              <button
                type="button"
                className="admin-btn admin-btn--secondary"
                style={{ marginTop: '1.25rem', width: '100%', justifyContent: 'center' }}
                onClick={() => setResult(null)}
              >
                Check in Another Student
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="checkin-input-wrap">
                <input
                  type="text"
                  className="checkin-input"
                  placeholder="e.g. SL-2026-001 or 98101..."
                  value={identifier}
                  onChange={(e) => setIdentifier(e.target.value)}
                  autoFocus
                  disabled={loading}
                />
              </div>

              <button
                type="submit"
                className="checkin-submit-btn"
                disabled={loading}
              >
                {loading ? 'Verifying...' : 'Mark My Attendance ✋'}
                <ArrowRight size={18} />
              </button>

              <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'center', gap: '16px', fontSize: '0.84rem' }}>
                <Link to="/" style={{ color: 'var(--sl-text-muted)', textDecoration: 'none' }}>
                  ← Back to Home
                </Link>
                <span style={{ color: 'var(--sl-line)' }}>•</span>
                <Link to="/admin" style={{ color: 'var(--sl-indigo-600)', textDecoration: 'none', fontWeight: 600 }}>
                  Admin Portal →
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    </>
  );
}
