import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FaVoteYea, FaEnvelope, FaUser, FaCalendar, FaLock, FaIdCard, FaCamera, FaUpload, FaTimes } from 'react-icons/fa';
import { Html5Qrcode } from 'html5-qrcode';

function VoterRegister() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    dob: '',
    password: '',
    confirmPassword: '',
    scc: ''
  });

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const [cameraScanning, setCameraScanning] = useState(false);
  const [startingCamera, setStartingCamera] = useState(false);

  const html5QrCodeRef = useRef(null);
  const lastScannedRef = useRef(''); // prevents duplicate callbacks spamming

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);

    const result = await register({
      email: formData.email,
      name: formData.name,
      dob: formData.dob,
      password: formData.password,
      scc: formData.scc
    });

    if (result.success) {
      setSuccess(result.message);
      setTimeout(() => navigate('/voter/login'), 2000);
    } else {
      setError(result.message);
    }

    setLoading(false);
  };

  // Button handler: just flips state so the DOM renders the container first
  const startCameraScanning = () => {
    setError('');
    setSuccess('');
    setCameraScanning(true);
  };

  const stopCameraScanning = async () => {
    setStartingCamera(false);
    setCameraScanning(false);

    if (html5QrCodeRef.current) {
      try {
        await html5QrCodeRef.current.stop();
      } catch (_) {
        // ignore stop errors
      }
      try {
        await html5QrCodeRef.current.clear();
      } catch (_) {
        // ignore clear errors
      }
      html5QrCodeRef.current = null;
    }
  };

  // Start/stop scanner when cameraScanning changes
  useEffect(() => {
    let cancelled = false;

    const start = async () => {
      if (!cameraScanning) return;

      setStartingCamera(true);

      try {
        // Basic support check
        if (!navigator.mediaDevices?.getUserMedia) {
          throw new Error('Camera not supported in this browser.');
        }

        // IMPORTANT: the div with id="qr-reader" must exist now (it will, because cameraScanning=true renders it)
        const qr = new Html5Qrcode('qr-reader');
        html5QrCodeRef.current = qr;

        const config = {
          fps: 10,
          qrbox: { width: 250, height: 250 },
          rememberLastUsedCamera: true,
        };

        const onSuccess = async (decodedText) => {
          if (cancelled) return;

          // prevent repeated firing for same QR held in front of camera
          if (decodedText === lastScannedRef.current) return;
          lastScannedRef.current = decodedText;

          setFormData((prev) => ({ ...prev, scc: decodedText }));
          setSuccess('✅ SCC code scanned successfully: ' + decodedText);
          await stopCameraScanning();
        };

        // Try back camera first, then fallback
        try {
          await qr.start(
            { facingMode: { exact: 'environment' } },
            config,
            onSuccess,
            () => {}
          );
        } catch (_) {
          await qr.start(
            { facingMode: 'environment' },
            config,
            onSuccess,
            () => {}
          );
        }

        if (!cancelled) setStartingCamera(false);
      } catch (err) {
        console.error('Camera start error:', err);

        let msg = 'Failed to start camera. ';
        const name = err?.name || '';
        const text = String(err?.message || err);

        if (name === 'NotAllowedError' || /permission|denied/i.test(text)) {
          msg += 'Please allow camera access in your browser settings.';
        } else if (name === 'NotFoundError' || /no.*camera/i.test(text)) {
          msg += 'No camera found on this device.';
        } else if (/not supported/i.test(text)) {
          msg += 'Camera not supported in this browser.';
        } else if (/secure context|https/i.test(text)) {
          msg += 'Camera requires HTTPS (or localhost).';
        } else {
          msg += 'Try uploading a QR image instead.';
        }

        setError(msg);
        setStartingCamera(false);
        setCameraScanning(false);
      }
    };

    start();

    return () => {
      cancelled = true;
      // Cleanup if user navigates away mid-scan
      if (html5QrCodeRef.current) {
        html5QrCodeRef.current.stop().catch(() => {});
        html5QrCodeRef.current.clear().catch(() => {});
        html5QrCodeRef.current = null;
      }
    };
  }, [cameraScanning]);

  const handleQRUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setSuccess('');

    const scanner = new Html5Qrcode('qr-reader-upload');
    scanner
      .scanFile(file, true)
      .then((decodedText) => {
        setFormData((prev) => ({ ...prev, scc: decodedText }));
        setSuccess('✅ SCC code scanned successfully from image: ' + decodedText);
      })
      .catch(() => {
        setError('Failed to scan QR code from image. Please try another image or enter manually.');
      });
  };

  return (
    <div className="split-layout">
      <div className="split-left">
        <div className="branding">
          <div className="branding-icon">
            <FaVoteYea />
          </div>
          <h1>Register to Vote</h1>
          <p>
            <strong>Eligibility:</strong> All Shangri-La residents aged 18 or above
          </p>
        </div>
      </div>

      <div className="split-right">
        <div className="form-container">
          <div className="form-header">
            <h2>Voter Registration</h2>
            <p>Join the electoral register</p>
          </div>

          {error && (
            <div className="alert alert-error">
              <span>❌</span>
              {error}
            </div>
          )}

          {success && (
            <div className="alert alert-success">
              <span>✅</span>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* Email */}
            <div className="form-group">
              <label htmlFor="email">
                <FaEnvelope style={{ marginRight: '0.5rem' }} />
                Email Address
              </label>
              <input type="email" id="email" name="email" value={formData.email} onChange={handleChange} required />
            </div>

            {/* Name */}
            <div className="form-group">
              <label htmlFor="name">
                <FaUser style={{ marginRight: '0.5rem' }} />
                Full Name
              </label>
              <input type="text" id="name" name="name" value={formData.name} onChange={handleChange} required />
            </div>

            {/* DOB */}
            <div className="form-group">
              <label htmlFor="dob">
                <FaCalendar style={{ marginRight: '0.5rem' }} />
                Date of Birth
              </label>
              <input type="date" id="dob" name="dob" value={formData.dob} onChange={handleChange} required />
            </div>

            {/* SCC */}
            <div className="form-group">
              <label htmlFor="scc">
                <FaIdCard style={{ marginRight: '0.5rem' }} />
                Shangri-La Citizen Code (SCC)
              </label>
              <input type="text" id="scc" name="scc" value={formData.scc} onChange={handleChange} required />

              <div style={{ marginTop: '1rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                {!cameraScanning ? (
                  <>
                    <button type="button" onClick={startCameraScanning} className="btn btn-secondary">
                      <FaCamera style={{ marginRight: '0.5rem' }} />
                      Scan QR Code
                    </button>

                    <label htmlFor="qr-upload" className="btn btn-outline">
                      <FaUpload style={{ marginRight: '0.5rem' }} />
                      Upload QR Image
                    </label>
                    <input
                      type="file"
                      id="qr-upload"
                      accept="image/*"
                      onChange={handleQRUpload}
                      style={{ display: 'none' }}
                    />
                  </>
                ) : (
                  <button type="button" onClick={stopCameraScanning} className="btn btn-danger">
                    <FaTimes style={{ marginRight: '0.5rem' }} />
                    Stop Scanning
                  </button>
                )}
              </div>

              {cameraScanning && (
                <div style={{ marginTop: '1rem' }}>
                  {startingCamera && <div style={{ marginBottom: '0.5rem' }}>Opening camera…</div>}
                  <div id="qr-reader" style={{ width: '100%' }} />
                </div>
              )}

              <div id="qr-reader-upload" style={{ display: 'none' }} />
            </div>

            {/* Password */}
            <div className="form-group">
              <label htmlFor="password">
                <FaLock style={{ marginRight: '0.5rem' }} />
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            {/* Confirm */}
            <div className="form-group">
              <label htmlFor="confirmPassword">
                <FaLock style={{ marginRight: '0.5rem' }} />
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary btn-full" disabled={loading}>
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>

          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <p>
              Already have an account? <Link to="/voter/login">Sign in here</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VoterRegister;
