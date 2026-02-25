import React, { useState, useEffect } from 'react';
import { message, Modal, Select } from 'antd';
import { db, ref, onValue, push, set, remove } from '../firebase';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined, PlusOutlined, CheckOutlined } from '@ant-design/icons';

export default function Deeds({ user }) {
    const [deeds, setDeeds] = useState([]);
    const [dailyScore, setDailyScore] = useState(0);
    const [editingDeed, setEditingDeed] = useState(null);

    // Add form state
    const [desc, setDesc] = useState('');
    const [points, setPoints] = useState('');
    const [type, setType] = useState('good');

    // Edit form state
    const [editDesc, setEditDesc] = useState('');
    const [editPoints, setEditPoints] = useState('');
    const [editType, setEditType] = useState('good');

    const today = dayjs().format('YYYY-MM-DD');
    const todayLabel = dayjs().format('dddd, MMMM D');

    useEffect(() => {
        const deedsRef = ref(db, `users/${user.uid}/days/${today}/deeds`);
        onValue(deedsRef, (snap) => {
            const data = snap.val() || {};
            const list = Object.entries(data).map(([id, item]) => ({ id, ...item }));
            list.sort((a, b) => b.createdAt - a.createdAt);
            setDeeds(list);
            const score = list.reduce((sum, item) => sum + (item.points || 0), 0);
            setDailyScore(score);
            set(ref(db, `users/${user.uid}/days/${today}/score`), score);
            set(ref(db, `users/${user.uid}/ramadanTotals/score`), score);
        });
    }, [user.uid, today]);

    const handleAdd = () => {
        if (!desc.trim()) return message.warning('Please enter a description');
        if (!points || isNaN(points)) return message.warning('Please enter valid points');
        const finalPoints = type === 'good' ? Math.abs(Number(points)) : -Math.abs(Number(points));
        push(ref(db, `users/${user.uid}/days/${today}/deeds`), {
            description: desc.trim(),
            points: finalPoints,
            type,
            createdAt: Date.now(),
        });
        setDesc('');
        setPoints('');
        setType('good');
        message.success('Deed added!');
    };

    const openEdit = (deed) => {
        setEditingDeed(deed);
        setEditDesc(deed.description);
        setEditPoints(Math.abs(deed.points));
        setEditType(deed.type);
    };

    const handleEditSave = () => {
        if (!editDesc.trim()) return message.warning('Description required');
        if (!editPoints || isNaN(editPoints)) return message.warning('Enter valid points');
        const finalPoints = editType === 'good' ? Math.abs(Number(editPoints)) : -Math.abs(Number(editPoints));
        set(ref(db, `users/${user.uid}/days/${today}/deeds/${editingDeed.id}`), {
            description: editDesc.trim(),
            points: finalPoints,
            type: editType,
            createdAt: editingDeed.createdAt,
        });
        setEditingDeed(null);
        message.success('Deed updated!');
    };

    const handleDelete = (id) => {
        remove(ref(db, `users/${user.uid}/days/${today}/deeds/${id}`));
        message.success('Deed deleted');
    };

    const goodDeeds = deeds.filter(d => d.points > 0);
    const badDeeds = deeds.filter(d => d.points <= 0);

    const inputStyle = {
        backgroundColor: '#0a0a0a',
        border: '1.5px solid #2a0000',
        color: '#ffffff',
        fontSize: '15px',
        padding: '12px 16px',
        borderRadius: '10px',
        outline: 'none',
        width: '100%',
        fontFamily: 'inherit',
        transition: 'border 0.3s, box-shadow 0.3s',
        boxSizing: 'border-box',
    };

    const TypeBtn = ({ value, current, onChange, label, color }) => (
        <button
            onClick={() => onChange(value)}
            style={{
                flex: 1,
                padding: '11px',
                borderRadius: '10px',
                border: current === value ? `1.5px solid ${color}` : '1.5px solid #2a0000',
                backgroundColor: current === value
                    ? (value === 'good' ? 'rgba(74,222,128,0.1)' : 'rgba(220,38,38,0.1)')
                    : 'transparent',
                color: current === value ? color : '#6b7280',
                fontWeight: '600',
                fontSize: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
            }}
        >
            {label}
        </button>
    );

    return (
        <div style={{ maxWidth: '820px', margin: '0 auto', padding: '32px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '36px' }}>
                <p style={{ color: '#4b1c1c', fontSize: '22px', margin: '0 0 6px' }}>﷽</p>
                <h1 style={{ color: '#ffffff', fontSize: '34px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                    Good & <span style={{ color: '#dc2626' }}>Bad Deeds</span>
                </h1>
                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>{todayLabel}</p>
            </div>

            {/* Score Banner */}
            <div style={{
                background: dailyScore >= 0
                    ? 'linear-gradient(135deg, #0a1f0a, #0f2d0f)'
                    : 'linear-gradient(135deg, #1a0000, #2d0000)',
                border: `1px solid ${dailyScore >= 0 ? 'rgba(74,222,128,0.25)' : 'rgba(220,38,38,0.3)'}`,
                borderRadius: '16px',
                padding: '20px 28px',
                marginBottom: '32px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '12px',
                boxShadow: dailyScore >= 0
                    ? '0 0 30px rgba(74,222,128,0.05)'
                    : '0 0 30px rgba(220,38,38,0.06)',
            }}>
                <div>
                    <p style={{ color: '#9ca3af', fontSize: '12px', letterSpacing: '2px', textTransform: 'uppercase', margin: '0 0 4px' }}>
                        Today's Balance
                    </p>
                    <p style={{
                        fontSize: '40px',
                        fontWeight: '800',
                        margin: 0,
                        color: dailyScore >= 0 ? '#4ade80' : '#ef4444',
                        lineHeight: 1,
                    }}>
                        {dailyScore >= 0 ? '+' : ''}{dailyScore}
                        <span style={{ fontSize: '16px', fontWeight: '400', marginLeft: '6px', color: '#6b7280' }}>pts</span>
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '20px', textAlign: 'center' }}>
                    <div>
                        <p style={{ color: '#4ade80', fontSize: '22px', fontWeight: '800', margin: 0 }}>{goodDeeds.length}</p>
                        <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '1px', margin: '2px 0 0' }}>GOOD</p>
                    </div>
                    <div style={{ width: '1px', backgroundColor: '#2a0000' }} />
                    <div>
                        <p style={{ color: '#ef4444', fontSize: '22px', fontWeight: '800', margin: 0 }}>{badDeeds.length}</p>
                        <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '1px', margin: '2px 0 0' }}>BAD</p>
                    </div>
                </div>
            </div>

            {/* Add Deed Form */}
            <div style={{
                background: 'linear-gradient(135deg, #0f0f0f, #140000)',
                border: '1px solid #2a0000',
                borderRadius: '20px',
                padding: '28px',
                marginBottom: '36px',
                boxShadow: '0 0 40px rgba(220,38,38,0.04)',
            }}>
                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '18px' }}>
                    ✦ Record a Deed
                </p>

                <input
                    value={desc}
                    onChange={e => setDesc(e.target.value)}
                    placeholder="What did you do today?"
                    style={{ ...inputStyle, marginBottom: '14px' }}
                    onFocus={e => { e.target.style.border = '1.5px solid #dc2626'; e.target.style.boxShadow = '0 0 16px rgba(220,38,38,0.12)'; }}
                    onBlur={e => { e.target.style.border = '1.5px solid #2a0000'; e.target.style.boxShadow = 'none'; }}
                />

                <div style={{ display: 'flex', gap: '12px', marginBottom: '14px', flexWrap: 'wrap' }}>
                    <input
                        value={points}
                        onChange={e => setPoints(e.target.value)}
                        type="number"
                        placeholder="Points (e.g. 10)"
                        style={{ ...inputStyle, flex: 1, minWidth: '120px' }}
                        onFocus={e => { e.target.style.border = '1.5px solid #dc2626'; e.target.style.boxShadow = '0 0 16px rgba(220,38,38,0.12)'; }}
                        onBlur={e => { e.target.style.border = '1.5px solid #2a0000'; e.target.style.boxShadow = 'none'; }}
                    />
                    <div style={{ display: 'flex', gap: '8px', flex: 1, minWidth: '180px' }}>
                        <TypeBtn value="good" current={type} onChange={setType} label="✓ Good" color="#4ade80" />
                        <TypeBtn value="bad" current={type} onChange={setType} label="✗ Bad" color="#ef4444" />
                    </div>
                </div>

                <button
                    onClick={handleAdd}
                    style={{
                        width: '100%',
                        background: 'linear-gradient(135deg, #991b1b, #b91c1c)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '13px',
                        borderRadius: '12px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
                        letterSpacing: '0.3px',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #b91c1c, #dc2626)';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(220,38,38,0.3)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.background = 'linear-gradient(135deg, #991b1b, #b91c1c)';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <PlusOutlined /> Add Deed
                </button>
            </div>

            {/* Deeds List */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #2a0000, transparent)' }} />
                <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
                    Today's Deeds
                </p>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, #2a0000, transparent)' }} />
            </div>

            {deeds.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px' }}>
                    <p style={{ fontSize: '36px', margin: '0 0 12px' }}>📿</p>
                    <p style={{ color: '#ffffff', fontSize: '17px', fontWeight: '500', margin: 0 }}>No deeds recorded yet</p>
                    <p style={{ color: '#6b7280', fontSize: '13px', marginTop: '6px' }}>Start tracking your good and bad deeds above</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {deeds.map((item) => {
                        const isGood = item.points > 0;
                        return (
                            <div
                                key={item.id}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '14px',
                                    padding: '16px 20px',
                                    borderRadius: '14px',
                                    background: isGood
                                        ? 'linear-gradient(135deg, #0a1a0a, #0f200f)'
                                        : 'linear-gradient(135deg, #0d0d0d, #120000)',
                                    border: isGood ? '1px solid rgba(74,222,128,0.15)' : '1px solid #1f0000',
                                    transition: 'all 0.25s',
                                    position: 'relative',
                                    overflow: 'hidden',
                                }}
                                onMouseEnter={e => {
                                    e.currentTarget.style.border = isGood ? '1px solid rgba(74,222,128,0.3)' : '1px solid #7f1d1d';
                                    e.currentTarget.style.boxShadow = isGood ? '0 0 20px rgba(74,222,128,0.05)' : '0 0 20px rgba(220,38,38,0.06)';
                                }}
                                onMouseLeave={e => {
                                    e.currentTarget.style.border = isGood ? '1px solid rgba(74,222,128,0.15)' : '1px solid #1f0000';
                                    e.currentTarget.style.boxShadow = 'none';
                                }}
                            >
                                {/* Type indicator */}
                                <div style={{
                                    width: '36px',
                                    height: '36px',
                                    borderRadius: '50%',
                                    backgroundColor: isGood ? 'rgba(74,222,128,0.1)' : 'rgba(220,38,38,0.1)',
                                    border: `1px solid ${isGood ? 'rgba(74,222,128,0.3)' : 'rgba(220,38,38,0.3)'}`,
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '14px',
                                    flexShrink: 0,
                                    color: isGood ? '#4ade80' : '#ef4444',
                                    fontWeight: '800',
                                }}>
                                    {isGood ? '✓' : '✗'}
                                </div>

                                {/* Description */}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <p style={{
                                        color: '#ffffff',
                                        fontSize: '15px',
                                        margin: 0,
                                        fontWeight: '500',
                                        overflow: 'hidden',
                                        textOverflow: 'ellipsis',
                                        whiteSpace: 'nowrap',
                                    }}>
                                        {item.description}
                                    </p>
                                    <p style={{ color: '#6b7280', fontSize: '11px', margin: '3px 0 0' }}>
                                        {dayjs(item.createdAt).format('h:mm A')}
                                    </p>
                                </div>

                                {/* Points badge */}
                                <span style={{
                                    color: isGood ? '#4ade80' : '#ef4444',
                                    fontSize: '16px',
                                    fontWeight: '800',
                                    flexShrink: 0,
                                    minWidth: '50px',
                                    textAlign: 'right',
                                }}>
                                    {item.points > 0 ? '+' : ''}{item.points}
                                </span>

                                {/* Action buttons */}
                                <div style={{ display: 'flex', gap: '6px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => openEdit(item)}
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid #374151',
                                            color: '#ffffff',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '13px',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                                    >
                                        <EditOutlined />
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        style={{
                                            background: 'rgba(220,38,38,0.08)',
                                            border: '1px solid #7f1d1d',
                                            color: '#ef4444',
                                            width: '32px',
                                            height: '32px',
                                            borderRadius: '8px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '13px',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.2)'; }}
                                        onMouseLeave={e => { e.currentTarget.style.background = 'rgba(220,38,38,0.08)'; }}
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Modal */}
            <Modal
                title={
                    <div style={{ paddingBottom: '14px', borderBottom: '1px solid #2a0000' }}>
                        <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px' }}>Edit</p>
                        <span style={{ color: '#ffffff', fontSize: '19px', fontWeight: '700' }}>Update Deed</span>
                    </div>
                }
                open={!!editingDeed}
                onCancel={() => setEditingDeed(null)}
                footer={null}
                styles={{
                    body: { backgroundColor: '#050505', padding: '24px' },
                    header: { backgroundColor: '#050505', borderBottom: 'none', padding: '24px 24px 0' },
                    content: { backgroundColor: '#050505', borderRadius: '20px', border: '1px solid #2a0000', boxShadow: '0 0 60px rgba(220,38,38,0.1)' },
                    mask: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.8)' },
                }}
            >
                <input
                    value={editDesc}
                    onChange={e => setEditDesc(e.target.value)}
                    placeholder="Description"
                    style={{ ...inputStyle, marginBottom: '12px' }}
                    onFocus={e => { e.target.style.border = '1.5px solid #dc2626'; e.target.style.boxShadow = '0 0 16px rgba(220,38,38,0.12)'; }}
                    onBlur={e => { e.target.style.border = '1.5px solid #2a0000'; e.target.style.boxShadow = 'none'; }}
                />
                <input
                    value={editPoints}
                    onChange={e => setEditPoints(e.target.value)}
                    type="number"
                    placeholder="Points"
                    style={{ ...inputStyle, marginBottom: '12px' }}
                    onFocus={e => { e.target.style.border = '1.5px solid #dc2626'; e.target.style.boxShadow = '0 0 16px rgba(220,38,38,0.12)'; }}
                    onBlur={e => { e.target.style.border = '1.5px solid #2a0000'; e.target.style.boxShadow = 'none'; }}
                />
                <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
                    <TypeBtn value="good" current={editType} onChange={setEditType} label="✓ Good" color="#4ade80" />
                    <TypeBtn value="bad" current={editType} onChange={setEditType} label="✗ Bad" color="#ef4444" />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        onClick={() => setEditingDeed(null)}
                        style={{
                            flex: 1,
                            backgroundColor: 'transparent',
                            border: '1.5px solid #7f1d1d',
                            color: '#ffffff',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '500',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.08)'; e.currentTarget.style.borderColor = '#dc2626'; }}
                        onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; e.currentTarget.style.borderColor = '#7f1d1d'; }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleEditSave}
                        style={{
                            flex: 1,
                            background: 'linear-gradient(135deg, #991b1b, #b91c1c)',
                            border: 'none',
                            color: '#ffffff',
                            padding: '12px',
                            fontSize: '14px',
                            fontWeight: '600',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            fontFamily: 'inherit',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #b91c1c, #dc2626)'; e.currentTarget.style.boxShadow = '0 0 18px rgba(220,38,38,0.3)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'linear-gradient(135deg, #991b1b, #b91c1c)'; e.currentTarget.style.boxShadow = 'none'; }}
                    >
                        Save Changes
                    </button>
                </div>
            </Modal>
        </div>
    );
}