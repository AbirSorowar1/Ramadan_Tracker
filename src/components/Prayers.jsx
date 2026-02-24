import React, { useState, useEffect } from 'react';
import { Button, message } from 'antd';
import { db, ref, onValue, set } from '../firebase';
import dayjs from 'dayjs';

const prayersList = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

export default function Prayers({ user }) {
    const [todayPrayers, setTodayPrayers] = useState({});
    const [totalPrayers, setTotalPrayers] = useState(0);
    const [todayScore, setTodayScore] = useState(0);
    const [ramadanScore, setRamadanScore] = useState(0);

    const today = dayjs().format('YYYY-MM-DD');
    const PRAYER_POINTS = 10;

    useEffect(() => {
        const prayersRef = ref(db, `users/${user.uid}/days/${today}/prayers`);
        onValue(prayersRef, (snap) => {
            const data = snap.val() || {};
            setTodayPrayers(data);
            const doneCount = Object.values(data).filter(Boolean).length;
            setTodayScore(doneCount * PRAYER_POINTS);
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

        message.success(`${prayerName} marked as done (+${PRAYER_POINTS} points)`);
    };

    const markUndone = (prayerName) => {
        const updated = { ...todayPrayers };
        delete updated[prayerName];
        set(ref(db, `users/${user.uid}/days/${today}/prayers`), updated);
        set(ref(db, `users/${user.uid}/ramadanTotals/prayers`), totalPrayers - 1);

        const newTodayScore = todayScore - PRAYER_POINTS;
        set(ref(db, `users/${user.uid}/days/${today}/score`), newTodayScore);
        set(ref(db, `users/${user.uid}/ramadanTotals/score`), ramadanScore - PRAYER_POINTS);

        message.info(`${prayerName} marked as undone`);
    };

    return (
        <div className="max-w-5xl mx-auto">
            <h1 className="text-4xl font-bold text-red-600 mb-10 text-center">Today's Salat</h1>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {prayersList.map((prayer) => (
                    <div
                        key={prayer}
                        className={`p-7 rounded-2xl border border-red-900/40 transition-all duration-300 hover:border-red-600/70 hover:shadow-lg hover:shadow-red-950/30 ${todayPrayers[prayer] ? 'bg-red-950/20' : 'bg-black/70'
                            }`}
                    >
                        <div className="flex justify-between items-center flex-wrap gap-4">
                            <h3 className="text-2xl font-semibold text-white">{prayer}</h3>
                            <div className="flex gap-3">
                                {todayPrayers[prayer] ? (
                                    <>
                                        <span className="text-green-400 font-medium px-4 py-2 bg-green-950/50 rounded-full text-base">
                                            Done (+10)
                                        </span>
                                        <Button
                                            danger
                                            size="middle"
                                            onClick={() => markUndone(prayer)}
                                        >
                                            Undo
                                        </Button>
                                    </>
                                ) : (
                                    <Button
                                        type="primary"
                                        onClick={() => markAsDone(prayer)}
                                        className="bg-red-700 hover:bg-red-600 px-6"
                                    >
                                        Mark Done
                                    </Button>
                                )}
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-12 space-y-4 text-center sm:text-left">
                <p className="text-2xl text-white">
                    Today's Prayer Score: <span className="text-red-500 font-bold">{todayScore}</span>
                </p>
                <p className="text-2xl text-white">
                    Total Prayers: <span className="text-red-500 font-bold">{totalPrayers}</span>
                </p>
                <p className="text-2xl text-white">
                    Overall Ramadan Score: <span className="text-red-500 font-bold">{ramadanScore}</span>
                </p>
            </div>
        </div>
    );
}