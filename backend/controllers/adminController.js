const db = require('../config/database');

// Create referendum
const createReferendum = async (req, res) => {
  try {
    const { text, options } = req.body;
    
    if (!text || !options || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ 
        success: false, 
        message: 'Referendum text and at least 2 options are required.' 
      });
    }
    
    // Insert referendum
    const [result] = await db.query(
      'INSERT INTO referendum (text, status, created_at, updated_at) VALUES (?, "closed", NOW(), NOW())',
      [text]
    );
    
    const referendumId = result.insertId;
    
    // Insert options
    for (const optionText of options) {
      await db.query(
        'INSERT INTO referendum_options (referendum_id, option_text) VALUES (?, ?)',
        [referendumId, optionText]
      );
    }
    
    res.status(201).json({ 
      success: true, 
      message: 'Referendum created successfully.',
      referendum_id: referendumId
    });
  } catch (error) {
    console.error('Create referendum error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Update referendum (only if not opened yet)
const updateReferendum = async (req, res) => {
  try {
    const { id } = req.params;
    const { text, options } = req.body;
    
    // Check if referendum has been opened
    const [referendums] = await db.query(
      'SELECT * FROM referendum WHERE referendum_id = ?',
      [id]
    );
    
    if (referendums.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Referendum not found.' 
      });
    }
    
    // Check if referendum has any votes
    const [votes] = await db.query(
      'SELECT COUNT(*) as count FROM voter_history WHERE referendum_id = ?',
      [id]
    );
    
    if (votes[0].count > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot edit referendum that has received votes.' 
      });
    }
    
    // Update referendum text
    if (text) {
      await db.query(
        'UPDATE referendum SET text = ?, updated_at = NOW() WHERE referendum_id = ?',
        [text, id]
      );
    }
    
    // Update options if provided
    if (options && Array.isArray(options) && options.length >= 2) {
      // Delete old options
      await db.query(
        'DELETE FROM referendum_options WHERE referendum_id = ?',
        [id]
      );
      
      // Insert new options
      for (const optionText of options) {
        await db.query(
          'INSERT INTO referendum_options (referendum_id, option_text) VALUES (?, ?)',
          [id, optionText]
        );
      }
    }
    
    res.json({ 
      success: true, 
      message: 'Referendum updated successfully.' 
    });
  } catch (error) {
    console.error('Update referendum error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Open referendum
const openReferendum = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [referendums] = await db.query(
      'SELECT * FROM referendum WHERE referendum_id = ?',
      [id]
    );
    
    if (referendums.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Referendum not found.' 
      });
    }
    
    if (referendums[0].status === 'open') {
      return res.status(400).json({ 
        success: false, 
        message: 'Referendum is already open.' 
      });
    }
    
    await db.query(
      'UPDATE referendum SET status = "open", updated_at = NOW() WHERE referendum_id = ?',
      [id]
    );
    
    res.json({ 
      success: true, 
      message: 'Referendum opened successfully.' 
    });
  } catch (error) {
    console.error('Open referendum error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Close referendum
const closeReferendum = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [referendums] = await db.query(
      'SELECT * FROM referendum WHERE referendum_id = ?',
      [id]
    );
    
    if (referendums.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Referendum not found.' 
      });
    }
    
    if (referendums[0].status === 'closed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Referendum is already closed.' 
      });
    }
    
    await db.query(
      'UPDATE referendum SET status = "closed", updated_at = NOW() WHERE referendum_id = ?',
      [id]
    );
    
    res.json({ 
      success: true, 
      message: 'Referendum closed successfully.' 
    });
  } catch (error) {
    console.error('Close referendum error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Get referendum results
const getReferendumResults = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [referendums] = await db.query(
      'SELECT * FROM referendum WHERE referendum_id = ?',
      [id]
    );
    
    if (referendums.length === 0) {
      return res.status(404).json({ 
        success: false, 
        message: 'Referendum not found.' 
      });
    }
    
    const [options] = await db.query(`
      SELECT 
        ro.opt_id,
        ro.option_text,
        COUNT(vh.voted_option_id) as votes
      FROM referendum_options ro
      LEFT JOIN voter_history vh ON ro.opt_id = vh.voted_option_id
      WHERE ro.referendum_id = ?
      GROUP BY ro.opt_id, ro.option_text
      ORDER BY ro.opt_id
    `, [id]);
    
    res.json({ 
      success: true, 
      referendum: referendums[0],
      results: options
    });
  } catch (error) {
    console.error('Get referendum results error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Get dashboard statistics
const getDashboardStats = async (req, res) => {
  try {
    const [totalReferendums] = await db.query(
      'SELECT COUNT(*) as count FROM referendum'
    );
    
    const [openReferendums] = await db.query(
      'SELECT COUNT(*) as count FROM referendum WHERE status = "open"'
    );
    
    const [closedReferendums] = await db.query(
      'SELECT COUNT(*) as count FROM referendum WHERE status = "closed"'
    );
    
    const [totalVotes] = await db.query(
      'SELECT COUNT(*) as count FROM voter_history'
    );
    
    const [totalVoters] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "VOTER"'
    );
    
    res.json({ 
      success: true, 
      stats: {
        totalReferendums: totalReferendums[0].count,
        openReferendums: openReferendums[0].count,
        closedReferendums: closedReferendums[0].count,
        totalVotes: totalVotes[0].count,
        totalVoters: totalVoters[0].count
      }
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Get all referendums with vote counts
const getAllReferendumsWithResults = async (req, res) => {
  try {
    const [referendums] = await db.query(`
      SELECT 
        r.referendum_id,
        r.text,
        r.status,
        r.created_at,
        r.updated_at,
        COUNT(DISTINCT vh.voter_email) as total_votes
      FROM referendum r
      LEFT JOIN voter_history vh ON r.referendum_id = vh.referendum_id
      GROUP BY r.referendum_id, r.text, r.status, r.created_at, r.updated_at
      ORDER BY r.created_at DESC
    `);
    
    res.json({ 
      success: true, 
      referendums 
    });
  } catch (error) {
    console.error('Get all referendums with results error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

module.exports = {
  createReferendum,
  updateReferendum,
  openReferendum,
  closeReferendum,
  getReferendumResults,
  getDashboardStats,
  getAllReferendumsWithResults
};
