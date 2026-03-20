import { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { FaChartBar } from 'react-icons/fa';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

function AdminResults() {
  const [referendums, setReferendums] = useState([]);
  const [loading, setLoading] = useState(true);
  const [results, setResults] = useState({});

  useEffect(() => {
    loadReferendums();
  }, []);

  const loadReferendums = async () => {
    try {
      const response = await axios.get('/api/admin/referendums');
      setReferendums(response.data.referendums);
      
      // Load results for each referendum
      for (const ref of response.data.referendums) {
        loadResults(ref.referendum_id);
      }
    } catch (error) {
      console.error('Load referendums error:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadResults = async (refId) => {
    try {
      const response = await axios.get(`/api/admin/referendums/${refId}/results`);
      setResults((prev) => ({
        ...prev,
        [refId]: response.data.results
      }));
    } catch (error) {
      console.error('Load results error:', error);
    }
  };

  const getChartData = (refId) => {
    const refResults = results[refId] || [];
    const labels = refResults.map((r) => r.option_text);
    const data = refResults.map((r) => r.votes);
    
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
          All Referendum Results
        </h1>

        {referendums.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📊</div>
            <h3>No Referendums Available</h3>
            <p>Create referendums to view results</p>
          </div>
        ) : (
          <div className="grid grid-2">
            {referendums.map((referendum) => (
              <div key={referendum.referendum_id} className="card">
                <div className="flex-between mb-2">
                  <h3 className="card-title">Referendum #{referendum.referendum_id}</h3>
                  {referendum.status === 'open' ? (
                    <span className="badge badge-open">Open</span>
                  ) : (
                    <span className="badge badge-closed">Closed</span>
                  )}
                </div>
                <p style={{ color: 'var(--grey)', marginBottom: '1.5rem' }}>
                  {referendum.text}
                </p>
                {results[referendum.referendum_id] && (
                  <>
                    <div className="chart-container">
                      <Bar data={getChartData(referendum.referendum_id)} options={chartOptions} />
                    </div>
                    <div style={{ marginTop: '1rem' }}>
                      {results[referendum.referendum_id].map((result) => (
                        <div key={result.opt_id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 0', borderBottom: '1px solid #E5E7EB' }}>
                          <span>{result.option_text}</span>
                          <strong>{result.votes} votes</strong>
                        </div>
                      ))}
                      <div style={{ marginTop: '0.75rem', textAlign: 'right', color: 'var(--olive)', fontWeight: 600 }}>
                        Total: {referendum.total_votes} votes
                      </div>
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminResults;
