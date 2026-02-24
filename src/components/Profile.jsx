import React, { useState, useEffect } from 'react';
import { Avatar, Typography, Statistic, Card, List } from 'antd';
import { db, ref, onValue } from '../firebase';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function Profile({ user }) {
    const [stats, setStats] = useState({ totalScore: 0, totalPrayers: 0, totalDays: 0, recentDeeds: [] });

    const avatarSrc = user.photoURL || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=dc2626&color=fff&size=256&rounded=true`;

    useEffect(() => {
        const daysRef = ref(db, `users/${user.uid}/days`);
        onValue(daysRef, (snap) => {
            const days = snap.val() || {};
            let prayers = 0, score = 0, deeds = [];
            Object.entries(days).forEach(([date, day]) => {
                prayers += Object.values(day.prayers || {}).filter(Boolean).length;
                score += day.score || 0;
                if (deeds.length < 5 && day.deeds) {
                    Object.values(day.deeds).slice(0, 5 - deeds.length).forEach(d => deeds.push({ ...d, date }));
                }
            });
            setStats({ totalScore: score, totalPrayers: prayers, totalDays: Object.keys(days).length, recentDeeds: deeds });
        });
    }, [user.uid]);

    return (
        <div className="max-w-4xl mx-auto space-y-12">
            <div className="text-center">
                <Avatar src={avatarSrc} size={180} className="mb-8 ring-4 ring-red-600/60 shadow-2xl shadow-red-950/40" />
                <Title level={2} className="text-white text-4xl mb-2">{user.displayName || 'User'}</Title>
                <p className="text-xl text-gray-300">{user.email}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-black border border-red-900/40 text-center hover:shadow-lg hover:shadow-red-950/30 transition-all">
                    <Statistic title={<span className="text-gray-200 text-lg">Total Score</span>} value={stats.totalScore} valueStyle={{ color: '#ef4444', fontSize: 40 }} />
                </Card>
                <Card className="bg-black border border-red-900/40 text-center hover:shadow-lg hover:shadow-red-950/30 transition-all">
                    <Statistic title={<span className="text-gray-200 text-lg">Prayers Done</span>} value={stats.totalPrayers} suffix={<span className="text-gray-400"> / {stats.totalDays * 5}</span>} valueStyle={{ color: '#22c55e', fontSize: 40 }} />
                </Card>
                <Card className="bg-black border border-red-900/40 text-center hover:shadow-lg hover:shadow-red-950/30 transition-all">
                    <Statistic title={<span className="text-gray-200 text-lg">Days Tracked</span>} value={stats.totalDays} valueStyle={{ color: '#3b82f6', fontSize: 40 }} />
                </Card>
            </div>

            <Card className="bg-black border border-red-900/40">
                <Title level={4} className="text-red-500 text-2xl mb-6">Recent Deeds</Title>
                <List
                    dataSource={stats.recentDeeds}
                    renderItem={item => (
                        <List.Item className="border-b border-red-900/20 py-5 last:border-none">
                            <div className="flex justify-between w-full items-center">
                                <div>
                                    <p className="text-lg text-white">{item.description}</p>
                                    <p className="text-sm text-gray-400 mt-1">{dayjs(item.date).format('MMM D, YYYY')}</p>
                                </div>
                                <span className={`text-xl font-medium ${item.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.points > 0 ? '+' : ''}{item.points}
                                </span>
                            </div>
                        </List.Item>
                    )}
                    locale={{ emptyText: <p className="text-gray-400 py-12 text-center text-lg">No recent deeds yet</p> }}
                />
            </Card>
        </div>
    );
}