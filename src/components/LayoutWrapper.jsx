import React, { useState } from 'react';
import { Layout, Menu, Button, Drawer, Avatar } from 'antd';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { logout } from '../firebase';
import Prayers from './Prayers';
import Deeds from './Deeds';
import CalendarPage from './CalendarPage';
import Analysis from './Analysis';
import Profile from './Profile';
import DuaReminder from './DuaReminder';
import QuranProgress from './QuranProgress';
import Motivation from './Motivation';

const { Header, Sider, Content } = Layout;

const navItems = [
    { key: '/prayers', label: 'Salat', icon: '🕌' },
    { key: '/deeds', label: 'Deeds', icon: '📿' },
    { key: '/calendar', label: 'Calendar', icon: '📅' },
    { key: '/analysis', label: 'Analysis', icon: '📊' },
    { key: '/dua', label: 'Dua & Reminder', icon: '🤲' },
    { key: '/quran', label: 'Quran Progress', icon: '📖' },
    { key: '/motivation', label: 'Motivation', icon: '✨' },
    { key: '/profile', label: 'Profile', icon: '👤' },
];

const SidebarContent = ({ location, onItemClick, user, avatarSrc }) => (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column', backgroundColor: '#000000' }}>
        {/* Logo / Brand */}
        <div style={{
            padding: '28px 24px',
            borderBottom: '1px solid #1f0000',
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
        }}>
            <div style={{ position: 'relative' }}>
                <Avatar
                    src={avatarSrc}
                    size={52}
                    style={{
                        border: '2px solid #dc2626',
                        boxShadow: '0 0 16px rgba(220,38,38,0.4)',
                    }}
                />
                <span style={{
                    position: 'absolute',
                    bottom: 0,
                    right: 0,
                    width: '12px',
                    height: '12px',
                    backgroundColor: '#22c55e',
                    borderRadius: '50%',
                    border: '2px solid #000',
                }} />
            </div>
            <div style={{ overflow: 'hidden' }}>
                <h2 style={{
                    margin: 0,
                    fontSize: '17px',
                    fontWeight: '800',
                    color: '#dc2626',
                    letterSpacing: '-0.3px',
                    lineHeight: 1.2,
                }}>
                    Ramadan Tracker
                </h2>
                <p style={{
                    margin: '3px 0 0',
                    fontSize: '12px',
                    color: '#6b7280',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '140px',
                }}>
                    {user.displayName || 'User'}
                </p>
            </div>
        </div>

        {/* Bismillah tag */}
        <div style={{ padding: '14px 24px 8px', textAlign: 'center' }}>
            <span style={{
                color: '#4b1c1c',
                fontSize: '12px',
                letterSpacing: '3px',
                fontWeight: '500',
            }}>﷽</span>
        </div>

        {/* Nav Items */}
        <nav style={{ flex: 1, padding: '8px 12px', overflowY: 'auto' }}>
            {navItems.map((item) => {
                const isActive = location.pathname === item.key;
                return (
                    <Link
                        to={item.key}
                        key={item.key}
                        onClick={onItemClick}
                        style={{ textDecoration: 'none' }}
                    >
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            padding: '11px 16px',
                            borderRadius: '12px',
                            marginBottom: '4px',
                            backgroundColor: isActive ? 'rgba(220,38,38,0.12)' : 'transparent',
                            border: isActive ? '1px solid rgba(220,38,38,0.3)' : '1px solid transparent',
                            transition: 'all 0.2s',
                            cursor: 'pointer',
                        }}
                            onMouseEnter={e => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.04)';
                                    e.currentTarget.style.borderColor = 'rgba(220,38,38,0.15)';
                                }
                            }}
                            onMouseLeave={e => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.borderColor = 'transparent';
                                }
                            }}
                        >
                            <span style={{ fontSize: '17px', flexShrink: 0 }}>{item.icon}</span>
                            <span style={{
                                color: isActive ? '#ffffff' : '#9ca3af',
                                fontSize: '14px',
                                fontWeight: isActive ? '600' : '400',
                                letterSpacing: '0.2px',
                            }}>
                                {item.label}
                            </span>
                            {isActive && (
                                <div style={{
                                    marginLeft: 'auto',
                                    width: '6px',
                                    height: '6px',
                                    borderRadius: '50%',
                                    backgroundColor: '#dc2626',
                                    boxShadow: '0 0 8px #dc2626',
                                    flexShrink: 0,
                                }} />
                            )}
                        </div>
                    </Link>
                );
            })}
        </nav>

        {/* Logout */}
        <div style={{ padding: '16px 20px 24px', borderTop: '1px solid #1f0000' }}>
            <button
                onClick={logout}
                style={{
                    width: '100%',
                    backgroundColor: 'rgba(220,38,38,0.08)',
                    border: '1px solid #7f1d1d',
                    color: '#ef4444',
                    padding: '11px 16px',
                    borderRadius: '12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '14px',
                    fontWeight: '500',
                    transition: 'all 0.2s',
                    fontFamily: 'inherit',
                }}
                onMouseEnter={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.18)';
                    e.currentTarget.style.borderColor = '#dc2626';
                    e.currentTarget.style.boxShadow = '0 0 16px rgba(220,38,38,0.15)';
                }}
                onMouseLeave={e => {
                    e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.08)';
                    e.currentTarget.style.borderColor = '#7f1d1d';
                    e.currentTarget.style.boxShadow = 'none';
                }}
            >
                <LogoutOutlined /> Logout
            </button>
        </div>
    </div>
);

function LayoutWrapper({ user }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const avatarSrc = user.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=dc2626&color=fff&size=256&rounded=true`;

    return (
        <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#000000', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                onClose={() => setMobileOpen(false)}
                open={mobileOpen}
                width={270}
                closable={false}
                styles={{ body: { padding: 0, background: '#000000' } }}
            >
                <SidebarContent
                    location={location}
                    onItemClick={() => setMobileOpen(false)}
                    user={user}
                    avatarSrc={avatarSrc}
                />
            </Drawer>

            {/* Desktop Sidebar */}
            <div style={{
                width: '250px',
                flexShrink: 0,
                position: 'fixed',
                top: 0,
                left: 0,
                bottom: 0,
                zIndex: 20,
                borderRight: '1px solid #1f0000',
                display: 'none',
            }}
                className="md-sidebar"
            >
                <SidebarContent
                    location={location}
                    onItemClick={() => { }}
                    user={user}
                    avatarSrc={avatarSrc}
                />
            </div>

            {/* Main */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }} className="main-content">
                {/* Mobile Top Header */}
                <header style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    right: 0,
                    zIndex: 10,
                    height: '60px',
                    backgroundColor: '#000000',
                    borderBottom: '1px solid #1f0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0 20px',
                    boxShadow: '0 2px 20px rgba(220,38,38,0.05)',
                }} className="mobile-header">
                    <button
                        onClick={() => setMobileOpen(true)}
                        style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            padding: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            color: '#dc2626',
                        }}
                    >
                        <MenuOutlined style={{ fontSize: '22px' }} />
                    </button>
                    <span style={{ fontSize: '18px', fontWeight: '800', color: '#dc2626', letterSpacing: '-0.3px' }}>
                        Ramadan Tracker
                    </span>
                    <Avatar
                        src={avatarSrc}
                        size={38}
                        style={{ border: '2px solid #dc2626', boxShadow: '0 0 10px rgba(220,38,38,0.3)' }}
                    />
                </header>

                {/* Page Content */}
                <main style={{ flex: 1, paddingTop: '60px', backgroundColor: '#000000', minHeight: '100vh' }} className="page-main">
                    <Routes>
                        <Route path="/prayers" element={<Prayers user={user} />} />
                        <Route path="/deeds" element={<Deeds user={user} />} />
                        <Route path="/calendar" element={<CalendarPage user={user} />} />
                        <Route path="/analysis" element={<Analysis user={user} />} />
                        <Route path="/dua" element={<DuaReminder user={user} />} />
                        <Route path="/quran" element={<QuranProgress user={user} />} />
                        <Route path="/motivation" element={<Motivation user={user} />} />
                        <Route path="/profile" element={<Profile user={user} />} />
                        <Route path="*" element={
                            <div style={{ textAlign: 'center', paddingTop: '120px' }}>
                                <p style={{ color: '#4b1c1c', fontSize: '28px', marginBottom: '12px' }}>﷽</p>
                                <h1 style={{ fontSize: '48px', fontWeight: '800', color: '#dc2626', margin: 0 }}>
                                    Ramadan Mubarak
                                </h1>
                                <p style={{ color: '#6b7280', marginTop: '12px', fontSize: '16px' }}>
                                    May Allah accept your ibadah 🤲
                                </p>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>

            {/* Responsive CSS */}
            <style>{`
                @media (min-width: 768px) {
                    .mobile-header { display: none !important; }
                    .md-sidebar { display: block !important; }
                    .main-content { padding-left: 250px; }
                    .page-main { padding-top: 0 !important; }
                }
            `}</style>
        </div>
    );
}

export default LayoutWrapper;