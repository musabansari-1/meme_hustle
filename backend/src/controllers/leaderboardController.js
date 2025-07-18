const supabase = require('../config/supabaseClient');

exports.getLeaderboardMemes = async (req, res) => {
  try {
    const top = parseInt(req.query.top) || 10;

    const { data, error } = await supabase
      .from('memes')
      .select('id, title, image_url, upvotes, owner_id')
      .order('upvotes', { ascending: false })
      .limit(top);

    if (error) {
      console.error('Error fetching leaderboard memes:', error.message);
      return res.status(500).json({ error: 'Failed to fetch leaderboard memes' });
    }

    res.status(200).json(data);
  } catch (error) {
    console.error('Error in getLeaderboardMemes controller:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
}; 