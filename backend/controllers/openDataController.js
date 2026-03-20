const db = require('../config/database');

// Get referendums by status (open data)
const getOpenDataReferendums = async (req, res) => {
  try {
    const { status } = req.query;

    // status optional
    if (status && status !== 'open' && status !== 'closed') {
      return res.status(400).json({
        error: 'Status must be "open" or "closed" if provided.'
      });
    }

    let sql = 'SELECT referendum_id, text, status FROM referendum';
    const params = [];

    if (status) {
      sql += ' WHERE status = ?';
      params.push(status);
    }

    const [referendums] = await db.query(sql, params);

    const result = { Referendums: [] };

    for (const referendum of referendums) {
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
      `, [referendum.referendum_id]);

      const formattedOptions = options.map(opt => ({
        [opt.opt_id]: opt.option_text,
        votes: opt.votes.toString()
      }));

      result.Referendums.push({
        referendum_id: referendum.referendum_id.toString(),
        status: referendum.status,
        referendum_title: referendum.text,
        referendum_desc: "Referendum for Shangri-La residents",
        referendum_options: {
          options: formattedOptions
        }
      });
    }

    res.json(result);
  } catch (error) {
    console.error('Get open data referendums error:', error);
    res.status(500).json({
      error: 'Server error. Please try again later.'
    });
  }
};

// Get single referendum (open data)
const getOpenDataReferendum = async (req, res) => {
  try {
    const { id } = req.params;
    
    const [referendums] = await db.query(
      'SELECT referendum_id, text, status FROM referendum WHERE referendum_id = ?',
      [id]
    );
    
    if (referendums.length === 0) {
      return res.status(404).json({ 
        error: 'Referendum not found.' 
      });
    }
    
    const referendum = referendums[0];
    
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
    
    const formattedOptions = options.map(opt => ({
      [opt.opt_id]: opt.option_text,
      votes: opt.votes.toString()
    }));
    
    const result = {
      referendum_id: referendum.referendum_id.toString(),
      status: referendum.status,
      referendum_title: referendum.text,
      referendum_desc: "Referendum for Shangri-La residents",
      referendum_options: {
        options: formattedOptions
      }
    };
    
    res.json(result);
  } catch (error) {
    console.error('Get open data referendum error:', error);
    res.status(500).json({ 
      error: 'Server error. Please try again later.' 
    });
  }
};

module.exports = {
  getOpenDataReferendums,
  getOpenDataReferendum
};
