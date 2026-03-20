const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Import routes
const authRoutes = require('./routes/authRoutes');
const referendumRoutes = require('./routes/referendumRoutes');
const adminRoutes = require('./routes/adminRoutes');
const openDataRoutes = require('./routes/openDataRoutes');
const setupRoutes = require('./routes/setupRoutes');

// Import database
require('./config/database');

// Initialize express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Root route - API Information
app.get('/', (req, res) => {
  res.json({
    success: true,
    name: 'My Shangri-La Referendum (MSLR) API',
    version: '1.0.0',
    description: 'Backend API for MSLR voting platform',
    endpoints: {
      authentication: {
        register: 'POST /api/auth/register',
        login: 'POST /api/auth/login',
        profile: 'GET /api/auth/profile'
      },
      referendums: {
        list: 'GET /api/referendums',
        details: 'GET /api/referendums/:id',
        vote: 'POST /api/referendums/:id/vote'
      },
      admin: {
        dashboard: 'GET /api/admin/dashboard',
        create: 'POST /api/admin/referendums',
        update: 'PUT /api/admin/referendums/:id',
        delete: 'DELETE /api/admin/referendums/:id'
      },
      openData: {
        all: 'GET /mslr/referendums',
        byStatus: 'GET /mslr/referendums?status=open',
        single: 'GET /mslr/referendum/:id'
      }
    },
    health: '/health',
    timestamp: new Date().toISOString()
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    success: true, 
    message: 'MSLR API is running',
    timestamp: new Date().toISOString()
  });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/referendums', referendumRoutes);
app.use('/api/admin', adminRoutes);
app.use('/mslr', openDataRoutes);
app.use('/api/setup', setupRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    message: 'Route not found' 
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    success: false, 
    message: err.message || 'Internal server error' 
  });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🗳️  My Shangri-La Referendum (MSLR) Backend            ║
║                                                           ║
║   Server running on: http://localhost:${PORT}              ║
║   Environment: ${process.env.NODE_ENV || 'development'}                                 ║
║                                                           ║
║   API Endpoints:                                          ║
║   - Auth: /api/auth                                       ║
║   - Referendums: /api/referendums                         ║
║   - Admin: /api/admin                                     ║
║   - Open Data: /mslr                                      ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
