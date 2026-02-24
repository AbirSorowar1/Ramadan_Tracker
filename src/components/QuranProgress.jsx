import React, { useState, useEffect } from 'react';
import { Button, InputNumber, List, message, Card } from 'antd';
import { db, ref, set, onValue, push, remove } from '../firebase';
import dayjs from 'dayjs';

const surahs = [
    "Al-Fatiha", "Al-Baqarah", "Al-Imran", "An-Nisa", "Al-Ma'idah", /* ... add more if needed ... */ "An-Nas"
];

export default function QuranProgress({ user }) {
    const [progress, setProgress] = useState({});
    const [selectedSurah, setSelectedSurah] = useState('');
    const [pagesRead, setPagesRead] = useState(0);

    useEffect(() => {
        const progressRef = ref(db, `users/${user.uid}/quran`);
        onValue(progressRef, (snap) => {
            setProgress(snap.val() || {});
        });
    }, [user.uid]);

    const markRead = () => {
        if (!selectedSurah || pagesRead <= 0) {
            return message.warning('Surah & pages select করুন');
        }

        const today = dayjs().format('YYYY-MM-DD');
        const updated = {
            ...progress,
            [today]: {
                ...(progress[today] || {}),
                [selectedSurah]: pagesRead,
            },
        };

        set(ref(db, `users/${user.uid}/quran`), updated);
        message.success(`${selectedSurah} - ${pagesRead} pages marked as read`);
        setPagesRead(0);
    };

    const deleteEntry = (date, surah) => {
        const updated = { ...progress };
        if (updated[date]) {
            delete updated[date][surah];
            if (Object.keys(updated[date]).length === 0) delete updated[date];
        }
        set(ref(db, `users/${user.uid}/quran`), updated);
        message.success('Entry deleted');
    };

    const totalPages = Object.values(progress).reduce((sum, day) => {
        return sum + Object.values(day).reduce((a, b) => a + b, 0);
    }, 0);

    return (
        <div className="max-w-5xl mx-auto bg-black text-white">
            <h1 className="text-4xl font-bold text-red-600 mb-10 text-center">Quran Progress</h1>

            <Card className="bg-black border border-red-900/40 mb-10">
                <div className="flex flex-col md:flex-row gap-6 items-end">
                    <div className="flex-1">
                        <label className="block text-lg mb-2 text-gray-200">Select Surah</label>
                        <select
                            value={selectedSurah}
                            onChange={e => setSelectedSurah(e.target.value)}
                            className="w-full p-3 bg-gray-900 border border-red-900 text-white rounded-lg text-lg"
                        >
                            <option value="">-- Choose Surah --</option>
                            {surahs.map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-lg mb-2 text-gray-200">Pages Read Today</label>
                        <InputNumber
                            min={1}
                            value={pagesRead}
                            onChange={setPagesRead}
                            className="w-full h-12 text-lg bg-gray-900 border-red-900 text-white"
                            placeholder="e.g. 5"
                        />
                    </div>

                    <Button
                        type="primary"
                        size="large"
                        onClick={markRead}
                        className="h-12 px-10 bg-red-700 hover:bg-red-600 text-lg font-medium"
                    >
                        Mark as Read
                    </Button>
                </div>
            </Card>

            <h2 className="text-2xl font-semibold text-red-500 mb-6">Your Progress</h2>
            <p className="text-xl mb-8">Total Pages Read: <span className="text-green-400 font-bold">{totalPages}</span></p>

            <List
                grid={{ gutter: 16, column: 1 }}
                dataSource={Object.entries(progress).flatMap(([date, surahs]) =>
                    Object.entries(surahs).map(([surah, pages]) => ({ date, surah, pages }))
                )}
                renderItem={item => (
                    <List.Item>
                        <div className="flex justify-between items-center p-5 bg-gray-950 rounded-xl border border-red-900/40">
                            <div>
                                <p className="text-lg font-medium">{item.surah}</p>
                                <p className="text-gray-400">{dayjs(item.date).format('MMM D, YYYY')} • {item.pages} pages</p>
                            </div>
                            <Button
                                danger
                                type="text"
                                onClick={() => deleteEntry(item.date, item.surah)}
                                className="text-red-500 hover:text-red-400"
                            >
                                Delete
                            </Button>
                        </div>
                    </List.Item>
                )}
                locale={{ emptyText: <p className="text-gray-400 py-10">আজকের কোনো পড়া নেই — শুরু করুন!</p> }}
            />
        </div>
    );
}