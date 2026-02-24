import React, { useState, useEffect } from 'react';
import { Button, Card, Typography, message } from 'antd';
import { db, ref, onValue } from '../firebase';

const { Title, Paragraph } = Typography;

const quotes = [
    { text: "Whoever fasts in Ramadan with faith and seeking reward will have his past sins forgiven.", source: "Sahih Bukhari" },
    { text: "Ramadan is the month of the Quran.", source: "Quran 2:185" },
    { text: "The best among you are those who learn the Quran and teach it.", source: "Sahih Bukhari" },
    { text: "Fasting is a shield.", source: "Sahih Muslim" },
    { text: "There is a gate in Paradise called Ar-Rayyan, for those who fast.", source: "Sahih Bukhari" },
];

export default function Motivation({ user }) {
    const [dailyQuote, setDailyQuote] = useState(quotes[0]);

    useEffect(() => {
        // Simple random daily quote (can make it DB based later)
        const randomIndex = Math.floor(Math.random() * quotes.length);
        setDailyQuote(quotes[randomIndex]);
    }, []);

    const shareQuote = () => {
        const text = `"${dailyQuote.text}" — ${dailyQuote.source}\nRamadan Mubarak!`;
        navigator.clipboard.writeText(text).then(() => {
            message.success('Quote copied to clipboard!');
        });
    };

    return (
        <div className="max-w-4xl mx-auto bg-black text-white">
            <h1 className="text-4xl font-bold text-red-600 mb-10 text-center">Daily Motivation</h1>

            <Card className="bg-black border border-red-900/40 p-8 text-center shadow-2xl">
                <Title level={3} className="text-white mb-6 italic">"{dailyQuote.text}"</Title>
                <p className="text-xl text-gray-300 mb-8">— {dailyQuote.source}</p>

                <Button
                    type="primary"
                    size="large"
                    onClick={shareQuote}
                    className="bg-red-700 hover:bg-red-600 px-10 py-6 text-lg"
                >
                    Share this Quote
                </Button>
            </Card>

            <div className="mt-12 text-center">
                <p className="text-lg text-gray-300">
                    আজকের এই কথা মনে রাখুন এবং আমলের সাথে জীবনকে সুন্দর করুন।
                </p>
            </div>
        </div>
    );
}