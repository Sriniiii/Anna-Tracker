import React, { useState, useEffect, useRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler, ChartArea } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { subMonths, format } from 'date-fns';
import { faker } from '@faker-js/faker';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

function createGradient(ctx: CanvasRenderingContext2D, area: ChartArea, color: string) {
  const gradient = ctx.createLinearGradient(0, area.bottom, 0, area.top);
  gradient.addColorStop(0, `${color}00`);
  gradient.addColorStop(1, `${color}55`);
  return gradient;
}

const WasteChart: React.FC = () => {
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState(12);
  const chartRef = useRef<ChartJS<'line'>>(null);

  useEffect(() => {
    setLoading(true);

    const labels = [];
    const wasteData = [];
    const savedData = [];

    for (let i = timePeriod - 1; i >= 0; i--) {
      const date = subMonths(new Date(), i);
      labels.push(format(date, 'MMM'));
      wasteData.push(faker.number.int({ min: 10, max: 80 }));
      savedData.push(faker.number.int({ min: 20, max: 150 }));
    }

    setChartData({
      labels,
      datasets: [
        {
          label: 'Waste Logged (kg)',
          data: wasteData,
          borderColor: '#ef4444', // red-500
          pointBackgroundColor: '#ef4444',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#ef4444',
          tension: 0.4,
          fill: true,
        },
        {
          label: 'Food Saved (kg)',
          data: savedData,
          borderColor: '#22c55e', // green-500
          pointBackgroundColor: '#22c55e',
          pointBorderColor: '#fff',
          pointHoverBackgroundColor: '#fff',
          pointHoverBorderColor: '#22c55e',
          tension: 0.4,
          fill: true,
        },
      ],
    });

    setLoading(false);
  }, [timePeriod]);
  
  useEffect(() => {
    const chart = chartRef.current;
    if (chart) {
      const newChartData = {
        ...chartData,
        datasets: chartData.datasets.map((dataset: any) => {
          let color = '#3b82f6'; // primary-500
          if (dataset.label.includes('Waste')) color = '#ef4444'; // red-500
          if (dataset.label.includes('Saved')) color = '#22c55e'; // green-500
          
          return {
            ...dataset,
            backgroundColor: createGradient(chart.ctx, chart.chartArea, color),
          };
        }),
      };
      setChartData(newChartData);
    }
  }, [chartData.labels]); // Re-run when labels change to get new chart area

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#475569',
          font: {
            size: 12,
          }
        }
      },
      title: {
        display: false,
      },
      tooltip: {
        backgroundColor: '#ffffff',
        titleColor: '#1e293b',
        bodyColor: '#475569',
        borderColor: '#e2e8f0',
        borderWidth: 1,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: '#e2e8f0',
        },
        ticks: {
          color: '#64748b',
        }
      },
      x: {
        grid: {
          display: false,
        },
        ticks: {
          color: '#64748b',
        }
      },
    },
  };

  return (
    <div className="card h-full">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-text-primary">Waste vs Saved Trends</h3>
        <select 
          value={timePeriod}
          onChange={(e) => setTimePeriod(Number(e.target.value))}
          className="input !h-9 !w-auto"
        >
          <option value={12}>Last 12 months</option>
          <option value={6}>Last 6 months</option>
          <option value={3}>Last 3 months</option>
        </select>
      </div>
      <div className="h-80">
        {loading ? (
          <div className="h-full w-full flex items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary-500 border-t-transparent"></div>
          </div>
        ) : (
          <Line ref={chartRef} data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default WasteChart;
