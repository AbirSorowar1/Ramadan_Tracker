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

const menuItems = [
    { key: '/prayers', label: <Link to="/prayers">Salat</Link> },
    { key: '/deeds', label: <Link to="/deeds">Deeds</Link> },
    { key: '/calendar', label: <Link to="/calendar">Calendar</Link> },
    { key: '/analysis', label: <Link to="/analysis">Analysis</Link> },
    { key: '/dua', label: <Link to="/dua">Dua & Reminder</Link> },
    { key: '/quran', label: <Link to="/quran">Quran Progress</Link> },
    { key: '/motivation', label: <Link to="/motivation">Motivation</Link> },
    { key: '/profile', label: <Link to="/profile">Profile</Link> },
];

function LayoutWrapper({ user }) {
    const [mobileOpen, setMobileOpen] = useState(false);
    const location = useLocation();

    const avatarSrc = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=dc2626&color=fff&size=256&rounded=true`;

    const handleLogout = async () => {
        await logout();
    };

    return (
        <Layout className="min-h-screen bg-black text-white">
            {/* Mobile Drawer */}
            <Drawer
                placement="left"
                onClose={() => setMobileOpen(false)}
                open={mobileOpen}
                width={280}
                closable={false}
                styles={{ body: { padding: 0, background: '#000000' } }}
                className="md:hidden"
            >
                <div className="h-full flex flex-col bg-black">
                    <div className="p-6 border-b border-red-900/30 flex items-center justify-between">
                        <h2 className="text-2xl font-bold text-red-600">Ramadan Tracker</h2>
                        <Avatar src={avatarSrc} size={48} className="ring-2 ring-red-600/50" />
                    </div>

                    <Menu
                        theme="dark"
                        mode="inline"
                        selectedKeys={[location.pathname]}
                        items={menuItems.map(item => ({
                            ...item,
                            onClick: () => setMobileOpen(false),
                        }))}
                        className="flex-1 border-none bg-black px-2"
                    />

                    <div className="p-6 mt-auto border-t border-red-900/30">
                        <Button danger block size="large" icon={<LogoutOutlined />} onClick={handleLogout}>
                            Logout
                        </Button>
                    </div>
                </div>
            </Drawer>

            {/* Desktop Sider */}
            <Sider
                breakpoint="md"
                collapsedWidth={0}
                width={240}
                trigger={null}
                className="hidden md:block bg-black border-r border-red-900/30 fixed top-0 bottom-0 left-0 z-20"
            >
                <div className="p-6 border-b border-red-900/30 flex items-center gap-4">
                    <Avatar src={avatarSrc} size={56} className="ring-2 ring-red-600/50 shadow-lg" />
                    <div>
                        <h2 className="text-xl font-bold text-red-600">Ramadan Tracker</h2>
                        <p className="text-sm text-gray-300 truncate">{user.displayName || 'User'}</p>
                    </div>
                </div>

                <Menu theme="dark" mode="inline" selectedKeys={[location.pathname]} items={menuItems} className="border-none bg-black mt-6" />

                <div className="absolute bottom-8 left-6 right-6">
                    <Button danger block size="large" icon={<LogoutOutlined />} onClick={handleLogout}>
                        Logout
                    </Button>
                </div>
            </Sider>

            <Layout className="md:ml-[240px]">
                <Header className="bg-black px-6 flex items-center justify-between md:hidden h-16 fixed top-0 left-0 right-0 z-10 border-b border-red-900/30">
                    <Button type="text" icon={<MenuOutlined className="text-3xl text-red-500" />} onClick={() => setMobileOpen(true)} />
                    <span className="text-2xl font-bold text-red-600">Ramadan Tracker</span>
                    <Avatar src={avatarSrc} size={44} className="ring-2 ring-red-600/40" />
                </Header>

                <Content className="pt-16 md:pt-0 p-6 bg-black min-h-screen">
                    <Routes>
                        <Route path="/prayers" element={<Prayers user={user} />} />
                        <Route path="/deeds" element={<Deeds user={user} />} />
                        <Route path="/calendar" element={<CalendarPage user={user} />} />
                        <Route path="/analysis" element={<Analysis user={user} />} />
                        <Route path="/dua" element={<DuaReminder user={user} />} />
                        <Route path="/quran" element={<QuranProgress user={user} />} />
                        <Route path="/motivation" element={<Motivation user={user} />} />
                        <Route path="/profile" element={<Profile user={user} />} />
                        <Route path="*" element={<div className="text-center py-40"><h1 className="text-6xl text-red-600">Ramadan Mubarak</h1></div>} />
                    </Routes>
                </Content>
            </Layout>
        </Layout>
    );
}

export default LayoutWrapper;