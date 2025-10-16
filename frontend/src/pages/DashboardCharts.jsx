import React from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

export default function DashboardCharts() {
  const data = {
    labels: ['Jan', 'Fév', 'Mar', 'Avr', 'Mai', 'Juin'],
    datasets: [
      {
        label: 'Collaborateurs actifs',
        data: [20, 22, 23, 24, 25, 24],
        backgroundColor: '#6366f1',
      },
      {
        label: 'Projets en cours',
        data: [5, 6, 7, 8, 8, 8],
        backgroundColor: '#22d3ee',
      },
      {
        label: 'Charge totale (heures)',
        data: [900, 1000, 1100, 1200, 1300, 1240],
        backgroundColor: '#f59e42',
      },
    ],
  };
  const options = {
    responsive: true,
    plugins: {
      legend: { position: 'top' },
      tooltip: { enabled: true },
    },
    scales: {
      y: { beginAtZero: true }
    }
  };
  return (
    <div style={{background:'#fff',borderRadius:12,padding:16,marginBottom:24,boxShadow:'0 1px 4px rgba(76,81,255,0.04)'}}>
      <h3 style={{marginBottom:12}}>Statistiques mensuelles</h3>
      <Bar data={data} options={options} height={120} />
    </div>
  );
}
