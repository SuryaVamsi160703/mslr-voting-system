import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import axios from 'axios';
import { FaEdit, FaPlus, FaTrash } from 'react-icons/fa';

function AdminEditReferendum() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [text, setText] = useState('');
  const [options, setOptions] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadReferendum();
  }, [id]);

  const loadReferendum = async () => {
    try {
      const response = await axios.get(`/api/referendums/${id}`);
      setText(response.data.referendum.text);
      setOptions(response.data.options.map((opt) => opt.option_text));
    } catch (error) {
      setError('Failed to load referendum');
    } finally {
      setLoading(false);
    }
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleRemoveOption = (index) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const validOptions = options.filter((opt) => opt.trim() !== '');

    if (validOptions.length < 2) {
      setError('Please provide at least 2 options');
      return;
    }

    setSubmitting(true);

    try {
      await axios.put(`/api/admin/referendums/${id}`, {
        text,
        options: validOptions
      });
      navigate('/admin/referendums');
    } catch (error) {
      setError(error.response?.data?.message || 'Failed to update referendum');
    } finally {
      setSubmitting(false);
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
        <div className="card" style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h1 style={{ fontSize: '2rem', color: 'var(--dark-green)', marginBottom: '2rem' }}>
            <FaEdit style={{ marginRight: '0.75rem' }} />
            Edit Referendum
          </h1>

          {error && (
            <div className="alert alert-error">
              <span>❌</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="text">Referendum Question</label>
              <textarea
                id="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Enter the referendum question..."
                required
                rows={4}
              />
            </div>

            <div className="form-group">
              <label>Options (minimum 2 required)</label>
              {options.map((option, index) => (
                <div key={index} style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <input
                    type="text"
                    value={option}
                    onChange={(e) => handleOptionChange(index, e.target.value)}
                    placeholder={`Option ${index + 1}`}
                    style={{ flex: 1 }}
                  />
                  {options.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveOption(index)}
                      className="btn btn-danger"
                    >
                      <FaTrash />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={handleAddOption}
                className="btn btn-secondary"
              >
                <FaPlus /> Add Option
              </button>
            </div>

            <div className="flex gap-2">
              <button type="submit" className="btn btn-primary" disabled={submitting}>
                {submitting ? 'Updating...' : 'Update Referendum'}
              </button>
              <button
                type="button"
                onClick={() => navigate('/admin/referendums')}
                className="btn btn-outline"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AdminEditReferendum;
