import React, { useState, useEffect } from 'react';
import { message } from 'antd';
import { CopyOutlined, ReloadOutlined } from '@ant-design/icons';

const quotes = [
    { text: "Whoever fasts in Ramadan with faith and seeking reward will have his past sins forgiven.", source: "Sahih Bukhari", arabic: "مَنْ صَامَ رَمَضَانَ إِيمَانًا وَاحْتِسَابًا غُفِرَ لَهُ مَا تَقَدَّمَ مِنْ ذَنْبِهِ", icon: "🌙" },
    { text: "Ramadan is the month in which the Quran was revealed.", source: "Quran 2:185", arabic: "شَهْرُ رَمَضَانَ الَّذِي أُنزِلَ فِيهِ الْقُرْآنُ", icon: "📖" },
    { text: "The best among you are those who learn the Quran and teach it.", source: "Sahih Bukhari", arabic: "خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ", icon: "✨" },
    { text: "Fasting is a shield; it will protect you from hellfire and prevent you from sins.", source: "Sahih Muslim", arabic: "الصِّيَامُ جُنَّةٌ", icon: "🛡️" },
    { text: "There is a gate in Paradise called Ar-Rayyan, through which only those who fast will enter.", source: "Sahih Bukhari", arabic: "إِنَّ فِي الْجَنَّةِ بَابًا يُقَالُ لَهُ الرَّيَّانُ", icon: "🕌" },
    { text: "Make your character beautiful, for a good character is a heavy thing on the scales.", source: "Hadith", arabic: "أَحْسِنُوا أَخْلَاقَكُمْ", icon: "⚖️" },
    { text: "Whoever believes in Allah and the Last Day, let him speak good or remain silent.", source: "Sahih Bukhari", arabic: "مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ", icon: "🤍" },
    { text: "The strong person is not the one who overpowers others, but the one who controls himself when angry.", source: "Sahih Bukhari", arabic: "لَيْسَ الشَّدِيدُ بِالصُّرَعَةِ", icon: "💪" },
];

export default function Motivation({ user }) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [timeLeft, setTimeLeft] = useState('');

    useEffect(() => {
        const idx = Math.floor(Math.random() * quotes.length);
        setCurrentIndex(idx);
    }, []);

    // Countdown to next Fajr (next day 5 AM)
    useEffect(() => {
        const tick = () => {
            const now = new Date();
            const fajr = new Date();
            fajr.setHours(5, 0, 0, 0);
            if (now >= fajr) fajr.setDate(fajr.getDate() + 1);
            const diff = fajr - now;
            const h = Math.floor(diff / 3600000);
            const m = Math.floor((diff % 3600000) / 60000);
            const s = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`);
        };
        tick();
        const timer = setInterval(tick, 1000);
        return () => clearInterval(timer);
    }, []);

    const quote = quotes[currentIndex];

    const nextQuote = () => {
        if (animating) return;
        setAnimating(true);
        setTimeout(() => {
            setCurrentIndex((prev) => (prev + 1) % quotes.length);
            setAnimating(false);
        }, 300);
    };

    const copyQuote = () => {
        const text = `"${quote.text}" — ${quote.source}\n\nRamadan Mubarak! 🌙`;
        navigator.clipboard.writeText(text).then(() => message.success('Copied to clipboard!'));
    };

    return (
        <div style={{ maxWidth: '780px', margin: '0 auto', padding: '32px 20px', fontFamily: "'Segoe UI', sans-serif" }}>

            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: '40px' }}>
                <p style={{ color: '#4b1c1c', fontSize: '22px', margin: '0 0 6px' }}>﷽</p>
                <h1 style={{ color: '#ffffff', fontSize: '34px', fontWeight: '800', margin: '0 0 6px', letterSpacing: '-0.5px' }}>
                    Daily <span style={{ color: '#dc2626' }}>Motivation</span>
                </h1>
                <p style={{ color: '#6b7280', fontSize: '13px', margin: 0 }}>
                    Let the words of Allah & His Prophet guide your day
                </p>
                <div style={{ width: '50px', height: '3px', background: 'linear-gradient(to right, #7f1d1d, #dc2626)', margin: '14px auto 0', borderRadius: '999px' }} />
            </div>

            {/* Countdown Timer */}
            <div style={{
                background: 'linear-gradient(135deg, #0f0f0f, #1a0000)',
                border: '1px solid #2a0000',
                borderRadius: '16px',
                padding: '18px 28px',
                marginBottom: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '10px',
            }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <span style={{ fontSize: '20px' }}>🌄</span>
                    <div>
                        <p style={{ color: '#9ca3af', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', margin: 0 }}>Next Fajr in</p>
                    </div>
                </div>
                <p style={{
                    color: '#dc2626',
                    fontSize: '28px',
                    fontWeight: '900',
                    margin: 0,
                    letterSpacing: '2px',
                    fontVariantNumeric: 'tabular-nums',
                }}>
                    {timeLeft}
                </p>
            </div>

            {/* Main Quote Card */}
            <div style={{
                background: 'linear-gradient(135deg, #0d0d0d 0%, #1a0000 100%)',
                border: '1px solid #3f0000',
                borderRadius: '24px',
                padding: '40px 36px',
                marginBottom: '24px',
                boxShadow: '0 0 60px rgba(220,38,38,0.07)',
                position: 'relative',
                overflow: 'hidden',
                transition: 'opacity 0.3s ease',
                opacity: animating ? 0 : 1,
            }}>
                {/* Top gradient line */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                    background: 'linear-gradient(to right, transparent, #dc2626, transparent)',
                }} />

                {/* Big quote mark */}
                <div style={{
                    position: 'absolute',
                    top: '20px',
                    left: '28px',
                    fontSize: '80px',
                    color: '#2a0000',
                    lineHeight: 1,
                    fontFamily: 'Georgia, serif',
                    userSelect: 'none',
                }}>
                    "
                </div>

                {/* Icon */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                    <span style={{
                        fontSize: '36px',
                        display: 'inline-block',
                        padding: '14px',
                        borderRadius: '50%',
                        backgroundColor: 'rgba(220,38,38,0.08)',
                        border: '1px solid rgba(220,38,38,0.2)',
                    }}>
                        {quote.icon}
                    </span>
                </div>

                {/* Arabic */}
                <p style={{
                    color: '#7f1d1d',
                    fontSize: '18px',
                    textAlign: 'center',
                    fontFamily: 'serif',
                    lineHeight: '2',
                    margin: '0 0 20px',
                    direction: 'rtl',
                }}>
                    {quote.arabic}
                </p>

                {/* English quote */}
                <p style={{
                    color: '#ffffff',
                    fontSize: '20px',
                    lineHeight: '1.8',
                    textAlign: 'center',
                    fontStyle: 'italic',
                    fontWeight: '400',
                    margin: '0 0 20px',
                    padding: '0 16px',
                }}>
                    "{quote.text}"
                </p>

                {/* Source */}
                <div style={{ textAlign: 'center' }}>
                    <span style={{
                        color: '#fca5a5',
                        fontSize: '13px',
                        fontWeight: '600',
                        backgroundColor: 'rgba(220,38,38,0.1)',
                        border: '1px solid rgba(220,38,38,0.2)',
                        padding: '5px 16px',
                        borderRadius: '999px',
                        letterSpacing: '0.5px',
                    }}>
                        — {quote.source}
                    </span>
                </div>
            </div>

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', marginBottom: '36px' }}>
                <button
                    onClick={nextQuote}
                    style={{
                        flex: 1,
                        background: 'linear-gradient(135deg, #991b1b, #b91c1c)',
                        border: 'none',
                        color: '#ffffff',
                        padding: '14px',
                        borderRadius: '14px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
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
                    <ReloadOutlined /> Next Quote
                </button>
                <button
                    onClick={copyQuote}
                    style={{
                        flex: 1,
                        backgroundColor: 'transparent',
                        border: '1.5px solid #7f1d1d',
                        color: '#ffffff',
                        padding: '14px',
                        borderRadius: '14px',
                        fontSize: '15px',
                        fontWeight: '600',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px',
                        transition: 'all 0.2s',
                        fontFamily: 'inherit',
                    }}
                    onMouseEnter={e => {
                        e.currentTarget.style.backgroundColor = 'rgba(220,38,38,0.08)';
                        e.currentTarget.style.borderColor = '#dc2626';
                    }}
                    onMouseLeave={e => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        e.currentTarget.style.borderColor = '#7f1d1d';
                    }}
                >
                    <CopyOutlined /> Copy Quote
                </button>
            </div>

            {/* All Quotes List */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '20px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to right, #2a0000, transparent)' }} />
                <p style={{ color: '#ef4444', fontSize: '11px', fontWeight: '600', letterSpacing: '3px', textTransform: 'uppercase', margin: 0 }}>
                    All Quotes
                </p>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(to left, #2a0000, transparent)' }} />
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px' }}>
                {quotes.map((q, i) => (
                    <div
                        key={i}
                        onClick={() => { setAnimating(true); setTimeout(() => { setCurrentIndex(i); setAnimating(false); }, 200); }}
                        style={{
                            padding: '16px 20px',
                            borderRadius: '14px',
                            background: currentIndex === i
                                ? 'linear-gradient(135deg, #1a0000, #2d0000)'
                                : 'linear-gradient(135deg, #0a0a0a, #0f0000)',
                            border: currentIndex === i ? '1px solid rgba(220,38,38,0.4)' : '1px solid #1f0000',
                            cursor: 'pointer',
                            transition: 'all 0.2s',
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: '14px',
                        }}
                        onMouseEnter={e => {
                            if (currentIndex !== i) {
                                e.currentTarget.style.border = '1px solid #7f1d1d';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #0f0000, #1a0000)';
                            }
                        }}
                        onMouseLeave={e => {
                            if (currentIndex !== i) {
                                e.currentTarget.style.border = '1px solid #1f0000';
                                e.currentTarget.style.background = 'linear-gradient(135deg, #0a0a0a, #0f0000)';
                            }
                        }}
                    >
                        <span style={{ fontSize: '18px', flexShrink: 0, marginTop: '2px' }}>{q.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                            <p style={{
                                color: currentIndex === i ? '#ffffff' : '#9ca3af',
                                fontSize: '14px',
                                margin: '0 0 4px',
                                lineHeight: '1.6',
                                fontStyle: 'italic',
                            }}>
                                "{q.text}"
                            </p>
                            <p style={{ color: currentIndex === i ? '#fca5a5' : '#6b7280', fontSize: '12px', margin: 0 }}>
                                — {q.source}
                            </p>
                        </div>
                        {currentIndex === i && (
                            <div style={{
                                width: '8px', height: '8px', borderRadius: '50%',
                                backgroundColor: '#dc2626',
                                boxShadow: '0 0 8px #dc2626',
                                flexShrink: 0, marginTop: '6px',
                            }} />
                        )}
                    </div>
                ))}
            </div>

            {/* Bottom message */}
            <div style={{
                textAlign: 'center',
                padding: '28px',
                background: 'linear-gradient(135deg, #0a0a0a, #120000)',
                border: '1px solid #1f0000',
                borderRadius: '18px',
            }}>
                <p style={{ fontSize: '24px', margin: '0 0 10px' }}>🤲</p>
                <p style={{ color: '#ffffff', fontSize: '16px', fontWeight: '500', margin: '0 0 8px' }}>
                    আজকের এই কথা মনে রাখুন
                </p>
                <p style={{ color: '#6b7280', fontSize: '14px', margin: 0 }}>
                    এবং আমলের সাথে জীবনকে সুন্দর করুন — Ramadan Mubarak 🌙
                </p>
            </div>
        </div>
    );
}