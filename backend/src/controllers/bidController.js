const supabase = require('../config/supabaseClient');

// Place a bid with real-time broadcast and username lookup
exports.placeBid = async (req, res) => {
  console.log('placeBid controller');
  // try {
    const { meme_id, user_id, credits } = req.body;

    // Insert the bid
    const { data: bidData, error: insertError } = await supabase
      .from('bids')
      .insert([{ meme_id, user_id, credits }])
      .select()
      .maybeSingle();

    console.log('bidData', bidData);
    console.log('insertError', insertError);
    if (insertError) throw insertError;

    // Fetch username from user_profiles
    const { data: userProfile, error: profileError } = await supabase
      .from('user_profiles')
      .select('username')
      .eq('id', user_id)
      .maybeSingle();

    console.log('profileError', profileError)

    if (profileError) throw profileError;

    const username = userProfile?.username || 'Unknown';

    // Emit real-time bid update
    const io = req.app.get('io');
    io.emit('bidUpdate', {
      meme_id,
      user_id,
      credits,
      username,
      message: `🤑 ${username} bid ${credits} credits!`,
    });

    console.log('bidData', bidData);

    res.status(201).json({
      success: true,
      bid: bidData,
      username,
    });
  // } catch (error) {
  //   res.status(500).json({ error: error.message });
  // }
};

