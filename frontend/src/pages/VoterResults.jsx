import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaChartBar } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function VoterResults() {
  const [referendums, setReferendums] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadResults();
  }, []);

  const loadResults = async () => {
    try {
      const response = await axios.get('/mslr/referendums?status=closed');
      if (response.data.Referendums) {
        setReferendums(response.data.Referendums);
      }
    } catch (error) {
      console.error('Load results error:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChartData = (referendum) => {
    const labels = referendum.referendum_options.options.map((opt) => {
      const key = Object.keys(opt).find(k => k !== 'votes');
      return opt[key];
    });
    
    const data = referendum.referendum_options.options.map((opt) => parseInt(opt.votes));
    
    return {
      labels,
      datasets: [
        {
          label: 'Votes',
          data,
          backgroundColor: ['#98D8C8', '#6B8E23', '#2D5016', '#B8C5D8'],
          borderColor: ['#7CC5B3', '#5A7A1C', '#1F3A0F', '#A0B0C0'],
          borderWidth: 2
        }
      ]
    };
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  };

  if (loading) {
    return (
      <div className="app-container">
        <Navbar />
        <div className="loading-spinner">
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-container">
      <Navbar />
      <div className="main-content">
        <h1 style={{ fontSize: '2rem', color: 'var(--dark-green)', marginBottom: '2rem' }}>
          <FaChartBar style={{ marginRight: '0.75rem' }} />
          Referendum Results
        </h1>

        {referendums.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No Results Available</h3>
            <p>Results will be displayed once referendums are closed</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {referendums.map((referendum) => (
              <div key={referendum.referendum_id} className="card">
                <h3 className="card-title">Referendum #{referendum.referendum_id}</h3>
                <p style={{ color: 'var(--grey)', marginBottom: '1.5rem' }}>
                  {referendum.referendum_title}
                </p>
                <div className="chart-container">
                  <Bar data={getChartData(referendum)} options={chartOptions} />
                </div>
                <div style={{ marginTop: '1rem' }}>
                  {referendum.referendum_options.options.map((opt) => {
                    const key = Object.keys(opt).find(k => k !== 'votes');
                    return (
                      <div key={opt[key]} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0' }}>
                        <span>{opt[key]}</span>
                        <strong>{opt.votes} votes</strong>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default VoterResults;
