'use client';

import React, { useState } from 'react';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    ArcElement,
    PointElement,
    LineElement,
    Tooltip,
    Legend
);

const barData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Dons (€)',
            data: [1200, 1500, 1100, 1800, 1700, 1600],
            backgroundColor: 'rgba(54, 162, 235, 0.7)',
        },
        {
            label: 'Dépenses (€)',
            data: [900, 1200, 950, 1300, 1100, 1400],
            backgroundColor: 'rgba(255, 99, 132, 0.7)',
        },
    ],
};

const pieData = {
    labels: ['Dons', 'Collectes', 'Autres'],
    datasets: [
        {
            data: [5000, 2000, 1000],
            backgroundColor: [
                'rgba(54, 162, 235, 0.7)',
                'rgba(255, 206, 86, 0.7)',
                'rgba(75, 192, 192, 0.7)',
            ],
        },
    ],
};

const lineData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
        {
            label: 'Solde (€)',
            data: [300, 600, 750, 1250, 1850, 2050],
            fill: false,
            borderColor: 'rgba(75,192,192,1)',
            tension: 0.1,
        },
    ],
};

export default function FinancesPage() {
    const [selectedGraph, setSelectedGraph] = useState<'bar' | 'pie' | 'line'>('bar');

    return (
        <div className="max-w-4xl mx-auto p-6">
            <h1 className="text-3xl font-bold mb-6">Finances de la Paroisse</h1>
            <div className="flex gap-4 mb-6">
                <button
                    className={`px-4 py-2 rounded ${selectedGraph === 'bar' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedGraph('bar')}
                >
                    Revenus & Dépenses
                </button>
                <button
                    className={`px-4 py-2 rounded ${selectedGraph === 'pie' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedGraph('pie')}
                >
                    Répartition des Revenus
                </button>
                <button
                    className={`px-4 py-2 rounded ${selectedGraph === 'line' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}
                    onClick={() => setSelectedGraph('line')}
                >
                    Solde Mensuel
                </button>
            </div>
            <div className="bg-white rounded shadow p-6">
                {selectedGraph === 'bar' && <Bar data={barData} />}
                {selectedGraph === 'pie' && <Pie data={pieData} />}
                {selectedGraph === 'line' && <Line data={lineData} />}
            </div>
        </div>
    );
}