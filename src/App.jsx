import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle } from './firebase';
import LayoutWrapper from './components/LayoutWrapper';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [signingIn, setSigningIn] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
      setTimeout(() => setMounted(true), 100);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      setSigningIn(true);
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
      setSigningIn(false);
    }
  };

  // ─── Loading Screen ───────────────────────────────────────────────────────
  if (loading) {
    return (
      <div style={{
        minHeight: '100dvh',
        width: '100%',
        backgroundColor: '#000',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Segoe UI', sans-serif",
        gap: '24px',
      }}>
        <style>{`
          @keyframes spinRing {
            to { transform: rotate(360deg); }
          }
          @keyframes pulseDot {
            0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
            40% { transform: scale(1.1); opacity: 1; }
          }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to   { opacity: 1; transform: translateY(0); }
          }
          @keyframes floatMoon {
            0%, 100% { transform: translateY(0px) rotate(-5deg); }
            50%       { transform: translateY(-14px) rotate(5deg); }
          }
          @keyframes shimmer {
            0%   { background-position: -400px 0; }
            100% { background-position: 400px 0; }
          }
          @keyframes starTwinkle {
            0%, 100% { opacity: 0.2; transform: scale(0.8); }
            50%       { opacity: 1;   transform: scale(1.2); }
          }
          @keyframes rotateSlow {
            to { transform: rotate(360deg); }
          }
          @keyframes glowPulse {
            0%, 100% { box-shadow: 0 0 30px rgba(220,38,38,0.2); }
            50%       { box-shadow: 0 0 70px rgba(220,38,38,0.5); }
          }
          @keyframes drawLine {
            from { width: 0; }
            to   { width: 50px; }
          }
          @keyframes countUp {
            from { opacity: 0; }
            to   { opacity: 1; }
          }
          * { box-sizing: border-box; margin: 0; padding: 0; }
          body { background: #000; overflow-x: hidden; }
        `}</style>

        {/* spinning ring */}
        <div style={{
          width: '70px', height: '70px', borderRadius: '50%',
          border: '3px solid #1a0000',
          borderTop: '3px solid #dc2626',
          animation: 'spinRing 1s linear infinite',
          boxShadow: '0 0 20px rgba(220,38,38,0.3)',
        }} />
        <p style={{ color: '#4b1c1c', fontSize: '24px', letterSpacing: '4px' }}>﷽</p>
        <div style={{ display: 'flex', gap: '10px' }}>
          {[0, 1, 2].map(i => (
            <div key={i} style={{
              width: '10px', height: '10px', borderRadius: '50%',
              backgroundColor: '#dc2626',
              animation: `pulseDot 1.3s ease-in-out ${i * 0.22}s infinite`,
              boxShadow: '0 0 8px rgba(220,38,38,0.6)',
            }} />
          ))}
        </div>
        <p style={{ color: '#3f3f3f', fontSize: '12px', letterSpacing: '3px', textTransform: 'uppercase' }}>
          Loading your journey...
        </p>
      </div>
    );
  }

  // ─── Logged In ────────────────────────────────────────────────────────────
  if (user) {
    return (
      <Router>
        <LayoutWrapper user={user} />
      </Router>
    );
  }

  // ─── Login Screen ─────────────────────────────────────────────────────────
  const features = [
    { icon: '🕌', text: 'Track 5 daily Salat' },
    { icon: '📿', text: 'Log good & bad deeds' },
    { icon: '📖', text: 'Quran progress tracker' },
    { icon: '📊', text: 'Analytics & insights' },
  ];

  const stars = Array.from({ length: 28 }, (_, i) => ({
    id: i,
    top: `${Math.random() * 100}%`,
    left: `${Math.random() * 100}%`,
    delay: `${Math.random() * 4}s`,
    duration: `${2 + Math.random() * 3}s`,
    size: `${2 + Math.random() * 3}px`,
  }));

  return (
    <div style={{
      minHeight: '100dvh',
      width: '100%',
      backgroundColor: '#000',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontFamily: "'Segoe UI', sans-serif",
      position: 'relative',
      overflow: 'hidden',
      padding: '16px',
    }}>
      <style>{`
        @keyframes spinRing {
          to { transform: rotate(360deg); }
        }
        @keyframes pulseDot {
          0%, 80%, 100% { transform: scale(0.5); opacity: 0.3; }
          40% { transform: scale(1.1); opacity: 1; }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatMoon {
          0%, 100% { transform: translateY(0px) rotate(-5deg); }
          50%       { transform: translateY(-14px) rotate(5deg); }
        }
        @keyframes starTwinkle {
          0%, 100% { opacity: 0.15; transform: scale(0.7); }
          50%       { opacity: 1;    transform: scale(1.3); }
        }
        @keyframes rotateSlow {
          to { transform: rotate(360deg); }
        }
        @keyframes glowPulse {
          0%, 100% { box-shadow: 0 0 40px rgba(220,38,38,0.15), 0 0 0px rgba(220,38,38,0); }
          50%       { box-shadow: 0 0 80px rgba(220,38,38,0.35), 0 0 120px rgba(220,38,38,0.1); }
        }
        @keyframes borderGlow {
          0%, 100% { border-color: #2a0000; }
          50%       { border-color: #7f1d1d; }
        }
        @keyframes slideInLeft {
          from { opacity: 0; transform: translateX(-20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.85); }
          to   { opacity: 1; transform: scale(1); }
        }
        @keyframes shimmerBar {
          0%   { background-position: -300px 0; }
          100% { background-position: 300px 0; }
        }
        * { box-sizing: border-box; }
        body { background: #000; overflow-x: hidden; }

        .login-card {
          animation: scaleIn 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards, glowPulse 4s ease-in-out 1s infinite;
        }
        .moon-icon {
          animation: floatMoon 3.5s ease-in-out infinite;
          display: inline-block;
        }
        .feat-item {
          opacity: 0;
          animation: slideInLeft 0.5s ease forwards;
        }
        .feat-item:nth-child(1) { animation-delay: 0.7s; }
        .feat-item:nth-child(2) { animation-delay: 0.85s; }
        .feat-item:nth-child(3) { animation-delay: 1.0s; }
        .feat-item:nth-child(4) { animation-delay: 1.15s; }

        .title-anim {
          opacity: 0;
          animation: fadeUp 0.6s ease 0.3s forwards;
        }
        .sub-anim {
          opacity: 0;
          animation: fadeUp 0.6s ease 0.5s forwards;
        }
        .btn-anim {
          opacity: 0;
          animation: fadeUp 0.6s ease 1.3s forwards;
        }

        .google-btn:hover {
          background: linear-gradient(135deg, #b91c1c, #dc2626) !important;
          box-shadow: 0 0 40px rgba(220,38,38,0.45), 0 8px 32px rgba(0,0,0,0.5) !important;
          transform: translateY(-2px) !important;
        }
        .google-btn:active {
          transform: translateY(0px) !important;
        }
        .google-btn:disabled {
          cursor: not-allowed !important;
          opacity: 0.6 !important;
        }

        .feat-row:hover {
          border-color: rgba(220,38,38,0.35) !important;
          background: rgba(220,38,38,0.06) !important;
          transform: translateX(4px);
        }

        @media (max-width: 480px) {
          .login-card { padding: 32px 22px !important; border-radius: 20px !important; }
          .card-title  { font-size: 26px !important; }
          .card-sub    { font-size: 13px !important; }
          .moon-wrap   { width: 60px !important; height: 60px !important; font-size: 28px !important; }
        }
        @media (min-width: 768px) {
          .login-card { padding: 56px 52px !important; }
        }
      `}</style>

      {/* ── Twinkling Stars ── */}
      {stars.map(s => (
        <div key={s.id} style={{
          position: 'fixed',
          top: s.top, left: s.left,
          width: s.size, height: s.size,
          borderRadius: '50%',
          backgroundColor: '#ffffff',
          animation: `starTwinkle ${s.duration} ease-in-out ${s.delay} infinite`,
          pointerEvents: 'none',
        }} />
      ))}

      {/* ── Ambient glow blobs ── */}
      <div style={{
        position: 'fixed', top: '-20%', left: '50%', transform: 'translateX(-50%)',
        width: 'min(700px, 120vw)', height: 'min(700px, 120vw)', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.07) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', bottom: '-20%', left: '20%',
        width: 'min(500px, 90vw)', height: 'min(500px, 90vw)', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(127,29,29,0.05) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />
      <div style={{
        position: 'fixed', top: '30%', right: '-10%',
        width: 'min(400px, 80vw)', height: 'min(400px, 80vw)', borderRadius: '50%',
        background: 'radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 65%)',
        pointerEvents: 'none',
      }} />

      {/* ── Rotating outer ring (desktop decoration) ── */}
      <div style={{
        position: 'fixed', top: '50%', left: '50%',
        transform: 'translate(-50%, -50%)',
        width: 'min(900px, 95vw)', height: 'min(900px, 95vw)',
        borderRadius: '50%',
        border: '1px solid rgba(220,38,38,0.04)',
        animation: 'rotateSlow 40s linear infinite',
        pointerEvents: 'none',
      }}>
        {/* dots on ring */}
        {[0, 90, 180, 270].map(deg => (
          <div key={deg} style={{
            position: 'absolute',
            top: '50%', left: '50%',
            width: '6px', height: '6px',
            borderRadius: '50%',
            backgroundColor: '#dc2626',
            boxShadow: '0 0 8px rgba(220,38,38,0.6)',
            transform: `rotate(${deg}deg) translate(min(450px, 47.5vw)) translateY(-3px)`,
            opacity: 0.4,
          }} />
        ))}
      </div>

      {/* ── Main Login Card ── */}
      <div className="login-card" style={{
        width: '100%',
        maxWidth: '460px',
        background: 'linear-gradient(160deg, #0d0d0d 0%, #110000 50%, #0d0d0d 100%)',
        border: '1px solid #2a0000',
        borderRadius: '24px',
        padding: '48px 40px',
        textAlign: 'center',
        position: 'relative',
        overflow: 'hidden',
        zIndex: 10,
      }}>

        {/* Top shimmer line */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
          background: 'linear-gradient(90deg, transparent, #dc2626 40%, #ff6b6b 50%, #dc2626 60%, transparent)',
          backgroundSize: '300px 100%',
          animation: 'shimmerBar 2.5s linear infinite',
        }} />

        {/* Corner decorations */}
        <div style={{ position: 'absolute', top: '16px', left: '16px', width: '20px', height: '20px', borderTop: '1.5px solid #7f1d1d', borderLeft: '1.5px solid #7f1d1d', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', top: '16px', right: '16px', width: '20px', height: '20px', borderTop: '1.5px solid #7f1d1d', borderRight: '1.5px solid #7f1d1d', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', bottom: '16px', left: '16px', width: '20px', height: '20px', borderBottom: '1.5px solid #7f1d1d', borderLeft: '1.5px solid #7f1d1d', borderRadius: '2px' }} />
        <div style={{ position: 'absolute', bottom: '16px', right: '16px', width: '20px', height: '20px', borderBottom: '1.5px solid #7f1d1d', borderRight: '1.5px solid #7f1d1d', borderRadius: '2px' }} />

        {/* Bismillah */}
        <p style={{ color: '#5f1d1d', fontSize: '20px', margin: '0 0 24px', fontFamily: 'serif', letterSpacing: '2px' }}>﷽</p>

        {/* Floating Moon */}
        <div className="moon-wrap" style={{
          width: '72px', height: '72px', borderRadius: '50%',
          background: 'radial-gradient(circle at 35% 35%, rgba(220,38,38,0.15), rgba(220,38,38,0.03))',
          border: '1px solid rgba(220,38,38,0.25)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '32px', margin: '0 auto 26px',
        }}>
          <span className="moon-icon">🌙</span>
        </div>

        {/* Title */}
        <div className="title-anim">
          <h1 className="card-title" style={{
            color: '#ffffff', fontSize: '30px', fontWeight: '900',
            margin: '0 0 10px', letterSpacing: '-0.5px', lineHeight: 1.2,
          }}>
            Ramadan <span style={{ color: '#dc2626' }}>Tracker</span>
          </h1>
          {/* Animated underline */}
          <div style={{
            height: '2px',
            background: 'linear-gradient(to right, #7f1d1d, #dc2626)',
            borderRadius: '999px',
            width: '50px',
            margin: '0 auto 14px',
            animation: 'drawLine 0.8s ease 0.4s both',
          }} />
        </div>

        {/* Subtitle */}
        <p className="sub-anim card-sub" style={{
          color: '#9ca3af', fontSize: '14px', lineHeight: '1.75',
          margin: '0 0 28px', padding: '0 4px',
        }}>
          Track your prayers, deeds & Quran progress — and make this Ramadan your best yet
        </p>

        {/* Feature rows */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '9px', marginBottom: '30px', textAlign: 'left' }}>
          {features.map((f, i) => (
            <div key={f.text} className={`feat-item feat-row`} style={{
              display: 'flex', alignItems: 'center', gap: '12px',
              padding: '11px 14px',
              backgroundColor: 'rgba(255,255,255,0.02)',
              border: '1px solid rgba(220,38,38,0.1)',
              borderRadius: '11px',
              transition: 'all 0.25s ease',
              cursor: 'default',
            }}>
              <span style={{ fontSize: '17px', flexShrink: 0 }}>{f.icon}</span>
              <span style={{ color: '#d1d5db', fontSize: '14px', fontWeight: '400' }}>{f.text}</span>
              <span style={{ marginLeft: 'auto', color: '#3f0000', fontSize: '12px' }}>→</span>
            </div>
          ))}
        </div>

        {/* Divider */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px',
        }}>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, transparent, #2a0000)' }} />
          <span style={{ color: '#4b4b4b', fontSize: '11px', letterSpacing: '2px' }}>SIGN IN TO CONTINUE</span>
          <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, transparent, #2a0000)' }} />
        </div>

        {/* Google Button */}
        <div className="btn-anim">
          <button
            className="google-btn"
            onClick={handleLogin}
            disabled={signingIn}
            style={{
              width: '100%',
              background: 'linear-gradient(135deg, #991b1b, #b91c1c)',
              border: 'none',
              color: '#ffffff',
              padding: '15px 24px',
              borderRadius: '13px',
              fontSize: '15px',
              fontWeight: '700',
              cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
              transition: 'all 0.25s ease',
              fontFamily: 'inherit',
              letterSpacing: '0.3px',
              boxShadow: '0 4px 24px rgba(0,0,0,0.4)',
            }}
          >
            {signingIn ? (
              <>
                <div style={{
                  width: '18px', height: '18px', borderRadius: '50%',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTop: '2px solid #ffffff',
                  animation: 'spinRing 0.8s linear infinite',
                }} />
                Signing in...
              </>
            ) : (
              <>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="white" opacity=".9" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="white" opacity=".7" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="white" opacity=".5" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="white" opacity=".6" />
                </svg>
                Sign in with Google
              </>
            )}
          </button>
        </div>

        {/* Privacy note */}
        <p style={{ color: '#3a3a3a', fontSize: '12px', marginTop: '18px', lineHeight: '1.6' }}>
          🔒 Private & secure — your data belongs to you
        </p>
      </div>

      {/* Footer */}
      <p style={{
        position: 'fixed', bottom: '16px', left: '50%', transform: 'translateX(-50%)',
        color: '#2a2a2a', fontSize: '11px', letterSpacing: '2px', whiteSpace: 'nowrap',
        zIndex: 5,
      }}>
        🌙 Ramadan Mubarak — May Allah accept your ibadah
      </p>
    </div>
  );
}

export default App;