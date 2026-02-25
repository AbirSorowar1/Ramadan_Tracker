import React, { useState, useEffect } from 'react';
import { Calendar, Modal } from 'antd';
import { db, ref, onValue } from '../firebase';
import dayjs from 'dayjs';

const prayersList = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
const prayerIcons = { Fajr: '🌙', Dhuhr: '☀️', Asr: '🌤️', Maghrib: '🌅', Isha: '🌌' };

export default function CalendarPage({ user }) {
    const [daysData, setDaysData] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalData, setModalData] = useState({ prayers: {}, deeds: [], score: 0 });

    useEffect(() => {
        const daysRef = ref(db, `users/${user.uid}/days`);
        onValue(daysRef, (snap) => setDaysData(snap.val() || {}));
    }, [user.uid]);

    const cellRender = (value, info) => {
        if (info.type !== 'date') return info.originNode;
        const dateKey = value.format('YYYY-MM-DD');
        const day = daysData[dateKey];
        if (!day) return info.originNode;

        const prayerCount = Object.values(day.prayers || {}).filter(Boolean).length;
        const score = day.score || 0;
        const isToday = dateKey === dayjs().format('YYYY-MM-DD');

        return (
            <div style={{ position: 'relative' }}>
                {info.originNode}
                <div style={{ marginTop: '2px', display: 'flex', flexDirection: 'column', gap: '2px' }}>
                    {/* Prayer dots */}
                    <div style={{ display: 'flex', gap: '2px', justifyContent: 'center' }}>
                        {prayersList.map((p) => (
                            <div
                                key={p}
                                style={{
                                    width: '5px',
                                    height: '5px',
                                    borderRadius: '50%',
                                    backgroundColor: day.prayers?.[p] ? '#4ade80' : '#3f0000',
                                }}
                            />
                        ))}
                    </div>
                    {/* Score badge */}
                    <div style={{
                        fontSize: '9px',
                        fontWeight: '700',
                        color: score >= 0 ? '#4ade80' : '#ef4444',
                        textAlign: 'center',
                        lineHeight: 1,
                    }}>
                        {score >= 0 ? '+' : ''}{score}
                    </div>
                </div>
            </div>
        );
    };

    const onSelect = (value) => {
        const dateKey = value.format('YYYY-MM-DD');
        setSelectedDate(dateKey);
        const day = daysData[dateKey] || {};
        setModalData({
            prayers: day.prayers || {},
            deeds: Object.values(day.deeds || {}),
            score: day.score || 0,
            label: value.format('dddd, MMMM D, YYYY'),
        });
    };

    const prayerCount = Object.values(modalData.prayers).filter(Boolean).length;
    const goodDeeds = modalData.deeds.filter(d => d.points > 0);
    const badDeeds = modalData.deeds.filter(d => d.points <= 0);

    return (
        <div style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <p style={{ color: '#4b1c1c', fontSize: '22px', margin: '0 0 6px' }}>﷽</p>
                <h1 style={{ color: '#ffffff', fontSize: '34px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                    Ramadan <span style={{ color: '#dc2626' }}>Calendar</span>
                </h1>
                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>Track your daily ibadah throughout Ramadan</p>
            </div>

            {/* Legend */}
            <div style={{
                display: 'flex',
                gap: '20px',
                justifyContent: 'center',
                marginBottom: '20px',
                flexWrap: 'wrap',
            }}>
                {[
                    { color: '#4ade80', label: 'Prayer done' },
                    { color: '#3f0000', label: 'Prayer missed' },
                    { color: '#4ade80', label: 'Positive score' },
                    { color: '#ef4444', label: 'Negative score' },
                ].map((l) => (
                    <div key={l.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <div style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: l.color }} />
                        <span style={{ color: '#9ca3af', fontSize: '12px' }}>{l.label}</span>
                    </div>
                ))}
            </div>

            {/* Calendar */}
            <div style={{
                background: 'linear-gradient(135deg, #0d0d0d, #120000)',
                border: '1px solid #2a0000',
                borderRadius: '20px',
                padding: '4px',
                boxShadow: '0 0 60px rgba(220,38,38,0.06)',
                overflow: 'hidden',
            }}>
                <style>{`
                    .ramadan-cal .ant-picker-calendar {
                        background: transparent !important;
                    }
                    .ramadan-cal .ant-picker-calendar-header {
                        background: transparent !important;
                        border-bottom: 1px solid #2a0000 !important;
                        padding: 16px 20px !important;
                    }
                    .ramadan-cal .ant-picker-calendar-header .ant-select-selector {
                        background: #0a0a0a !important;
                        border-color: #7f1d1d !important;
                        color: #ffffff !important;
                        border-radius: 8px !important;
                    }
                    .ramadan-cal .ant-picker-calendar-header .ant-radio-button-wrapper {
                        background: #0a0a0a !important;
                        border-color: #2a0000 !important;
                        color: #9ca3af !important;
                    }
                    .ramadan-cal .ant-picker-calendar-header .ant-radio-button-wrapper-checked {
                        background: #7f1d1d !important;
                        border-color: #dc2626 !important;
                        color: #ffffff !important;
                    }
                    .ramadan-cal .ant-picker-panel {
                        background: transparent !important;
                    }
                    .ramadan-cal .ant-picker-content th {
                        color: #dc2626 !important;
                        font-weight: 700 !important;
                        font-size: 13px !important;
                        padding: 12px 0 !important;
                        background: transparent !important;
                    }
                    .ramadan-cal .ant-picker-cell {
                        padding: 4px !important;
                        color: #6b7280 !important;
                    }
                    .ramadan-cal .ant-picker-cell-in-view {
                        color: #ffffff !important;
                    }
                    .ramadan-cal .ant-picker-cell .ant-picker-cell-inner {
                        border-radius: 10px !important;
                        min-height: 54px !important;
                        background: transparent !important;
                        transition: all 0.2s !important;
                        padding: 6px 4px 4px !important;
                        display: flex !important;
                        flex-direction: column !important;
                        align-items: center !important;
                    }
                    .ramadan-cal .ant-picker-cell:hover .ant-picker-cell-inner {
                        background: rgba(220,38,38,0.1) !important;
                    }
                    .ramadan-cal .ant-picker-cell-selected .ant-picker-cell-inner,
                    .ramadan-cal .ant-picker-cell-in-view.ant-picker-cell-selected .ant-picker-cell-inner {
                        background: rgba(220,38,38,0.2) !important;
                        border: 1px solid #dc2626 !important;
                        box-shadow: 0 0 12px rgba(220,38,38,0.25) !important;
                    }
                    .ramadan-cal .ant-picker-cell-today .ant-picker-cell-inner::before {
                        border-color: #dc2626 !important;
                        border-radius: 10px !important;
                    }
                    .ramadan-cal .ant-picker-cell-inner .ant-picker-calendar-date-value {
                        color: inherit !important;
                        font-weight: 600 !important;
                        font-size: 13px !important;
                    }
                    .ramadan-cal .ant-picker-cell-inner .ant-picker-calendar-date-content {
                        height: auto !important;
                    }
                    .ramadan-cal .ant-select-arrow,
                    .ramadan-cal .ant-select-dropdown {
                        color: #ffffff !important;
                    }
                `}</style>
                <div className="ramadan-cal">
                    <Calendar
                        fullscreen={false}
                        cellRender={cellRender}
                        onSelect={onSelect}
                    />
                </div>
            </div>

            {/* Day Detail Modal */}
            <Modal
                title={null}
                open={!!selectedDate}
                onCancel={() => setSelectedDate(null)}
                footer={null}
                width={580}
                styles={{
                    body: { backgroundColor: '#050505', padding: '0' },
                    content: { backgroundColor: '#050505', borderRadius: '20px', border: '1px solid #2a0000', overflow: 'hidden', boxShadow: '0 0 80px rgba(220,38,38,0.12)' },
                    mask: { backdropFilter: 'blur(8px)', backgroundColor: 'rgba(0,0,0,0.85)' },
                }}
            >
                {/* Modal Header */}
                <div style={{
                    background: 'linear-gradient(135deg, #1a0000, #2d0000)',
                    borderBottom: '1px solid #2a0000',
                    padding: '28px 28px 22px',
                }}>
                    <p style={{ color: '#9ca3af', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 6px' }}>
                        Daily Summary
                    </p>
                    <h2 style={{ color: '#ffffff', fontSize: '22px', fontWeight: '800', margin: '0 0 16px' }}>
                        {modalData.label}
                    </h2>

                    {/* Quick stats row */}
                    <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        <div style={{
                            flex: 1,
                            minWidth: '100px',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            border: '1px solid #3f0000',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            textAlign: 'center',
                        }}>
                            <p style={{ color: '#dc2626', fontSize: '24px', fontWeight: '800', margin: 0, lineHeight: 1 }}>
                                {prayerCount}/5
                            </p>
                            <p style={{ color: '#9ca3af', fontSize: '11px', letterSpacing: '1px', margin: '4px 0 0', textTransform: 'uppercase' }}>Prayers</p>
                        </div>
                        <div style={{
                            flex: 1,
                            minWidth: '100px',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            border: `1px solid ${modalData.score >= 0 ? 'rgba(74,222,128,0.2)' : '#3f0000'}`,
                            borderRadius: '12px',
                            padding: '12px 16px',
                            textAlign: 'center',
                        }}>
                            <p style={{ color: modalData.score >= 0 ? '#4ade80' : '#ef4444', fontSize: '24px', fontWeight: '800', margin: 0, lineHeight: 1 }}>
                                {modalData.score >= 0 ? '+' : ''}{modalData.score}
                            </p>
                            <p style={{ color: '#9ca3af', fontSize: '11px', letterSpacing: '1px', margin: '4px 0 0', textTransform: 'uppercase' }}>Score</p>
                        </div>
                        <div style={{
                            flex: 1,
                            minWidth: '100px',
                            backgroundColor: 'rgba(0,0,0,0.4)',
                            border: '1px solid #3f0000',
                            borderRadius: '12px',
                            padding: '12px 16px',
                            textAlign: 'center',
                        }}>
                            <p style={{ color: '#ffffff', fontSize: '24px', fontWeight: '800', margin: 0, lineHeight: 1 }}>
                                {modalData.deeds.length}
                            </p>
                            <p style={{ color: '#9ca3af', fontSize: '11px', letterSpacing: '1px', margin: '4px 0 0', textTransform: 'uppercase' }}>Deeds</p>
                        </div>
                    </div>
                </div>

                {/* Modal Body */}
                <div style={{ padding: '24px 28px', maxHeight: '420px', overflowY: 'auto' }}>

                    {/* Prayers Section */}
                    <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                        ✦ Prayers
                    </p>
                    {prayersList.length > 0 ? (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
                            {prayersList.map((prayer) => {
                                const done = !!modalData.prayers[prayer];
                                return (
                                    <div key={prayer} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        backgroundColor: done ? 'rgba(74,222,128,0.06)' : 'rgba(220,38,38,0.04)',
                                        border: done ? '1px solid rgba(74,222,128,0.15)' : '1px solid #1f0000',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                            <span style={{ fontSize: '16px' }}>{prayerIcons[prayer]}</span>
                                            <span style={{ color: '#ffffff', fontSize: '15px', fontWeight: '500' }}>{prayer}</span>
                                        </div>
                                        <span style={{
                                            color: done ? '#4ade80' : '#ef4444',
                                            fontSize: '12px',
                                            fontWeight: '700',
                                            backgroundColor: done ? 'rgba(74,222,128,0.1)' : 'rgba(220,38,38,0.1)',
                                            padding: '3px 10px',
                                            borderRadius: '999px',
                                        }}>
                                            {done ? '✓ Done' : '✗ Missed'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p style={{ color: '#6b7280', marginBottom: '24px' }}>No prayer data</p>
                    )}

                    {/* Deeds Section */}
                    <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '12px' }}>
                        ✦ Deeds
                    </p>
                    {modalData.deeds.length === 0 ? (
                        <div style={{ textAlign: 'center', padding: '24px', color: '#6b7280', fontSize: '14px' }}>
                            📿 No deeds recorded this day
                        </div>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            {modalData.deeds.map((item, i) => {
                                const isGood = item.points > 0;
                                return (
                                    <div key={i} style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '12px 16px',
                                        borderRadius: '12px',
                                        backgroundColor: isGood ? 'rgba(74,222,128,0.06)' : 'rgba(220,38,38,0.04)',
                                        border: isGood ? '1px solid rgba(74,222,128,0.15)' : '1px solid #1f0000',
                                        gap: '12px',
                                    }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                                            <span style={{
                                                color: isGood ? '#4ade80' : '#ef4444',
                                                fontSize: '14px',
                                                fontWeight: '800',
                                                flexShrink: 0,
                                            }}>
                                                {isGood ? '✓' : '✗'}
                                            </span>
                                            <span style={{
                                                color: '#ffffff',
                                                fontSize: '14px',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                whiteSpace: 'nowrap',
                                            }}>
                                                {item.description}
                                            </span>
                                        </div>
                                        <span style={{
                                            color: isGood ? '#4ade80' : '#ef4444',
                                            fontSize: '15px',
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

                {/* Modal Footer */}
                <div style={{ padding: '16px 28px 24px', borderTop: '1px solid #1f0000', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                        onClick={() => setSelectedDate(null)}
                        style={{
                            backgroundColor: '#b91c1c',
                            border: 'none',
                            color: '#ffffff',
                            padding: '11px 30px',
                            fontSize: '14px',
                            fontWeight: '600',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                            e.currentTarget.style.boxShadow = '0 0 18px rgba(220,38,38,0.3)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Close
                    </button>
                </div>
            </Modal>
        </div>
    );
}