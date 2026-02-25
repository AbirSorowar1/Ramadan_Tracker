import React, { useState, useEffect } from 'react';
import { Avatar } from 'antd';
import { db, ref, onValue } from '../firebase';
import dayjs from 'dayjs';

export default function Profile({ user }) {
    const [stats, setStats] = useState({
        totalScore: 0,
        totalPrayers: 0,
        totalDays: 0,
        recentDeeds: [],
        prayerCompletion: 0,
        bestScore: 0,
        goodDeeds: 0,
        badDeeds: 0,
    });

    const avatarSrc = user.photoURL ||
        `https://ui-avatars.com/api/?name=${encodeURIComponent(user.displayName || 'User')}&background=dc2626&color=fff&size=256&rounded=true`;

    const joinDate = user.metadata?.creationTime
        ? dayjs(user.metadata.creationTime).format('MMM D, YYYY')
        : 'Ramadan 2025';

    useEffect(() => {
        const daysRef = ref(db, `users/${user.uid}/days`);
        onValue(daysRef, (snap) => {
            const days = snap.val() || {};
            let prayers = 0, score = 0, deeds = [], bestScore = 0, goodD = 0, badD = 0;
            const keys = Object.keys(days);

            keys.forEach((date) => {
                const day = days[date];
                prayers += Object.values(day.prayers || {}).filter(Boolean).length;
                const dayScore = day.score || 0;
                score += dayScore;
                if (dayScore > bestScore) bestScore = dayScore;

                if (day.deeds) {
                    Object.values(day.deeds).forEach(d => {
                        if (d.points > 0) goodD++;
                        else badD++;
                        if (deeds.length < 6) deeds.push({ ...d, date });
                    });
                }
            });

            const expected = keys.length * 5;
            const completion = expected > 0 ? Math.round((prayers / expected) * 100) : 0;

            setStats({
                totalScore: score,
                totalPrayers: prayers,
                totalDays: keys.length,
                recentDeeds: deeds.slice(0, 6),
                prayerCompletion: completion,
                bestScore,
                goodDeeds: goodD,
                badDeeds: badD,
            });
        });
    }, [user.uid]);

    const getRank = (score) => {
        if (score >= 500) return { label: 'Hafiz', icon: '👑', color: '#fbbf24' };
        if (score >= 300) return { label: 'Muttaqi', icon: '⭐', color: '#a78bfa' };
        if (score >= 150) return { label: 'Abid', icon: '🌙', color: '#dc2626' };
        return { label: 'Murid', icon: '🌱', color: '#4ade80' };
    };

    const rank = getRank(stats.totalScore);

    return (
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <p style={{ color: '#4b1c1c', fontSize: '22px', margin: '0 0 4px' }}>﷽</p>
            </div>

            {/* Profile Hero Card */}
            <div style={{
                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0000 60%, #0f0f0f 100%)',
                border: '1px solid #3f0000',
                borderRadius: '24px',
                padding: '40px 32px',
                marginBottom: '24px',
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 0 60px rgba(220,38,38,0.07)',
            }}>
                {/* Top red line */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(to right, transparent, #dc2626, transparent)',
                }} />

                {/* Decorative bg circles */}
                <div style={{
                    position: 'absolute', top: '-60px', right: '-60px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(220,38,38,0.06) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />
                <div style={{
                    position: 'absolute', bottom: '-60px', left: '-60px',
                    width: '200px', height: '200px', borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(220,38,38,0.04) 0%, transparent 70%)',
                    pointerEvents: 'none',
                }} />

                {/* Avatar */}
                <div style={{ position: 'relative', display: 'inline-block', marginBottom: '20px' }}>
                    <Avatar
                        src={avatarSrc}
                        size={120}
                        style={{
                            border: '3px solid #dc2626',
                            boxShadow: '0 0 30px rgba(220,38,38,0.4), 0 0 60px rgba(220,38,38,0.15)',
                        }}
                    />
                    {/* Rank badge */}
                    <div style={{
                        position: 'absolute',
                        bottom: '-4px',
                        right: '-4px',
                        backgroundColor: '#0a0a0a',
                        border: `2px solid ${rank.color}`,
                        borderRadius: '999px',
                        padding: '2px 8px',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: rank.color,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        whiteSpace: 'nowrap',
                        boxShadow: `0 0 12px ${rank.color}40`,
                    }}>
                        {rank.icon} {rank.label}
                    </div>
                </div>

                <h2 style={{ color: '#ffffff', fontSize: '28px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.3px' }}>
                    {user.displayName || 'User'}
                </h2>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: '0 0 16px' }}>{user.email}</p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span style={{
                        color: '#9ca3af', fontSize: '12px',
                        backgroundColor: 'rgba(255,255,255,0.04)',
                        border: '1px solid #2a0000',
                        padding: '4px 14px', borderRadius: '999px',
                    }}>
                        🗓️ Joined {joinDate}
                    </span>
                    <span style={{
                        color: '#fca5a5', fontSize: '12px',
                        backgroundColor: 'rgba(220,38,38,0.08)',
                        border: '1px solid rgba(220,38,38,0.2)',
                        padding: '4px 14px', borderRadius: '999px',
                    }}>
                        🌙 Ramadan 2025
                    </span>
                </div>

                {/* Prayer progress bar inside hero */}
                <div style={{ marginTop: '24px', textAlign: 'left' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                        <span style={{ color: '#9ca3af', fontSize: '12px', letterSpacing: '1px' }}>Prayer Completion</span>
                        <span style={{ color: '#dc2626', fontSize: '12px', fontWeight: '700' }}>{stats.prayerCompletion}%</span>
                    </div>
                    <div style={{ height: '6px', backgroundColor: '#1a0000', borderRadius: '999px', overflow: 'hidden', border: '1px solid #2a0000' }}>
                        <div style={{
                            height: '100%',
                            width: `${stats.prayerCompletion}%`,
                            background: 'linear-gradient(to right, #7f1d1d, #dc2626)',
                            borderRadius: '999px',
                            transition: 'width 1s ease',
                            boxShadow: stats.prayerCompletion > 0 ? '0 0 10px rgba(220,38,38,0.4)' : 'none',
                        }} />
                    </div>
                </div>
            </div>

            {/* Main Stats Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '14px', marginBottom: '24px' }}>
                {[
                    { icon: '⭐', label: 'Total Score', value: stats.totalScore, color: '#dc2626' },
                    { icon: '🕌', label: 'Prayers Done', value: `${stats.totalPrayers}/${stats.totalDays * 5}`, color: '#4ade80' },
                    { icon: '📅', label: 'Days Tracked', value: stats.totalDays, color: '#a78bfa' },
                    { icon: '🏆', label: 'Best Day', value: stats.bestScore, color: '#fbbf24' },
                ].map((s) => (
                    <div
                        key={s.label}
                        style={{
                            background: 'linear-gradient(135deg, #0d0d0d, #120000)',
                            border: '1px solid #2a0000',
                            borderRadius: '16px',
                            padding: '22px 16px',
                            textAlign: 'center',
                            transition: 'all 0.3s',
                            position: 'relative',
                            overflow: 'hidden',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.border = '1px solid #7f1d1d';
                            e.currentTarget.style.boxShadow = '0 0 24px rgba(220,38,38,0.08)';
                            e.currentTarget.style.transform = 'translateY(-2px)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.border = '1px solid #2a0000';
                            e.currentTarget.style.boxShadow = 'none';
                            e.currentTarget.style.transform = 'translateY(0)';
                        }}
                    >
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: '2px', background: `linear-gradient(to right, transparent, ${s.color}60, transparent)` }} />
                        <p style={{ fontSize: '24px', margin: '0 0 8px' }}>{s.icon}</p>
                        <p style={{ color: s.color, fontSize: '30px', fontWeight: '900', margin: '0 0 4px', lineHeight: 1 }}>{s.value}</p>
                        <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '1.5px', textTransform: 'uppercase', margin: 0 }}>{s.label}</p>
                    </div>
                ))}
            </div>

            {/* Deeds Breakdown */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '24px',
            }}>
                <div style={{
                    background: 'linear-gradient(135deg, #0a1a0a, #0f200f)',
                    border: '1px solid rgba(74,222,128,0.15)',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '28px', margin: '0 0 6px' }}>✅</p>
                    <p style={{ color: '#4ade80', fontSize: '34px', fontWeight: '900', margin: '0 0 4px', lineHeight: 1 }}>{stats.goodDeeds}</p>
                    <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Good Deeds</p>
                </div>
                <div style={{
                    background: 'linear-gradient(135deg, #0d0d0d, #120000)',
                    border: '1px solid rgba(220,38,38,0.15)',
                    borderRadius: '16px',
                    padding: '20px',
                    textAlign: 'center',
                }}>
                    <p style={{ fontSize: '28px', margin: '0 0 6px' }}>❌</p>
                    <p style={{ color: '#ef4444', fontSize: '34px', fontWeight: '900', margin: '0 0 4px', lineHeight: 1 }}>{stats.badDeeds}</p>
                    <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Bad Deeds</p>
                </div>
            </div>

            {/* Recent Deeds */}
            <div style={{
                background: 'linear-gradient(135deg, #0d0d0d, #120000)',
                border: '1px solid #2a0000',
                borderRadius: '20px',
                overflow: 'hidden',
            }}>
                {/* Section header */}
                <div style={{
                    padding: '22px 24px',
                    borderBottom: '1px solid #1f0000',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                }}>
                    <div>
                        <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 2px' }}>✦ History</p>
                        <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '700', margin: 0 }}>Recent Deeds</p>
                    </div>
                    <span style={{
                        backgroundColor: 'rgba(220,38,38,0.1)',
                        border: '1px solid rgba(220,38,38,0.2)',
                        color: '#fca5a5',
                        fontSize: '12px',
                        fontWeight: '600',
                        padding: '4px 12px',
                        borderRadius: '999px',
                    }}>
                        Last {stats.recentDeeds.length}
                    </span>
                </div>

                {/* Deeds list */}
                {stats.recentDeeds.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '48px 20px' }}>
                        <p style={{ fontSize: '36px', margin: '0 0 12px' }}>📿</p>
                        <p style={{ color: '#ffffff', fontSize: '16px', margin: '0 0 6px' }}>No deeds recorded yet</p>
                        <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Start tracking your good and bad deeds</p>
                    </div>
                ) : (
                    <div>
                        {stats.recentDeeds.map((item, i) => {
                            const isGood = item.points > 0;
                            return (
                                <div
                                    key={i}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '14px',
                                        padding: '16px 24px',
                                        borderBottom: i < stats.recentDeeds.length - 1 ? '1px solid #0f0000' : 'none',
                                        transition: 'background 0.2s',
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.03)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    <div style={{
                                        width: '34px', height: '34px', borderRadius: '50%', flexShrink: 0,
                                        backgroundColor: isGood ? 'rgba(74,222,128,0.1)' : 'rgba(220,38,38,0.1)',
                                        border: `1px solid ${isGood ? 'rgba(74,222,128,0.25)' : 'rgba(220,38,38,0.25)'}`,
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        color: isGood ? '#4ade80' : '#ef4444',
                                        fontWeight: '800', fontSize: '13px',
                                    }}>
                                        {isGood ? '✓' : '✗'}
                                    </div>
                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <p style={{ color: '#ffffff', fontSize: '14px', margin: '0 0 3px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                            {item.description}
                                        </p>
                                        <p style={{ color: '#6b7280', fontSize: '11px', margin: 0 }}>
                                            {dayjs(item.date).format('MMM D, YYYY')}
                                        </p>
                                    </div>
                                    <span style={{
                                        color: isGood ? '#4ade80' : '#ef4444',
                                        fontSize: '16px',
                                        fontWeight: '800',
                                        flexShrink: 0,
                                    }}>
                                        {item.points > 0 ? '+' : ''}{item.points}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
}