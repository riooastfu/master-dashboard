"use client"

import React from 'react';
import { motion } from "motion/react";
import { WorldMap } from '@/components/ui/world-map';

const locations = {
    // Shifted longitudes more to the right (increased longitude values)
    PAS: [-6.227386, 106.807194],    // Shifted from 106 to 116
    CUS: [-1.0136004945888857, 110.23684340700402],  // Shifted from 110 to 120
    JV: [-0.9890164744428489, 110.09631107415572],   // Shifted from 110 to 120
    MARKR: [-0.3569689673205261, 109.34309260946083], // Shifted from 109 to 119
    MARBA: [-2.7069012230956844, 104.46717743309858], // Shifted from 104 to 114
    BAS: [1.6136, 101.1091],         // Shifted from 100 to 110
    RMM: [0.7074, 100.3164],         // Shifted from 99 to 109
    DIS: [0.8077, 100.2902]          // Shifted from 99 to 109
};

const createConnections = () => {
    const points = Object.entries(locations);
    const dots = [];
    const hub = points[0];
    for (let i = 1; i < points.length; i++) {
        dots.push({
            start: {
                lat: hub[1][0],
                lng: hub[1][1],
                label: hub[0]
            },
            end: {
                lat: points[i][1][0],
                lng: points[i][1][1],
                label: points[i][0]
            }
        });
    }
    return dots;
};

const HomePage = () => {
    return (
        <div className="h-[calc(100vh-80px)] relative flex flex-col items-center justify-center">
            {/* Background Map */}
            <div className="absolute inset-0 opacity-50">
                <WorldMap dots={createConnections()} />
            </div>

            {/* Centered Content */}
            <div className="relative z-10 max-w-7xl mx-auto text-center px-4">
                <h1 className="font-bold text-2xl md:text-4xl lg:text-5xl dark:text-white text-black">
                    {/* {" "} */}
                    <span className="text-black">
                        {"Sistem Informasi Geografis".split("").map((char, idx) => (
                            <motion.span
                                key={idx}
                                className="inline-block"
                                initial={{ x: -10, opacity: 0 }}
                                animate={{ x: 0, opacity: 1 }}
                                transition={{ duration: 0.5, delay: idx * 0.04 }}
                            >
                                {char === " " ? "\u00A0" : char}
                            </motion.span>
                        ))}
                    </span>
                </h1>
                <p className="text-sm md:text-lg text-neutral-500 max-w-2xl mx-auto mt-6 p-4 rounded-lg bg-white/30 dark:bg-black/30 backdrop-blur-sm">
                    Selamat datang di Sistem Informasi Geospasial-Pasifik Agro Sentosa. Situs ini bertujuan untuk menyajikan berbagai informasi berbasis geografis yang terkait dengan kebun di PAS Group.
                </p>
            </div>
        </div>
    );
};

export default HomePage;