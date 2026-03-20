const db = require('../config/database');

// Get all referendums (with optional status filter)
const getReferendums = async (req, res) => {
  try {
    const { status } = req.query;
    
    let query = `
      SELECT r.referendum_id, r.text, r.status, r.created_at, r.updated_at
      FROM referendum r
    `;
    
    const params = [];
    
    if (status) {
      query += ' WHERE r.status = ?';
      params.push(status);
    }
    
    query += ' ORDER BY r.created_at DESC';
    
    const [referendums] = await db.query(query, params);
    
    res.json({ 
      success: true, 
      referendums 
    });
  } catch (error) {
    console.error('Get referendums error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Get single referendum with options
const getReferendum = async (req, res) => {
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
    
    const [options] = await db.query(
      'SELECT opt_id, option_text FROM referendum_options WHERE referendum_id = ?',
      [id]
    );
    
    res.json({ 
      success: true, 
      referendum: referendums[0],
      options 
    });
  } catch (error) {
    console.error('Get referendum error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Get user's vote for a referendum
const getMyVote = async (req, res) => {
  try {
    const { id } = req.params;
    const userEmail = req.user.email;
    
    const [votes] = await db.query(
      'SELECT * FROM voter_history WHERE voter_email = ? AND referendum_id = ?',
      [userEmail, id]
    );
    
    if (votes.length === 0) {
      return res.json({ 
        success: true, 
        hasVoted: false 
      });
    }
    
    res.json({ 
      success: true, 
      hasVoted: true,
      vote: votes[0]
    });
  } catch (error) {
    console.error('Get my vote error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Cast vote
const castVote = async (req, res) => {
  try {
    const { id } = req.params;
    const { optionId } = req.body;
    const userEmail = req.user.email;
    
    if (!optionId) {
      return res.status(400).json({ 
        success: false, 
        message: 'Option ID is required.' 
      });
    }
    
    // Check if referendum exists and is open
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
    
    if (referendums[0].status !== 'open') {
      return res.status(400).json({ 
        success: false, 
        message: 'This referendum is not open for voting.' 
      });
    }
    
    // Check if option exists for this referendum
    const [options] = await db.query(
      'SELECT * FROM referendum_options WHERE opt_id = ? AND referendum_id = ?',
      [optionId, id]
    );
    
    if (options.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid option for this referendum.' 
      });
    }
    
    // Check if user has already voted
    const [existingVotes] = await db.query(
      'SELECT * FROM voter_history WHERE voter_email = ? AND referendum_id = ?',
      [userEmail, id]
    );
    
    if (existingVotes.length > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already voted in this referendum.' 
      });
    }
    
    // Record vote
    await db.query(
      'INSERT INTO voter_history (voter_email, referendum_id, voted_option_id) VALUES (?, ?, ?)',
      [userEmail, id, optionId]
    );
    
    // Check if 50% threshold reached for auto-close
    const [totalVoters] = await db.query(
      'SELECT COUNT(*) as count FROM users WHERE role = "VOTER"'
    );
    
    const [optionVotes] = await db.query(
      'SELECT COUNT(*) as count FROM voter_history WHERE referendum_id = ? AND voted_option_id = ?',
      [id, optionId]
    );
    
    const threshold = Math.ceil(totalVoters[0].count * 0.5);
    
    if (optionVotes[0].count >= threshold) {
      await db.query(
        'UPDATE referendum SET status = "closed", updated_at = NOW() WHERE referendum_id = ?',
        [id]
      );
    }
    
    res.json({ 
      success: true, 
      message: 'Your vote has been recorded successfully.' 
    });
  } catch (error) {
    console.error('Cast vote error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

// Get all referendums with user's voting status
const getReferendumsWithVoteStatus = async (req, res) => {
  try {
    const userEmail = req.user.email;
    
    const [referendums] = await db.query(`
      SELECT 
        r.referendum_id, 
        r.text, 
        r.status, 
        r.created_at,
        r.updated_at,
        CASE WHEN vh.voter_email IS NOT NULL THEN 1 ELSE 0 END as has_voted,
        vh.voted_option_id
      FROM referendum r
      LEFT JOIN voter_history vh ON r.referendum_id = vh.referendum_id AND vh.voter_email = ?
      ORDER BY r.created_at DESC
    `, [userEmail]);
    
    res.json({ 
      success: true, 
      referendums 
    });
  } catch (error) {
    console.error('Get referendums with vote status error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error. Please try again later.' 
    });
  }
};

module.exports = {
  getReferendums,
  getReferendum,
  getMyVote,
  castVote,
  getReferendumsWithVoteStatus
};
