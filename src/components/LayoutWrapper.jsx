import React, { useState, useEffect } from 'react';
import { Drawer, Avatar } from 'antd';
import { MenuOutlined, LogoutOutlined } from '@ant-design/icons';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { logout } from '../firebase';
import Prayers from './Prayers';
import Deeds from './Deeds';
import CalendarPage from './CalendarPage';
import Analysis from './Analysis';
import Profile from './Profile';
import DuaReminder from './DuaReminder';
import QuranProgress from './QuranProgress';
import Motivation from './Motivation';

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

/* ─── Sidebar ─────────────────────────────────────────────── */
const SidebarContent = ({ location, onItemClick, user, avatarSrc }) => {
    const [hoveredKey, setHoveredKey] = useState(null);

    return (
        <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            backgroundColor: '#000',
            position: 'relative',
            overflow: 'hidden',
        }}>
            <style>{`
                @keyframes sidebarGlow {
                    0%,100% { opacity: 0.4; }
                    50%      { opacity: 0.9; }
                }
                @keyframes slideInNav {
                    from { opacity: 0; transform: translateX(-18px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes onlinePulse {
                    0%,100% { box-shadow: 0 0 0 0 rgba(34,197,94,0.6); }
                    50%      { box-shadow: 0 0 0 5px rgba(34,197,94,0); }
                }
                @keyframes shimmerLine {
                    0%   { background-position: -200px 0; }
                    100% { background-position: 200px 0; }
                }
                @keyframes dotGlow {
                    0%,100% { box-shadow: 0 0 6px #dc2626; }
                    50%      { box-shadow: 0 0 14px #dc2626, 0 0 28px rgba(220,38,38,0.4); }
                }
                .nav-item {
                    animation: slideInNav 0.4s ease both;
                }
                .nav-item:nth-child(1)  { animation-delay: 0.05s; }
                .nav-item:nth-child(2)  { animation-delay: 0.10s; }
                .nav-item:nth-child(3)  { animation-delay: 0.15s; }
                .nav-item:nth-child(4)  { animation-delay: 0.20s; }
                .nav-item:nth-child(5)  { animation-delay: 0.25s; }
                .nav-item:nth-child(6)  { animation-delay: 0.30s; }
                .nav-item:nth-child(7)  { animation-delay: 0.35s; }
                .nav-item:nth-child(8)  { animation-delay: 0.40s; }
                .logout-btn:hover {
                    background-color: rgba(220,38,38,0.18) !important;
                    border-color: #dc2626 !important;
                    box-shadow: 0 0 20px rgba(220,38,38,0.2) !important;
                }
            `}</style>

            {/* Ambient glow */}
            <div style={{
                position: 'absolute', top: '-60px', right: '-60px',
                width: '200px', height: '200px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(220,38,38,0.08) 0%, transparent 70%)',
                pointerEvents: 'none',
                animation: 'sidebarGlow 4s ease-in-out infinite',
            }} />
            <div style={{
                position: 'absolute', bottom: '80px', left: '-40px',
                width: '150px', height: '150px', borderRadius: '50%',
                background: 'radial-gradient(circle, rgba(220,38,38,0.05) 0%, transparent 70%)',
                pointerEvents: 'none',
            }} />

            {/* Shimmer top line */}
            <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, transparent, #dc2626 40%, #ff6b6b 50%, #dc2626 60%, transparent)',
                backgroundSize: '200px 100%',
                animation: 'shimmerLine 2.5s linear infinite',
            }} />

            {/* Profile Header */}
            <div style={{
                padding: '28px 20px 20px',
                borderBottom: '1px solid #1a0000',
                display: 'flex',
                alignItems: 'center',
                gap: '14px',
                position: 'relative',
            }}>
                <div style={{ position: 'relative', flexShrink: 0 }}>
                    <Avatar src={avatarSrc} size={50} style={{
                        border: '2px solid #dc2626',
                        boxShadow: '0 0 20px rgba(220,38,38,0.4)',
                        display: 'block',
                    }} />
                    <span style={{
                        position: 'absolute', bottom: 1, right: 1,
                        width: '11px', height: '11px',
                        backgroundColor: '#22c55e', borderRadius: '50%',
                        border: '2px solid #000',
                        animation: 'onlinePulse 2s ease-in-out infinite',
                    }} />
                </div>
                <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{
                        margin: 0, fontSize: '11px', color: '#dc2626',
                        letterSpacing: '2px', textTransform: 'uppercase', fontWeight: '600',
                    }}>
                        Ramadan Tracker
                    </p>
                    <p style={{
                        margin: '3px 0 0', fontSize: '13px', color: '#ffffff',
                        fontWeight: '600', whiteSpace: 'nowrap',
                        overflow: 'hidden', textOverflow: 'ellipsis',
                    }}>
                        {user.displayName || 'User'}
                    </p>
                    <p style={{ margin: '2px 0 0', fontSize: '11px', color: '#4b4b4b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {user.email}
                    </p>
                </div>
            </div>

            {/* Bismillah */}
            <div style={{ textAlign: 'center', padding: '12px 0 6px' }}>
                <span style={{ color: '#3f0000', fontSize: '16px', fontFamily: 'serif', letterSpacing: '3px' }}>﷽</span>
            </div>

            {/* Nav */}
            <nav style={{ flex: 1, padding: '6px 10px', overflowY: 'auto' }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.key;
                    const isHovered = hoveredKey === item.key;

                    return (
                        <Link
                            to={item.key}
                            key={item.key}
                            onClick={onItemClick}
                            style={{ textDecoration: 'none', display: 'block' }}
                            className="nav-item"
                        >
                            <div
                                onMouseEnter={() => setHoveredKey(item.key)}
                                onMouseLeave={() => setHoveredKey(null)}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '12px',
                                    padding: '10px 14px',
                                    borderRadius: '12px',
                                    marginBottom: '3px',
                                    backgroundColor: isActive
                                        ? 'rgba(220,38,38,0.13)'
                                        : isHovered
                                            ? 'rgba(255,255,255,0.04)'
                                            : 'transparent',
                                    border: isActive
                                        ? '1px solid rgba(220,38,38,0.35)'
                                        : isHovered
                                            ? '1px solid rgba(220,38,38,0.15)'
                                            : '1px solid transparent',
                                    transition: 'all 0.22s ease',
                                    cursor: 'pointer',
                                    position: 'relative',
                                    transform: isHovered && !isActive ? 'translateX(3px)' : 'translateX(0)',
                                }}
                            >
                                {/* Active left bar */}
                                {isActive && (
                                    <div style={{
                                        position: 'absolute', left: 0, top: '20%', bottom: '20%',
                                        width: '3px', borderRadius: '999px',
                                        backgroundColor: '#dc2626',
                                        boxShadow: '0 0 10px #dc2626',
                                    }} />
                                )}

                                <span style={{
                                    fontSize: '18px', flexShrink: 0,
                                    transform: isActive ? 'scale(1.1)' : 'scale(1)',
                                    transition: 'transform 0.2s',
                                    filter: isActive ? 'drop-shadow(0 0 6px rgba(220,38,38,0.5))' : 'none',
                                }}>
                                    {item.icon}
                                </span>

                                <span style={{
                                    color: isActive ? '#ffffff' : isHovered ? '#e5e7eb' : '#9ca3af',
                                    fontSize: '13.5px',
                                    fontWeight: isActive ? '700' : '400',
                                    letterSpacing: '0.2px',
                                    flex: 1,
                                    transition: 'color 0.2s',
                                }}>
                                    {item.label}
                                </span>

                                {isActive && (
                                    <div style={{
                                        width: '7px', height: '7px', borderRadius: '50%',
                                        backgroundColor: '#dc2626',
                                        animation: 'dotGlow 2s ease-in-out infinite',
                                        flexShrink: 0,
                                    }} />
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Logout */}
            <div style={{ padding: '12px 14px 20px', borderTop: '1px solid #1a0000' }}>
                <button
                    className="logout-btn"
                    onClick={logout}
                    style={{
                        width: '100%',
                        backgroundColor: 'rgba(220,38,38,0.07)',
                        border: '1px solid #5f1d1d',
                        color: '#ef4444',
                        padding: '11px 16px',
                        borderRadius: '12px',
                        cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        gap: '8px',
                        fontSize: '13.5px', fontWeight: '500',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
                    }}
                >
                    <LogoutOutlined /> Logout
                </button>
            </div>
        </div>
    );
};

/* ─── Bottom Nav (Mobile) ─────────────────────────────────── */
const BottomNav = ({ location }) => {
    const mainItems = navItems.slice(0, 5);
    return (
        <div style={{
            position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 50,
            backgroundColor: '#050505',
            borderTop: '1px solid #1f0000',
            display: 'flex',
            boxShadow: '0 -4px 30px rgba(220,38,38,0.08)',
            paddingBottom: 'env(safe-area-inset-bottom)',
        }}>
            <style>{`
                @keyframes tabPop {
                    0%   { transform: scale(1); }
                    40%  { transform: scale(1.25); }
                    100% { transform: scale(1); }
                }
                .bottom-tab:active { transform: scale(0.92) !important; }
            `}</style>
            {mainItems.map((item) => {
                const isActive = location.pathname === item.key;
                return (
                    <Link
                        to={item.key}
                        key={item.key}
                        className="bottom-tab"
                        style={{
                            flex: 1,
                            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
                            padding: '10px 4px 8px',
                            textDecoration: 'none',
                            transition: 'all 0.2s',
                            position: 'relative',
                        }}
                    >
                        {isActive && (
                            <div style={{
                                position: 'absolute', top: 0, left: '25%', right: '25%',
                                height: '2px', borderRadius: '0 0 4px 4px',
                                background: 'linear-gradient(to right, #7f1d1d, #dc2626)',
                                boxShadow: '0 0 8px rgba(220,38,38,0.6)',
                            }} />
                        )}
                        <span style={{
                            fontSize: '22px',
                            filter: isActive ? 'drop-shadow(0 0 6px rgba(220,38,38,0.7))' : 'none',
                            animation: isActive ? 'tabPop 0.3s ease' : 'none',
                            marginBottom: '3px',
                        }}>
                            {item.icon}
                        </span>
                        <span style={{
                            fontSize: '9px',
                            color: isActive ? '#dc2626' : '#4b4b4b',
                            fontWeight: isActive ? '700' : '400',
                            letterSpacing: '0.3px',
                            textTransform: 'uppercase',
                        }}>
                            {item.label.split(' ')[0]}
                        </span>
                    </Link>
                );
            })}
        </div>
    );
};

/* ─── Layout Wrapper ──────────────────────────────────────── */
function LayoutWrapper({ user }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [pageVisible, setPageVisible] = useState(false);
    const location = useLocation();

    const avatarSrc = user.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=dc2626&color=fff&size=256&rounded=true`;

    // Page transition on route change
    useEffect(() => {
        setPageVisible(false);
        const t = setTimeout(() => setPageVisible(true), 80);
        return () => clearTimeout(t);
    }, [location.pathname]);

    return (
        <div style={{
            display: 'flex',
            minHeight: '100dvh',
            backgroundColor: '#000',
            fontFamily: "'Segoe UI', sans-serif",
            position: 'relative',
        }}>
            <style>{`
                * { box-sizing: border-box; }
                body { background: #000; overflow-x: hidden; }

                @keyframes pageSlideIn {
                    from { opacity: 0; transform: translateY(14px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes headerShimmer {
                    0%   { background-position: -400px 0; }
                    100% { background-position: 400px 0; }
                }
                @keyframes drawerSlide {
                    from { transform: translateX(-100%); opacity: 0; }
                    to   { transform: translateX(0);     opacity: 1; }
                }
                @keyframes mobileAvatarGlow {
                    0%,100% { box-shadow: 0 0 8px rgba(220,38,38,0.3); }
                    50%      { box-shadow: 0 0 20px rgba(220,38,38,0.6); }
                }

                /* Desktop sidebar */
                @media (min-width: 768px) {
                    .mobile-header  { display: none !important; }
                    .mobile-bottom  { display: none !important; }
                    .md-sidebar     { display: flex !important; }
                    .main-content   { padding-left: 248px !important; }
                    .page-main      { padding-top: 0 !important; padding-bottom: 0 !important; }
                }

                /* Mobile bottom nav spacing */
                @media (max-width: 767px) {
                    .page-main { padding-bottom: 70px !important; }
                }

                /* Scrollbar */
                nav::-webkit-scrollbar { width: 3px; }
                nav::-webkit-scrollbar-track { background: transparent; }
                nav::-webkit-scrollbar-thumb { background: #3f0000; border-radius: 4px; }
            `}</style>

            {/* ── Mobile Drawer ── */}
            <Drawer
                placement="left"
                onClose={() => setMobileOpen(false)}
                open={mobileOpen}
                width={268}
                closable={false}
                styles={{
                    body: { padding: 0, background: '#000' },
                    mask: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.75)' },
                }}
            >
                <SidebarContent
                    location={location}
                    onItemClick={() => setMobileOpen(false)}
                    user={user}
                    avatarSrc={avatarSrc}
                />
            </Drawer>

            {/* ── Desktop Sidebar ── */}
            <div
                className="md-sidebar"
                style={{
                    width: '248px',
                    flexShrink: 0,
                    position: 'fixed',
                    top: 0, left: 0, bottom: 0,
                    zIndex: 20,
                    borderRight: '1px solid #1a0000',
                    display: 'none',
                    flexDirection: 'column',
                    backgroundColor: '#000',
                }}
            >
                <SidebarContent
                    location={location}
                    onItemClick={() => { }}
                    user={user}
                    avatarSrc={avatarSrc}
                />
            </div>

            {/* ── Main Area ── */}
            <div className="main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>

                {/* Mobile Header */}
                <header
                    className="mobile-header"
                    style={{
                        position: 'fixed',
                        top: 0, left: 0, right: 0,
                        zIndex: 30,
                        height: '58px',
                        backgroundColor: 'rgba(0,0,0,0.95)',
                        backdropFilter: 'blur(12px)',
                        borderBottom: '1px solid #1a0000',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0 18px',
                        boxShadow: '0 2px 24px rgba(220,38,38,0.06)',
                    }}
                >
                    {/* Shimmer bottom line on header */}
                    <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0, height: '1px',
                        background: 'linear-gradient(90deg, transparent, #dc2626 40%, #ff6b6b 50%, #dc2626 60%, transparent)',
                        backgroundSize: '400px 100%',
                        animation: 'headerShimmer 3s linear infinite',
                        opacity: 0.6,
                    }} />

                    <button
                        onClick={() => setMobileOpen(true)}
                        style={{
                            background: 'rgba(220,38,38,0.08)',
                            border: '1px solid rgba(220,38,38,0.2)',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            padding: '8px 10px',
                            display: 'flex', alignItems: 'center',
                            color: '#dc2626',
                            transition: 'all 0.2s',
                        }}
                    >
                        <MenuOutlined style={{ fontSize: '18px' }} />
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '17px', fontWeight: '900', color: '#dc2626', letterSpacing: '-0.3px', lineHeight: 1.2 }}>
                            Ramadan Tracker
                        </p>
                        <p style={{ margin: 0, fontSize: '9px', color: '#4b1c1c', letterSpacing: '2px', textTransform: 'uppercase' }}>
                            {navItems.find(n => n.key === location.pathname)?.label || 'Home'}
                        </p>
                    </div>

                    <Avatar
                        src={avatarSrc}
                        size={36}
                        style={{
                            border: '2px solid #dc2626',
                            animation: 'mobileAvatarGlow 3s ease-in-out infinite',
                        }}
                    />
                </header>

                {/* Page Content */}
                <main
                    className="page-main"
                    style={{
                        flex: 1,
                        paddingTop: '58px',
                        backgroundColor: '#000',
                        minHeight: '100dvh',
                        opacity: pageVisible ? 1 : 0,
                        transform: pageVisible ? 'translateY(0)' : 'translateY(12px)',
                        transition: 'opacity 0.3s ease, transform 0.3s ease',
                    }}
                >
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
                            <div style={{ textAlign: 'center', paddingTop: '100px', padding: '100px 24px 40px' }}>
                                <p style={{ color: '#3f0000', fontSize: '32px', margin: '0 0 16px', fontFamily: 'serif' }}>﷽</p>
                                <h1 style={{ fontSize: 'clamp(28px, 8vw, 52px)', fontWeight: '900', color: '#dc2626', margin: '0 0 12px' }}>
                                    Ramadan Mubarak
                                </h1>
                                <p style={{ color: '#6b7280', fontSize: 'clamp(13px, 3vw, 16px)' }}>
                                    May Allah accept your ibadah 🤲
                                </p>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>

            {/* ── Mobile Bottom Nav ── */}
            <div className="mobile-bottom">
                <BottomNav location={location} />
            </div>
        </div>
    );
}

export default LayoutWrapper;