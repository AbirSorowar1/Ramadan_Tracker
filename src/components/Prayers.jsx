import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { CheckOutlined, RollbackOutlined } from '@ant-design/icons';
import { db, ref, onValue, set } from '../firebase';
import dayjs from 'dayjs';

const prayersList = [
    { name: 'Fajr', arabic: 'الفجر', time: 'Pre-Dawn', icon: '🌙' },
    { name: 'Dhuhr', arabic: 'الظهر', time: 'Midday', icon: '☀️' },
    { name: 'Asr', arabic: 'العصر', time: 'Afternoon', icon: '🌤️' },
    { name: 'Maghrib', arabic: 'المغرب', time: 'Sunset', icon: '🌅' },
    { name: 'Isha', arabic: 'العشاء', time: 'Night', icon: '🌌' },
];

const PRAYER_POINTS = 10;

export default function Prayers({ user }) {
    const [todayPrayers, setTodayPrayers] = useState({});
    const [totalPrayers, setTotalPrayers] = useState(0);
    const [todayScore, setTodayScore] = useState(0);
    const [ramadanScore, setRamadanScore] = useState(0);

    const today = dayjs().format('YYYY-MM-DD');
    const todayLabel = dayjs().format('dddd, MMMM D');

    useEffect(() => {
        const prayersRef = ref(db, `users/${user.uid}/days/${today}/prayers`);
        onValue(prayersRef, (snap) => {
            const data = snap.val() || {};
            setTodayPrayers(data);
            setTodayScore(Object.values(data).filter(Boolean).length * PRAYER_POINTS);
        });

        const totalPrayersRef = ref(db, `users/${user.uid}/ramadanTotals/prayers`);
        onValue(totalPrayersRef, (snap) => setTotalPrayers(snap.val() || 0));

        const totalScoreRef = ref(db, `users/${user.uid}/ramadanTotals/score`);
        onValue(totalScoreRef, (snap) => setRamadanScore(snap.val() || 0));
    }, [user.uid, today]);

    const markAsDone = (prayerName) => {
        if (todayPrayers[prayerName]) return;
        const updated = { ...todayPrayers, [prayerName]: true };
        set(ref(db, `users/${user.uid}/days/${today}/prayers`), updated);
        set(ref(db, `users/${user.uid}/ramadanTotals/prayers`), totalPrayers + 1);
        const newTodayScore = todayScore + PRAYER_POINTS;
        set(ref(db, `users/${user.uid}/days/${today}/score`), newTodayScore);
        set(ref(db, `users/${user.uid}/ramadanTotals/score`), ramadanScore + PRAYER_POINTS);
        message.success(`${prayerName} marked as done (+${PRAYER_POINTS} pts)`);
    };

    const markUndone = (prayerName) => {
        const updated = { ...todayPrayers };
        delete updated[prayerName];
        set(ref(db, `users/${user.uid}/days/${today}/prayers`), updated);
        set(ref(db, `users/${user.uid}/ramadanTotals/prayers`), totalPrayers - 1);
        const newTodayScore = todayScore - PRAYER_POINTS;
        set(ref(db, `users/${user.uid}/days/${today}/score`), newTodayScore);
        set(ref(db, `users/${user.uid}/ramadanTotals/score`), ramadanScore - PRAYER_POINTS);
        message.info(`${prayerName} unmarked`);
    };

    const doneCount = Object.values(todayPrayers).filter(Boolean).length;
    const progressPercent = Math.round((doneCount / prayersList.length) * 100);

    return (
        <div style={{ maxWidth: '860px', margin: '0 auto', padding: '32px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <p style={{ color: '#4b1c1c', fontSize: '22px', margin: '0 0 6px' }}>﷽</p>
                <h1 style={{ color: '#ffffff', fontSize: '36px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                    Today's <span style={{ color: '#dc2626' }}>Salat</span>
                </h1>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>{todayLabel}</p>

                {/* Progress Bar */}
                <div style={{ marginTop: '24px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                        <span style={{ color: '#9ca3af', fontSize: '13px' }}>Daily Progress</span>
                        <span style={{ color: '#dc2626', fontSize: '13px', fontWeight: '700' }}>
                            {doneCount} / {prayersList.length} prayers
                        </span>
                    </div>
                    <div style={{
                        height: '8px',
                        backgroundColor: '#1a0000',
                        borderRadius: '999px',
                        overflow: 'hidden',
                        border: '1px solid #2a0000',
                    }}>
                        <div style={{
                            height: '100%',
                            width: `${progressPercent}%`,
                            background: 'linear-gradient(to right, #7f1d1d, #dc2626)',
                            borderRadius: '999px',
                            transition: 'width 0.5s ease',
                            boxShadow: progressPercent > 0 ? '0 0 12px rgba(220,38,38,0.5)' : 'none',
                        }} />
                    </div>
                    {doneCount === 5 && (
                        <p style={{ color: '#fca5a5', fontSize: '13px', marginTop: '8px', letterSpacing: '1px' }}>
                            ✦ All prayers complete! MashAllah 🤲
                        </p>
                    )}
                </div>
            </div>

            {/* Prayer Cards */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '40px' }}>
                {prayersList.map((prayer, index) => {
                    const isDone = !!todayPrayers[prayer.name];
                    return (
                        <div
                            key={prayer.name}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                gap: '16px',
                                padding: '20px 24px',
                                borderRadius: '16px',
                                background: isDone
                                    ? 'linear-gradient(135deg, #1a0000 0%, #2d0000 100%)'
                                    : 'linear-gradient(135deg, #0d0d0d 0%, #0f0000 100%)',
                                border: isDone ? '1px solid rgba(220,38,38,0.4)' : '1px solid #1f0000',
                                boxShadow: isDone ? '0 0 24px rgba(220,38,38,0.08)' : 'none',
                                transition: 'all 0.3s ease',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                        >
                            {/* Glow accent */}
                            {isDone && (
                                <div style={{
                                    position: 'absolute',
                                    top: 0, left: 0, right: 0,
                                    height: '2px',
                                    background: 'linear-gradient(to right, transparent, #dc2626, transparent)',
                                }} />
                            )}

                            {/* Left: icon + name */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                                {/* Number */}
                                <div style={{
                                    width: '32px',
                                    height: '32px',
                                    borderRadius: '50%',
                                    backgroundColor: isDone ? '#7f1d1d' : '#1f0000',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '12px',
                                    color: isDone ? '#fca5a5' : '#6b7280',
                                    fontWeight: '700',
                                    flexShrink: 0,
                                    border: isDone ? '1px solid #dc2626' : '1px solid #2a0000',
                                }}>
                                    {index + 1}
                                </div>

                                <div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                        <span style={{ fontSize: '20px' }}>{prayer.icon}</span>
                                        <span style={{
                                            color: '#ffffff',
                                            fontSize: '18px',
                                            fontWeight: '700',
                                            letterSpacing: '-0.2px',
                                        }}>
                                            {prayer.name}
                                        </span>
                                        <span style={{
                                            color: '#7f1d1d',
                                            fontSize: '14px',
                                            fontFamily: 'serif',
                                        }}>
                                            {prayer.arabic}
                                        </span>
                                    </div>
                                    <p style={{ color: '#6b7280', fontSize: '12px', margin: '2px 0 0', letterSpacing: '0.5px' }}>
                                        {prayer.time}
                                    </p>
                                </div>
                            </div>

                            {/* Right: action */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                                {isDone ? (
                                    <>
                                        <span style={{
                                            color: '#4ade80',
                                            fontSize: '12px',
                                            fontWeight: '600',
                                            backgroundColor: 'rgba(74,222,128,0.08)',
                                            border: '1px solid rgba(74,222,128,0.2)',
                                            padding: '4px 12px',
                                            borderRadius: '999px',
                                            letterSpacing: '0.5px',
                                        }}>
                                            ✓ +{PRAYER_POINTS} pts
                                        </span>
                                        <button
                                            onClick={() => markUndone(prayer.name)}
                                            style={{
                                                background: 'rgba(220,38,38,0.08)',
                                                border: '1px solid #7f1d1d',
                                                color: '#ef4444',
                                                padding: '7px 14px',
                                                borderRadius: '10px',
                                                cursor: 'pointer',
                                                fontSize: '12px',
                                                fontWeight: '500',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '5px',
                                                transition: 'all 0.2s',
                                                fontFamily: 'inherit',
                                            }}
                                            onMouseEnter={e => {
                                                e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.18)';
                                                e.currentTarget.style.borderColor = '#dc2626';
                                            }}
                                            onMouseLeave={e => {
                                                e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.08)';
                                                e.currentTarget.style.borderColor = '#7f1d1d';
                                            }}
                                        >
                                            <RollbackOutlined /> Undo
                                        </button>
                                    </>
                                ) : (
                                    <button
                                        onClick={() => markAsDone(prayer.name)}
                                        style={{
                                            background: 'linear-gradient(135deg, #991b1b, #b91c1c)',
                                            border: 'none',
                                            color: '#ffffff',
                                            padding: '10px 22px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            fontSize: '13px',
                                            fontWeight: '600',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '6px',
                                            transition: 'all 0.2s',
                                            letterSpacing: '0.3px',
                                            fontFamily: 'inherit',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #b91c1c, #dc2626)';
                                            e.currentTarget.style.boxShadow = '0 0 18px rgba(220,38,38,0.35)';
                                            e.currentTarget.style.transform = 'translateY(-1px)';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'linear-gradient(135deg, #991b1b, #b91c1c)';
                                            e.currentTarget.style.boxShadow = 'none';
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <CheckOutlined /> Mark Done
                                    </button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {/* Stats Section */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                gap: '16px',
            }}>
                {[
                    { label: "Today's Score", value: todayScore, suffix: 'pts', icon: '🎯' },
                    { label: 'Total Prayers', value: totalPrayers, suffix: 'salat', icon: '🕌' },
                    { label: 'Ramadan Score', value: ramadanScore, suffix: 'pts', icon: '⭐' },
                ].map((stat) => (
                    <div
                        key={stat.label}
                        style={{
                            background: 'linear-gradient(135deg, #0d0d0d, #120000)',
                            border: '1px solid #2a0000',
                            borderRadius: '16px',
                            padding: '24px',
                            textAlign: 'center',
                            transition: 'all 0.3s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.border = '1px solid #7f1d1d';
                            e.currentTarget.style.boxShadow = '0 0 24px rgba(220,38,38,0.08)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.border = '1px solid #2a0000';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        <p style={{ fontSize: '28px', margin: '0 0 8px' }}>{stat.icon}</p>
                        <p style={{
                            color: '#dc2626',
                            fontSize: '34px',
                            fontWeight: '800',
                            margin: '0 0 4px',
                            lineHeight: 1,
                        }}>
                            {stat.value}
                        </p>
                        <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '1px', textTransform: 'uppercase', margin: '4px 0 0' }}>
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
}