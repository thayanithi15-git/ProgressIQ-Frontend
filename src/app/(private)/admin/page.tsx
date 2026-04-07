'use client';
import React, { useState, useEffect } from 'react';
const App = () => {
  const [currentView, setCurrentView] = useState('user');
  const [user, setUser] = useState(null);
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('credxUser') || 'null');
    if (storedUser) {
      setUser(storedUser);
      setCurrentView(storedUser.role === 'recruiter' ? 'recruiter' : 'user');
    }
  }, []);
  const handleGetStarted = () => {
    const mockUser = {
      email: "user@credx.com",
      password: "user123",
      role: "user",
      username: "Priya Sharma",
      signedInAt: new Date().toISOString()
    };
    localStorage.setItem('credxUser', JSON.stringify(mockUser));
    setCurrentView('user');
  };
  const handleLogout = () => {
    localStorage.removeItem('credxUser');
    setUser(null);
    setCurrentView('hero');
  };
  return (
    <div className="min-h-screen">
    </div>
  );
};
export default App;