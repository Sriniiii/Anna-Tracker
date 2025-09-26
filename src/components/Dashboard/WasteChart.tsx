import React, { useState, useEffect } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../lib/supabaseClient';
import { subMonths, format, startOfMonth, endOfMonth } from 'date-fns';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend, Filler);

const WasteChart: React.FC = () => {
  const { user } = useAuth();
  const [chartData, setChartData] = useState<any>({ labels: [], datasets: [] });
  const [loading, setLoading] = useState(true);
  const [timePeriod, setTimePeriod] = useState(12);

  useEffect(() => {
    const fetchChartData = async () => {
      if (!user) return;
      setLoading(true);

      const labels = [];
      const wasteData = [];
      const savedData = [];

      for (let i = timePeriod - 1; i >= 0; i--) {
        const date = subMonths(new Date(), i);
        labels.push(format(date, 'MMM'));

        const startDate = startOfMonth(date).toISOString();
        const endDate = endOfMonth(date).toISOString();

        const { data: waste, error: wasteError } = await supabase
          .from('waste_logs')
          .select('quantity')
          .gte('created_at', startDate)
          .lte('created_at', endDate);
        
        const { data: saved, error: savedError } = await supabase
          .from('inventory_items')
          .select('quantity')
          .gte('created_at', startDate)
          .lte('created_at', endDate);

        const totalWaste = waste?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        const totalSaved = saved?.reduce((sum, item) => sum + item.quantity, 0) || 0;
        
        wasteData.push(totalWaste);
        savedData.push(totalSaved);
      }

      setChartData({
        labels,
        datasets: [
          {
            label: 'Waste Diverted (lbs)',
            data: wasteData,
            borderColor: '#ef4444',
            backgroundColor: 'rgba(239, 68, 68, 0.1)',
            tension: 0.4,
            fill: true,
          },
          {
            label: 'Food Saved (lbs)',
            data: savedData,
            borderColor: '#22c55e',
            backgroundColor: 'rgba(34, 197, 94, 0.1)',
            tension: 0.4,
            fill: true,
          },
        ],
      });

      setLoading(false);
    };

    fetchChartData();
  }, [user, timePeriod]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: false,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div className="card">
      <div className="mb-6 flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Waste vs Saved</h3>
        <select 
          value={timePeriod}
          onChange={(e) => setTimePeriod(Number(e.target.value))}
          className="rounded-lg border border-gray-300 px-3 py-1 text-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500"
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
          <Line data={chartData} options={options} />
        )}
      </div>
    </div>
  );
};

export default WasteChart;
