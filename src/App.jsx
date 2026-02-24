// src/App.jsx (no changes needed, but including for completeness)
import React, { useState, useEffect } from 'react';
import { auth, signInWithGoogle } from './firebase';
import LayoutWrapper from './components/LayoutWrapper';
import { Button, Spin } from 'antd';
import { BrowserRouter as Router } from 'react-router-dom';

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((u) => {
      setUser(u);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const handleLogin = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-black px-5 py-10 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-red-600 mb-5">Ramadan Tracker</h1>
        <p className="text-base sm:text-lg mb-8 max-w-md text-gray-300">
          Track your 5 daily prayers, good & bad deeds, and Ramadan progress
        </p>
        <Button
          type="primary"
          size="large"
          onClick={handleLogin}
          className="h-12 px-8 text-base sm:text-lg font-medium"
        >
          Sign in with Google
        </Button>
      </div>
    );
  }

  return (
    <Router>
      <LayoutWrapper user={user} />
    </Router>
  );
}

export default App;