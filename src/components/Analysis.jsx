import React, { useState, useEffect } from 'react';
import { Card, Typography } from 'antd';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    BarChart, Bar, XAxis, YAxis, CartesianGrid, ResponsiveContainer
} from 'recharts';
import { db, ref, onValue } from '../firebase';

const { Title } = Typography;

const COLORS = ['#22c55e', '#ef4444'];

export default function Analysis({ user }) {
    const [stats, setStats] = useState({
        totalPrayers: 0,
        totalDays: 0,
        totalScore: 0,
        dailyScores: [],
        prayerCompletion: 0,
    });

    useEffect(() => {
        const daysRef = ref(db, `users/${user.uid}/days`);
        onValue(daysRef, (snap) => {
            const days = snap.val() || {};
            const keys = Object.keys(days);

            let prayers = 0;
            let score = 0;
            const scores = [];

            keys.forEach(date => {
                const day = days[date];
                const prayerDone = Object.values(day.prayers || {}).filter(Boolean).length;
                prayers += prayerDone;
                score += day.score || 0;

                scores.push({ date: date.slice(5), score: day.score || 0 });
            });

            const expected = keys.length * 5;
            const completion = expected > 0 ? Math.round((prayers / expected) * 100) : 0;

            setStats({
                totalPrayers: prayers,
                totalDays: keys.length,
                totalScore: score,
                dailyScores: scores,
                prayerCompletion: completion,
            });
        });
    }, [user.uid]);

    const pieData = [
        { name: 'Completed', value: stats.totalPrayers },
        { name: 'Missed', value: stats.totalDays * 5 - stats.totalPrayers },
    ];

    return (
        <div className="max-w-6xl mx-auto space-y-12 bg-black text-white">
            <Title level={2} className="text-red-600 text-5xl font-bold text-center tracking-tight mb-12">
                Ramadan Analysis
            </Title>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Prayer Completion Chart */}
                <Card className="bg-black border border-red-900/40 hover:shadow-xl hover:shadow-red-950/30 transition-all duration-300">
                    <Title level={4} className="text-white text-3xl mb-8 text-center">
                        Prayer Completion
                    </Title>
                    <div className="h-80 flex items-center justify-center">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={80}
                                    outerRadius={120}
                                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                    labelStyle={{ fill: '#ffffff', fontSize: 14, fontWeight: 'bold' }}
                                >
                                    {pieData.map((_, index) => <Cell key={index} fill={COLORS[index]} />)}
                                </Pie>
                                <Tooltip
                                    contentStyle={{ background: '#111111', border: '1px solid #ef4444', color: '#ffffff' }}
                                    labelStyle={{ color: '#ffffff' }}
                                    itemStyle={{ color: '#ffffff' }}
                                />
                                <Legend wrapperStyle={{ color: '#ffffff' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <p className="text-center text-2xl mt-6 text-white">
                        Overall Completion: <span className="text-green-400 font-bold">{stats.prayerCompletion}%</span>
                    </p>
                </Card>

                {/* Daily Scores Chart */}
                <Card className="bg-black border border-red-900/40 hover:shadow-xl hover:shadow-red-950/30 transition-all duration-300">
                    <Title level={4} className="text-white text-3xl mb-8 text-center">
                        Daily Scores Trend
                    </Title>
                    <div className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={stats.dailyScores} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" stroke="#222222" />
                                <XAxis dataKey="date" stroke="#aaaaaa" tick={{ fill: '#ffffff' }} />
                                <YAxis stroke="#aaaaaa" tick={{ fill: '#ffffff' }} />
                                <Tooltip
                                    contentStyle={{ background: '#111111', border: '1px solid #ef4444', color: '#ffffff' }}
                                />
                                <Bar dataKey="score" fill="#ef4444" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </Card>
            </div>

            {/* Summary Stats – all titles white */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <Card className="bg-black border border-red-900/40 text-center hover:scale-105 transition-transform duration-300">
                    <Title level={5} className="text-white text-2xl mb-4">
                        Total Score
                    </Title>
                    <p className="text-6xl font-extrabold text-red-500">{stats.totalScore}</p>
                </Card>

                <Card className="bg-black border border-red-900/40 text-center hover:scale-105 transition-transform duration-300">
                    <Title level={5} className="text-white text-2xl mb-4">
                        Days Tracked
                    </Title>
                    <p className="text-6xl font-extrabold text-blue-400">{stats.totalDays}</p>
                </Card>

                <Card className="bg-black border border-red-900/40 text-center hover:scale-105 transition-transform duration-300">
                    <Title level={5} className="text-white text-2xl mb-4">
                        Prayers Done
                    </Title>
                    <p className="text-6xl font-extrabold text-green-400">{stats.totalPrayers}</p>
                </Card>
            </div>
        </div>
    );
}