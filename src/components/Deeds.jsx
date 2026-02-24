// src/components/Deeds.jsx (points already user-assigned, text white, added delete/edit features)
import React, { useState, useEffect } from 'react';
import { Form, Input, Button, List, message, Select, Modal } from 'antd';
import { db, ref, onValue, push, set, remove } from '../firebase';
import dayjs from 'dayjs';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export default function Deeds({ user }) {
    const [form] = Form.useForm();
    const [editForm] = Form.useForm();
    const [deeds, setDeeds] = useState([]);
    const [dailyScore, setDailyScore] = useState(0);
    const [editingDeed, setEditingDeed] = useState(null);

    const today = dayjs().format('YYYY-MM-DD');

    useEffect(() => {
        const deedsRef = ref(db, `users/${user.uid}/days/${today}/deeds`);
        onValue(deedsRef, (snap) => {
            const data = snap.val() || {};
            const list = Object.entries(data).map(([id, item]) => ({ id, ...item }));
            setDeeds(list);

            const score = list.reduce((sum, item) => sum + (item.points || 0), 0);
            setDailyScore(score);

            set(ref(db, `users/${user.uid}/days/${today}/score`), score);
            set(ref(db, `users/${user.uid}/ramadanTotals/score`), score); // Update total if needed
        });
    }, [user.uid, today]);

    const onFinish = (values) => {
        const points = values.type === 'good' ? Number(values.points) : -Number(values.points);

        push(ref(db, `users/${user.uid}/days/${today}/deeds`), {
            description: values.description,
            points,
            type: values.type,
            createdAt: Date.now(),
        });

        form.resetFields();
        message.success('Deed added');
    };

    const handleEdit = (deed) => {
        setEditingDeed(deed);
        editForm.setFieldsValue({
            description: deed.description,
            points: Math.abs(deed.points),
            type: deed.type,
        });
    };

    const onEditFinish = (values) => {
        const points = values.type === 'good' ? Number(values.points) : -Number(values.points);

        set(ref(db, `users/${user.uid}/days/${today}/deeds/${editingDeed.id}`), {
            description: values.description,
            points,
            type: values.type,
            createdAt: editingDeed.createdAt,
        });

        setEditingDeed(null);
        message.success('Deed updated');
    };

    const handleDelete = (id) => {
        remove(ref(db, `users/${user.uid}/days/${today}/deeds/${id}`));
        message.success('Deed deleted');
    };

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl sm:text-4xl font-bold text-red-500 mb-8 text-center sm:text-left">
                Good & Bad Deeds
            </h1>

            <div className="bg-gray-950 border border-red-900/40 rounded-2xl p-6 mb-8">
                <Form form={form} onFinish={onFinish} layout="vertical" className="space-y-4">
                    <Form.Item name="description" rules={[{ required: true, message: 'Please enter description' }]}>
                        <Input placeholder="What did you do?" size="large" className="text-white" />
                    </Form.Item>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Form.Item name="points" rules={[{ required: true, message: 'Enter points' }]}>
                            <Input type="number" placeholder="Points (e.g. 10)" size="large" className="text-white" />
                        </Form.Item>

                        <Form.Item name="type" rules={[{ required: true }]}>
                            <Select size="large" placeholder="Type">
                                <Select.Option value="good">Good (+)</Select.Option>
                                <Select.Option value="bad">Bad (−)</Select.Option>
                            </Select>
                        </Form.Item>
                    </div>

                    <Button type="primary" htmlType="submit" size="large" block className="bg-red-600">
                        Add Deed
                    </Button>
                </Form>
            </div>

            <div className="mb-6">
                <h2 className="text-2xl font-semibold text-white mb-3">Today's deeds</h2>
                <List
                    bordered
                    dataSource={deeds}
                    renderItem={(item) => (
                        <List.Item className="bg-gray-950 text-white">
                            <div className="flex justify-between items-center w-full">
                                <span className="text-white">{item.description}</span>
                                <span className={`font-medium ${item.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                    {item.points > 0 ? '+' : ''}{item.points}
                                </span>
                                <div>
                                    <Button icon={<EditOutlined />} type="text" onClick={() => handleEdit(item)} className="text-white mr-2" />
                                    <Button icon={<DeleteOutlined />} type="text" onClick={() => handleDelete(item.id)} className="text-red-500" />
                                </div>
                            </div>
                        </List.Item>
                    )}
                    locale={{ emptyText: <span className="text-gray-400">No deeds added today</span> }}
                    className="bg-black"
                />
            </div>

            <div className="text-center sm:text-left">
                <p className="text-2xl text-white">
                    Today's score: <span className={dailyScore >= 0 ? 'text-green-400' : 'text-red-400'} font-bold>
                        {dailyScore}
                    </span>
                </p>
            </div>

            {/* Edit Modal */}
            <Modal
                open={!!editingDeed}
                onCancel={() => setEditingDeed(null)}
                footer={null}
                title="Edit Deed"
                bodyStyle={{ background: '#000', color: '#fff' }}
            >
                <Form form={editForm} onFinish={onEditFinish} layout="vertical">
                    <Form.Item name="description" rules={[{ required: true }]}>
                        <Input placeholder="Description" />
                    </Form.Item>
                    <Form.Item name="points" rules={[{ required: true }]}>
                        <Input type="number" placeholder="Points" />
                    </Form.Item>
                    <Form.Item name="type" rules={[{ required: true }]}>
                        <Select>
                            <Select.Option value="good">Good</Select.Option>
                            <Select.Option value="bad">Bad</Select.Option>
                        </Select>
                    </Form.Item>
                    <Button type="primary" htmlType="submit" block className="bg-red-600">
                        Update
                    </Button>
                </Form>
            </Modal>
        </div>
    );
}