import React, { useState, useEffect } from 'react';
import { Button, Input, List, message, Modal } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
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
        message.success('Dua deleted successfully');
    };

    return (
        <div className="max-w-4xl mx-auto bg-black min-h-screen text-white p-6 md:p-10">
            <h1 className="text-4xl md:text-5xl font-bold text-red-600 mb-12 text-center">
                Dua & Reminders
            </h1>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <TextArea
                    value={newDua}
                    onChange={(e) => setNewDua(e.target.value)}
                    placeholder="Write your dua here... (for forgiveness, protection, Jannah, etc.)"
                    autoSize={{ minRows: 4, maxRows: 6 }}
                    className="bg-black border-2 border-red-600 text-white text-lg p-5 rounded-xl focus:border-red-500 focus:ring-2 focus:ring-red-500/40 placeholder:text-gray-400 placeholder:opacity-100"
                />
                <Button
                    type="primary"
                    size="large"
                    onClick={addDua}
                    className="bg-red-700 hover:bg-red-600 border-none text-white h-14 px-10 text-lg font-medium sm:self-end transition-all duration-200"
                >
                    Add Dua
                </Button>
            </div>

            <h2 className="text-3xl font-semibold text-red-500 mb-8 text-center md:text-left">
                Your Duas
            </h2>

            {duas.length === 0 ? (
                <p className="text-center text-2xl text-gray-300 py-20">
                    No duas added yet. Start writing your personal supplications.
                </p>
            ) : (
                <List
                    dataSource={duas}
                    renderItem={(item) => (
                        <div className="p-6 mb-6 rounded-2xl bg-black border border-red-900/50 hover:border-red-600 transition-all duration-300">
                            <div className="flex justify-between items-start gap-4">
                                <div className="flex-1">
                                    <p className="text-xl leading-relaxed text-white whitespace-pre-wrap">
                                        {item.text}
                                    </p>
                                    <p className="text-sm text-gray-400 mt-3">
                                        {dayjs(item.createdAt).format('MMM D, YYYY • h:mm A')}
                                    </p>
                                </div>
                                <div className="flex gap-3 mt-1">
                                    <Button
                                        type="text"
                                        icon={<EditOutlined />}
                                        onClick={() => startEdit(item)}
                                        className="text-blue-400 hover:text-blue-300 text-2xl p-2 hover:bg-red-950/30 rounded-full transition-colors"
                                    />
                                    <Button
                                        type="text"
                                        icon={<DeleteOutlined />}
                                        onClick={() => deleteDua(item.id)}
                                        className="text-red-500 hover:text-red-400 text-2xl p-2 hover:bg-red-950/30 rounded-full transition-colors"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                />
            )}

            {/* Edit Modal */}
            <Modal
                title={<span className="text-white text-2xl font-semibold">Edit Dua</span>}
                open={!!editing}
                onCancel={() => setEditing(null)}
                footer={null}
                bodyStyle={{ backgroundColor: '#000000', color: '#ffffff', padding: '24px' }}
            >
                <TextArea
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                    autoSize={{ minRows: 5, maxRows: 10 }}
                    className="bg-black border-2 border-red-600 text-white text-lg p-5 rounded-xl mb-6 focus:border-red-500 placeholder:text-gray-400 placeholder:opacity-100"
                />
                <div className="flex justify-end gap-4">
                    <Button
                        onClick={() => setEditing(null)}
                        className="bg-black border border-red-600 text-white hover:bg-red-900/50 px-8 py-4 text-lg transition-colors"
                    >
                        Cancel
                    </Button>
                    <Button
                        type="primary"
                        onClick={saveEdit}
                        className="bg-red-700 hover:bg-red-600 border-none text-white px-8 py-4 text-lg transition-colors"
                    >
                        Save Changes
                    </Button>
                </div>
            </Modal>
        </div>
    );
}