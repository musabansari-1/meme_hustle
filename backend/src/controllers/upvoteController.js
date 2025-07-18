const supabase = require('../config/supabaseClient');

exports.voteMeme = async (req, res) => {
  try {
    const { meme_id, user_id, type } = req.body;

    // Check if user already upvoted
    const { data: existing } = await supabase
      .from('upvotes')
      .select('*')
      .eq('meme_id', meme_id)
      .eq('user_id', user_id)
      .maybeSingle();

    if (type === 'up' && existing) {
      return res.status(400).json({ error: 'Already upvoted' });
    }

    let newCount = 0;

    if (type === 'up') {
      await supabase.from('upvotes').insert([{ meme_id, user_id }]);

      const { count } = await supabase
        .from('upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('meme_id', meme_id);

      newCount = count;

    } else if (type === 'down') {
      await supabase
        .from('upvotes')
        .delete()
        .eq('meme_id', meme_id)
        .eq('user_id', user_id);

      const { count } = await supabase
        .from('upvotes')
        .select('*', { count: 'exact', head: true })
        .eq('meme_id', meme_id);

      newCount = count;
    }

    // Emit socket update to all clients
    const io = req.app.get('io');
    io.emit('voteUpdate', { meme_id, newUpvoteCount: newCount });

    res.status(200).json({ meme_id, newUpvoteCount: newCount });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
