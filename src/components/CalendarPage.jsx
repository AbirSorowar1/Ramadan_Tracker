import React, { useState, useEffect } from 'react';
import { Calendar, Modal, List, Typography } from 'antd';
import { db, ref, onValue } from '../firebase';
import dayjs from 'dayjs';

const { Title } = Typography;

export default function CalendarPage({ user }) {
    const [daysData, setDaysData] = useState({});
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalData, setModalData] = useState({ prayers: {}, deeds: [], score: 0 });

    useEffect(() => {
        const daysRef = ref(db, `users/${user.uid}/days`);
        onValue(daysRef, (snap) => {
            setDaysData(snap.val() || {});
        });
    }, [user.uid]);

    const dateCellRender = (value) => {
        const dateKey = value.format('YYYY-MM-DD');
        const day = daysData[dateKey];
        if (!day) return null;

        const prayerCount = Object.values(day.prayers || {}).filter(Boolean).length;
        const score = day.score || 0;

        return (
            <div className="text-sm mt-1">
                <div className="text-white">Prayers: {prayerCount}/5</div>
                <div className={score >= 0 ? 'text-green-400' : 'text-red-400'}>
                    Score: {score}
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
        });
    };

    return (
        <div className="max-w-5xl mx-auto">
            <Title level={2} className="text-red-600 text-4xl mb-10 text-center">Ramadan Calendar</Title>

            <div className="bg-black border border-red-900/40 rounded-2xl p-6 overflow-hidden shadow-2xl shadow-red-950/20">
                <Calendar
                    fullscreen={false}
                    dateCellRender={dateCellRender}
                    onSelect={onSelect}
                    className="bg-black"
                />
            </div>

            <Modal
                title={<span className="text-white">{selectedDate || ''}</span>}
                open={!!selectedDate}
                onCancel={() => setSelectedDate(null)}
                footer={null}
                width={600}
                bodyStyle={{ background: '#000000', color: '#ffffff' }}
            >
                <div className="space-y-8">
                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Score: <span className={modalData.score >= 0 ? 'text-green-400' : 'text-red-400'}>{modalData.score}</span></h3>
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Prayers</h3>
                        <List
                            size="large"
                            dataSource={Object.entries(modalData.prayers)}
                            renderItem={([name, done]) => (
                                <List.Item className="border-b border-red-900/30 last:border-none py-4">
                                    <span className="text-xl text-white">{name}</span>
                                    <span className={`text-lg ${done ? 'text-green-400' : 'text-red-400'}`}>
                                        {done ? 'Done' : 'Missed'}
                                    </span>
                                </List.Item>
                            )}
                        />
                    </div>

                    <div>
                        <h3 className="text-2xl font-semibold text-white mb-3">Deeds</h3>
                        {modalData.deeds.length === 0 ? (
                            <p className="text-gray-400 text-lg py-4">No deeds recorded on this day</p>
                        ) : (
                            <List
                                size="large"
                                dataSource={modalData.deeds}
                                renderItem={(item) => (
                                    <List.Item className="border-b border-red-900/30 last:border-none py-4">
                                        <div className="flex justify-between w-full">
                                            <span className="text-xl text-white">{item.description}</span>
                                            <span className={`text-lg font-medium ${item.points > 0 ? 'text-green-400' : 'text-red-400'}`}>
                                                {item.points > 0 ? '+' : ''}{item.points}
                                            </span>
                                        </div>
                                    </List.Item>
                                )}
                            />
                        )}
                    </div>
                </div>
            </Modal>
        </div>
    );
}