"use client";

import { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";
import
  {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    Filler
  } from "chart.js";
import { HistoricalHealth } from "@/lib/types";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

export default function HealthChart()
{
  const [healthData, setHealthData] = useState<HistoricalHealth | null>(null);

  useEffect(() =>
  {
    // Fetch from API or derive; placeholder for now
    setHealthData({
      period: "24h",
      data: Array.from({ length: 24 }, (_, i) => ({
        timestamp: new Date(Date.now() - (23 - i) * 3600000),
        score: 85 + Math.random() * 10
      })),
      avg: 92,
      min: 85,
      max: 95,
      change: -2,
    });
  }, []);

  if (!healthData) return <div>Loading chart...</div>;

  const chartData = {
    labels: healthData.data.map((d) => d.timestamp.getHours() + ':00'),
    datasets: [
      {
        label: "Health Score",
        data: healthData.data.map((d) => d.score),
        borderColor: "#00d4ff",
        backgroundColor: "rgba(0, 212, 255, 0.1)",
        tension: 0.4,
        fill: true,
        pointBackgroundColor: "#050614",
        pointBorderColor: "#00d4ff",
        pointBorderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: 'rgba(20, 22, 45, 0.9)',
        titleColor: '#fff',
        bodyColor: '#ccc',
        borderColor: 'rgba(255,255,255,0.1)',
        borderWidth: 1,
      }
    },
    scales: {
      x: {
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
        ticks: {
          color: '#64748b'
        }
      },
      y: {
        grid: {
          color: 'rgba(255,255,255,0.05)',
        },
        ticks: {
          color: '#64748b'
        },
        min: 60,
      }
    }
  };

  return (
    <div style={{ height: '300px' }}>
      <div className="flex justify-between items-center mb-4">
        <h2>Network Health</h2>
        <span className="badge badge-online">24h Trend</span>
      </div>
      <Line data={chartData} options={options} />
    </div>
  );
}
