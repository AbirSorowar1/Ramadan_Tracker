import React, { useState, useEffect } from 'react';
import {
    PieChart, Pie, Cell, Tooltip, Legend,
    AreaChart, Area, BarChart, Bar, XAxis, YAxis,
    CartesianGrid, ResponsiveContainer
} from 'recharts';
import { db, ref, onValue } from '../firebase';

const PIE_COLORS = ['#dc2626', '#1f0000'];

const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div style={{
                backgroundColor: '#0a0a0a',
                border: '1px solid #7f1d1d',
                borderRadius: '10px',
                padding: '10px 16px',
                boxShadow: '0 0 20px rgba(220,38,38,0.15)',
            }}>
                {label && <p style={{ color: '#9ca3af', fontSize: '12px', margin: '0 0 4px' }}>{label}</p>}
                {payload.map((p, i) => (
                    <p key={i} style={{ color: p.value >= 0 ? '#4ade80' : '#ef4444', fontWeight: '700', fontSize: '15px', margin: 0 }}>
                        {p.value >= 0 ? '+' : ''}{p.value}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const StatCard = ({ icon, label, value, color, sub }) => (
    <div
        style={{
            background: 'linear-gradient(135deg, #0d0d0d, #120000)',
            border: '1px solid #2a0000',
            borderRadius: '18px',
            padding: '28px 24px',
            textAlign: 'center',
            transition: 'all 0.3s',
            position: 'relative',
            overflow: 'hidden',
        }}
        onMouseEnter={e => {
            e.currentTarget.style.border = '1px solid #7f1d1d';
            e.currentTarget.style.boxShadow = '0 0 30px rgba(220,38,38,0.1)';
            e.currentTarget.style.transform = 'translateY(-3px)';
        }}
        onMouseLeave={e => {
            e.currentTarget.style.border = '1px solid #2a0000';
            e.currentTarget.style.boxShadow = 'none';
            e.currentTarget.style.transform = 'translateY(0)';
        }}
    >
        <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
            background: `linear-gradient(to right, transparent, ${color}, transparent)`,
        }} />
        <p style={{ fontSize: '32px', margin: '0 0 10px' }}>{icon}</p>
        <p style={{ color, fontSize: '42px', fontWeight: '900', margin: '0 0 6px', lineHeight: 1 }}>
            {value}
        </p>
        <p style={{ color: '#9ca3af', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>
            {label}
        </p>
        {sub && <p style={{ color: '#6b7280', fontSize: '12px', marginTop: '6px' }}>{sub}</p>}
    </div>
);

export default function Analysis({ user }) {
    const [stats, setStats] = useState({
        totalPrayers: 0,
        totalDays: 0,
        totalScore: 0,
        dailyScores: [],
        prayerCompletion: 0,
        bestDay: null,
        avgScore: 0,
    });

    useEffect(() => {
        const daysRef = ref(db, `users/${user.uid}/days`);
        onValue(daysRef, (snap) => {
            const days = snap.val() || {};
            const keys = Object.keys(days).sort();

            let prayers = 0;
            let score = 0;
            const scores = [];
            let best = null;

            keys.forEach(date => {
                const day = days[date];
                const prayerDone = Object.values(day.prayers || {}).filter(Boolean).length;
                prayers += prayerDone;
                score += day.score || 0;
                const dayScore = day.score || 0;
                scores.push({ date: date.slice(5), score: dayScore });
                if (!best || dayScore > best.score) best = { date: date.slice(5), score: dayScore };
            });

            const expected = keys.length * 5;
            const completion = expected > 0 ? Math.round((prayers / expected) * 100) : 0;

            setStats({
                totalPrayers: prayers,
                totalDays: keys.length,
                totalScore: score,
                dailyScores: scores,
                prayerCompletion: completion,
                bestDay: best,
                avgScore: keys.length > 0 ? Math.round(score / keys.length) : 0,
            });
        });
    }, [user.uid]);

    const missedPrayers = stats.totalDays * 5 - stats.totalPrayers;
    const pieData = [
        { name: 'Completed', value: stats.totalPrayers },
        { name: 'Missed', value: missedPrayers > 0 ? missedPrayers : 0 },
    ];

    const renderCustomLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, name }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);
        if (percent < 0.05) return null;
        return (
            <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={13} fontWeight={700}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    };

    return (
        <div style={{ maxWidth: '960px', margin: '0 auto', padding: '32px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <p style={{ color: '#4b1c1c', fontSize: '22px', margin: '0 0 6px' }}>﷽</p>
                <h1 style={{ color: '#ffffff', fontSize: '34px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                    Ramadan <span style={{ color: '#dc2626' }}>Analysis</span>
                </h1>
                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                    Your spiritual journey at a glance
                </p>
                <div style={{ width: '50px', height: '3px', background: 'linear-gradient(to right, #7f1d1d, #dc2626)', margin: '14px auto 0', borderRadius: '999px' }} />
            </div>

            {/* Top Stats */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
                gap: '14px',
                marginBottom: '32px',
            }}>
                <StatCard icon="⭐" label="Total Score" value={stats.totalScore} color="#dc2626" />
                <StatCard icon="📅" label="Days Tracked" value={stats.totalDays} color="#a78bfa" />
                <StatCard icon="🕌" label="Prayers Done" value={stats.totalPrayers} color="#4ade80" />
                <StatCard icon="📊" label="Avg / Day" value={stats.avgScore} color="#fbbf24" sub="points per day" />
            </div>

            {/* Charts Row */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px', marginBottom: '24px' }}>

                {/* Pie Chart */}
                <div style={{
                    background: 'linear-gradient(135deg, #0d0d0d, #120000)',
                    border: '1px solid #2a0000',
                    borderRadius: '20px',
                    padding: '28px 20px',
                    boxShadow: '0 0 40px rgba(220,38,38,0.04)',
                }}>
                    <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        ✦ Prayer Completion
                    </p>
                    <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 20px' }}>
                        Overall Rate
                    </p>

                    {/* Completion % ring */}
                    <div style={{ position: 'relative', height: '220px' }}>
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={pieData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={70}
                                    outerRadius={95}
                                    startAngle={90}
                                    endAngle={-270}
                                    paddingAngle={3}
                                    labelLine={false}
                                    label={renderCustomLabel}
                                >
                                    {pieData.map((_, i) => (
                                        <Cell
                                            key={i}
                                            fill={i === 0 ? '#dc2626' : '#1a0000'}
                                            stroke="none"
                                        />
                                    ))}
                                </Pie>
                                <Tooltip
                                    content={({ active, payload }) => {
                                        if (active && payload?.length) {
                                            return (
                                                <div style={{ backgroundColor: '#0a0a0a', border: '1px solid #7f1d1d', borderRadius: '10px', padding: '10px 14px' }}>
                                                    <p style={{ color: '#ffffff', margin: 0, fontWeight: '600' }}>{payload[0].name}</p>
                                                    <p style={{ color: payload[0].name === 'Completed' ? '#dc2626' : '#6b7280', margin: 0 }}>{payload[0].value} prayers</p>
                                                </div>
                                            );
                                        }
                                        return null;
                                    }}
                                />
                            </PieChart>
                        </ResponsiveContainer>

                        {/* Center text */}
                        <div style={{
                            position: 'absolute', top: '50%', left: '50%',
                            transform: 'translate(-50%, -50%)',
                            textAlign: 'center',
                            pointerEvents: 'none',
                        }}>
                            <p style={{ color: '#dc2626', fontSize: '30px', fontWeight: '900', margin: 0, lineHeight: 1 }}>
                                {stats.prayerCompletion}%
                            </p>
                            <p style={{ color: '#6b7280', fontSize: '11px', margin: '4px 0 0' }}>completion</p>
                        </div>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '16px' }}>
                        {[{ color: '#dc2626', label: `${stats.totalPrayers} Done` }, { color: '#1a0000', label: `${missedPrayers > 0 ? missedPrayers : 0} Missed`, border: '1px solid #3f0000' }].map((l) => (
                            <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                <div style={{ width: '10px', height: '10px', borderRadius: '50%', backgroundColor: l.color, border: l.border || 'none' }} />
                                <span style={{ color: '#9ca3af', fontSize: '12px' }}>{l.label}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Bar / Area Chart */}
                <div style={{
                    background: 'linear-gradient(135deg, #0d0d0d, #120000)',
                    border: '1px solid #2a0000',
                    borderRadius: '20px',
                    padding: '28px 20px',
                    boxShadow: '0 0 40px rgba(220,38,38,0.04)',
                }}>
                    <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        ✦ Score Trend
                    </p>
                    <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 20px' }}>
                        Daily Scores
                    </p>
                    <div style={{ height: '220px' }}>
                        {stats.dailyScores.length === 0 ? (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#6b7280', fontSize: '14px' }}>
                                No data yet 📊
                            </div>
                        ) : (
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={stats.dailyScores} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                    <defs>
                                        <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#dc2626" stopOpacity={0.3} />
                                            <stop offset="95%" stopColor="#dc2626" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#1f0000" vertical={false} />
                                    <XAxis dataKey="date" stroke="#3f0000" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} />
                                    <YAxis stroke="#3f0000" tick={{ fill: '#6b7280', fontSize: 11 }} tickLine={false} axisLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#dc2626"
                                        strokeWidth={2.5}
                                        fill="url(#scoreGrad)"
                                        dot={{ fill: '#dc2626', strokeWidth: 0, r: 3 }}
                                        activeDot={{ fill: '#ffffff', stroke: '#dc2626', strokeWidth: 2, r: 5 }}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        )}
                    </div>

                    {stats.bestDay && (
                        <div style={{
                            marginTop: '16px',
                            padding: '10px 16px',
                            backgroundColor: 'rgba(220,38,38,0.08)',
                            border: '1px solid rgba(220,38,38,0.2)',
                            borderRadius: '10px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                        }}>
                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>🏆 Best Day</span>
                            <span style={{ color: '#ffffff', fontSize: '13px', fontWeight: '700' }}>
                                {stats.bestDay.date} — <span style={{ color: '#dc2626' }}>+{stats.bestDay.score} pts</span>
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Prayer breakdown bar */}
            {stats.totalDays > 0 && (
                <div style={{
                    background: 'linear-gradient(135deg, #0d0d0d, #120000)',
                    border: '1px solid #2a0000',
                    borderRadius: '20px',
                    padding: '28px',
                }}>
                    <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '4px' }}>
                        ✦ Prayer Completion Rate
                    </p>
                    <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: '0 0 20px' }}>
                        {stats.prayerCompletion}% of all prayers completed
                    </p>

                    <div style={{ height: '8px', backgroundColor: '#1a0000', borderRadius: '999px', overflow: 'hidden', marginBottom: '10px' }}>
                        <div style={{
                            height: '100%',
                            width: `${stats.prayerCompletion}%`,
                            background: 'linear-gradient(to right, #7f1d1d, #dc2626)',
                            borderRadius: '999px',
                            transition: 'width 1s ease',
                            boxShadow: '0 0 12px rgba(220,38,38,0.4)',
                        }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>0%</span>
                        <span style={{ color: '#6b7280', fontSize: '12px' }}>100%</span>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', marginTop: '16px', flexWrap: 'wrap' }}>
                        {[
                            { label: 'Expected', value: stats.totalDays * 5, color: '#6b7280' },
                            { label: 'Completed', value: stats.totalPrayers, color: '#dc2626' },
                            { label: 'Missed', value: Math.max(0, stats.totalDays * 5 - stats.totalPrayers), color: '#4b1c1c' },
                        ].map((s) => (
                            <div key={s.label} style={{
                                flex: 1,
                                minWidth: '100px',
                                backgroundColor: 'rgba(0,0,0,0.4)',
                                border: '1px solid #1f0000',
                                borderRadius: '12px',
                                padding: '14px',
                                textAlign: 'center',
                            }}>
                                <p style={{ color: s.color, fontSize: '26px', fontWeight: '800', margin: 0 }}>{s.value}</p>
                                <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', margin: '4px 0 0' }}>{s.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}