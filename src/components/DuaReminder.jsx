import React, { useState, useEffect } from 'react';
import { Input, List, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { db, ref, push, onValue, remove, set } from '../firebase';
import dayjs from 'dayjs';

const { TextArea } = Input;

export default function DuaReminder({ user }) {
    const [duas, setDuas] = useState([]);
    const [newDua, setNewDua] = useState('');
    const [editing, setEditing] = useState(null);
    const [editText, setEditText] = useState('');

    useEffect(() => {
        const duaRef = ref(db, `users/${user.uid}/duas`);
        onValue(duaRef, (snap) => {
            const data = snap.val() || {};
            const list = Object.entries(data).map(([id, val]) => ({ id, ...val }));
            setDuas(list.sort((a, b) => b.createdAt - a.createdAt));
        });
    }, [user.uid]);

    const addDua = () => {
        if (!newDua.trim()) return message.warning('Please write a dua');
        push(ref(db, `users/${user.uid}/duas`), {
            text: newDua.trim(),
            createdAt: Date.now(),
        });
        setNewDua('');
        message.success('Dua added successfully');
    };

    const startEdit = (item) => {
        setEditing(item);
        setEditText(item.text);
    };

    const saveEdit = () => {
        if (!editText.trim()) return message.warning('Dua cannot be empty');
        set(ref(db, `users/${user.uid}/duas/${editing.id}`), {
            text: editText.trim(),
            createdAt: editing.createdAt,
        });
        setEditing(null);
        message.success('Dua updated successfully');
    };

    const deleteDua = (id) => {
        remove(ref(db, `users/${user.uid}/duas/${id}`));
        message.success('Dua deleted');
    };

    const inputStyle = {
        backgroundColor: '#0a0a0a',
        border: '1.5px solid #7f1d1d',
        color: '#ffffff',
        fontSize: '16px',
        padding: '14px 18px',
        borderRadius: '12px',
        outline: 'none',
        width: '100%',
        resize: 'none',
        fontFamily: 'inherit',
        lineHeight: '1.7',
        boxShadow: '0 0 0px transparent',
        transition: 'border 0.3s, box-shadow 0.3s',
        boxSizing: 'border-box',
    };

    return (
        <div style={{
            maxWidth: '780px',
            margin: '0 auto',
            minHeight: '100vh',
            backgroundColor: '#000000',
            padding: '40px 24px',
            fontFamily: "'Segoe UI', sans-serif",
        }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '48px' }}>
                <p style={{ color: '#9ca3af', fontSize: '22px', letterSpacing: '4px', marginBottom: '10px' }}>
                    ﷽
                </p>
                <h1 style={{
                    fontSize: '38px',
                    fontWeight: '800',
                    color: '#ffffff',
                    margin: '0 0 8px 0',
                    letterSpacing: '-0.5px',
                }}>
                    Dua & <span style={{ color: '#dc2626' }}>Reminders</span>
                </h1>
                <div style={{ width: '60px', height: '3px', background: 'linear-gradient(to right, #7f1d1d, #dc2626)', margin: '12px auto 0', borderRadius: '999px' }} />
                <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '14px' }}>
                    Write your personal supplications & keep them close
                </p>
            </div>

            {/* Input Area */}
            <div style={{
                background: 'linear-gradient(135deg, #0f0f0f 0%, #1a0000 100%)',
                border: '1px solid #3f0000',
                borderRadius: '20px',
                padding: '28px',
                marginBottom: '40px',
                boxShadow: '0 0 40px rgba(220,38,38,0.05)',
            }}>
                <p style={{ color: '#ef4444', fontSize: '13px', fontWeight: '600', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '14px' }}>
                    ✦ New Dua
                </p>
                <textarea
                    value={newDua}
                    onChange={(e) => setNewDua(e.target.value)}
                    placeholder="Write your dua here... (for forgiveness, protection, Jannah...)"
                    rows={4}
                    style={inputStyle}
                    onFocus={e => {
                        e.target.style.border = '1.5px solid #dc2626';
                        e.target.style.boxShadow = '0 0 20px rgba(220,38,38,0.15)';
                    }}
                    onBlur={e => {
                        e.target.style.border = '1.5px solid #7f1d1d';
                        e.target.style.boxShadow = '0 0 0px transparent';
                    }}
                />
                <button
                    onClick={addDua}
                    style={{
                        marginTop: '16px',
                        backgroundColor: '#b91c1c',
                        color: '#ffffff',
                        border: 'none',
                        padding: '13px 32px',
                        fontSize: '15px',
                        fontWeight: '600',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        letterSpacing: '0.5px',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = '#dc2626';
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(220,38,38,0.35)';
                        e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = '#b91c1c';
                        e.currentTarget.style.boxShadow = 'none';
                        e.currentTarget.style.transform = 'translateY(0)';
                    }}
                >
                    <PlusOutlined /> Add Dua
                </button>
            </div>

            {/* Section Divider */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '24px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #3f0000, transparent)' }} />
                <p style={{ color: '#ef4444', fontSize: '12px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
                    Your Duas
                </p>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, #3f0000, transparent)' }} />
            </div>

            {/* Dua List */}
            {duas.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '80px 20px' }}>
                    <p style={{ fontSize: '40px', marginBottom: '16px' }}>🤲</p>
                    <p style={{ color: '#ffffff', fontSize: '18px', fontWeight: '500' }}>No duas added yet</p>
                    <p style={{ color: '#6b7280', fontSize: '14px', marginTop: '6px' }}>Start writing your personal supplications above</p>
                </div>
            ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    {duas.map((item, index) => (
                        <div
                            key={item.id}
                            style={{
                                background: 'linear-gradient(135deg, #0d0d0d 0%, #120000 100%)',
                                border: '1px solid #2a0000',
                                borderRadius: '16px',
                                padding: '24px 26px',
                                transition: 'all 0.3s',
                                position: 'relative',
                                overflow: 'hidden',
                            }}
                            onMouseEnter={e => {
                                e.currentTarget.style.border = '1px solid #7f1d1d';
                                e.currentTarget.style.boxShadow = '0 0 30px rgba(220,38,38,0.08)';
                            }}
                            onMouseLeave={e => {
                                e.currentTarget.style.border = '1px solid #2a0000';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Number badge */}
                            <span style={{
                                position: 'absolute',
                                top: '20px',
                                left: '26px',
                                backgroundColor: '#7f1d1d',
                                color: '#fca5a5',
                                fontSize: '11px',
                                fontWeight: '700',
                                padding: '2px 9px',
                                borderRadius: '999px',
                                letterSpacing: '1px',
                            }}>
                                #{duas.length - index}
                            </span>

                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '16px', marginTop: '30px' }}>
                                <div style={{ flex: 1 }}>
                                    <p style={{
                                        color: '#ffffff',
                                        fontSize: '16px',
                                        lineHeight: '1.85',
                                        whiteSpace: 'pre-wrap',
                                        margin: '0 0 12px 0',
                                        fontWeight: '400',
                                    }}>
                                        {item.text}
                                    </p>
                                    <p style={{ color: '#6b7280', fontSize: '12px', margin: 0, letterSpacing: '0.5px' }}>
                                        🕐 {dayjs(item.createdAt).format('MMM D, YYYY • h:mm A')}
                                    </p>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', flexShrink: 0 }}>
                                    <button
                                        onClick={() => startEdit(item)}
                                        title="Edit"
                                        style={{
                                            background: 'rgba(255,255,255,0.05)',
                                            border: '1px solid #374151',
                                            color: '#ffffff',
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.12)';
                                            e.currentTarget.style.borderColor = '#9ca3af';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                                            e.currentTarget.style.borderColor = '#374151';
                                        }}
                                    >
                                        <EditOutlined />
                                    </button>
                                    <button
                                        onClick={() => deleteDua(item.id)}
                                        title="Delete"
                                        style={{
                                            background: 'rgba(220,38,38,0.08)',
                                            border: '1px solid #7f1d1d',
                                            color: '#ef4444',
                                            width: '38px',
                                            height: '38px',
                                            borderRadius: '10px',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '15px',
                                            transition: 'all 0.2s',
                                        }}
                                        onMouseEnter={e => {
                                            e.currentTarget.style.background = 'rgba(220,38,38,0.2)';
                                            e.currentTarget.style.borderColor = '#dc2626';
                                        }}
                                        onMouseLeave={e => {
                                            e.currentTarget.style.background = 'rgba(220,38,38,0.08)';
                                            e.currentTarget.style.borderColor = '#7f1d1d';
                                        }}
                                    >
                                        <DeleteOutlined />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Edit Modal */}
            <Modal
                title={
                    <div style={{ paddingBottom: '16px', borderBottom: '1px solid #2a0000' }}>
                        <p style={{ color: '#6b7280', fontSize: '11px', letterSpacing: '3px', textTransform: 'uppercase', margin: '0 0 4px 0' }}>Edit</p>
                        <span style={{ color: '#ffffff', fontSize: '20px', fontWeight: '700' }}>Update Your Dua</span>
                    </div>
                }
                open={!!editing}
                onCancel={() => setEditing(null)}
                footer={null}
                styles={{
                    body: { backgroundColor: '#050505', padding: '24px' },
                    header: { backgroundColor: '#050505', borderBottom: 'none', padding: '24px 24px 0' },
                    content: { backgroundColor: '#050505', borderRadius: '20px', border: '1px solid #2a0000', boxShadow: '0 0 60px rgba(220,38,38,0.1)' },
                    mask: { backdropFilter: 'blur(6px)', backgroundColor: 'rgba(0,0,0,0.8)' },
                }}
            >
                <textarea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    rows={6}
                    style={{ ...inputStyle, marginBottom: '20px' }}
                    onFocus={e => {
                        e.target.style.border = '1.5px solid #dc2626';
                        e.target.style.boxShadow = '0 0 20px rgba(220,38,38,0.15)';
                    }}
                    onBlur={e => {
                        e.target.style.border = '1.5px solid #7f1d1d';
                        e.target.style.boxShadow = 'none';
                    }}
                />
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
                    <button
                        onClick={() => setEditing(null)}
                        style={{
                            backgroundColor: 'transparent',
                            border: '1.5px solid #7f1d1d',
                            color: '#ffffff',
                            padding: '11px 28px',
                            fontSize: '14px',
                            fontWeight: '500',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.borderColor = '#dc2626';
                            e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.08)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.borderColor = '#7f1d1d';
                            e.currentTarget.style.backgroundColor = 'transparent';
                        }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={saveEdit}
                        style={{
                            backgroundColor: '#b91c1c',
                            border: '1.5px solid #b91c1c',
                            color: '#ffffff',
                            padding: '11px 28px',
                            fontSize: '14px',
                            fontWeight: '600',
                            borderRadius: '10px',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.backgroundColor = '#dc2626';
                            e.currentTarget.style.borderColor = '#dc2626';
                            e.currentTarget.style.boxShadow = '0 0 20px rgba(220,38,38,0.3)';
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.backgroundColor = '#b91c1c';
                            e.currentTarget.style.borderColor = '#b91c1c';
                            e.currentTarget.style.boxShadow = 'none';
                        }}
                    >
                        Save Changes
                    </button>
                </div>
            </Modal>
        </div>
    );
}