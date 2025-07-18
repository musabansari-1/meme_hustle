// const supabase = require('../config/supabaseClient');

// // Create user profile
// exports.createProfile = async (req, res) => {
//   try {
//     const { id, username, bio, profile_pic, credits } = req.body;

//     const { data, error } = await supabase
//       .from('user_profiles')
//       .insert([{
//         id,
//         username,
//         bio,
//         profile_pic,
//         credits: credits ?? 100  // fallback to default
//       }]);

//     if (error) throw error;

//     res.status(201).json(data[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Get user profile by ID
// exports.getProfile = async (req, res) => {
//   try {
//     const { id } = req.params;

//     const { data, error } = await supabase
//       .from('user_profiles')
//       .select('*')
//       .eq('id', id)
//       .single();

//     if (error) throw error;
//     if (!data) return res.status(404).json({ message: 'User not found' });

//     res.status(200).json(data);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// // Update user profile
// exports.editProfile = async (req, res) => {
//   try {
//     const { id } = req.params;
//     const { username, bio, profile_pic, credits } = req.body;

//     const updateFields = {};
//     if (username !== undefined) updateFields.username = username;
//     if (bio !== undefined) updateFields.bio = bio;
//     if (profile_pic !== undefined) updateFields.profile_pic = profile_pic;
//     if (credits !== undefined) updateFields.credits = credits;

//     const { data, error } = await supabase
//       .from('user_profiles')
//       .update(updateFields)
//       .eq('id', id);

//     if (error) throw error;
//     if (!data || data.length === 0) return res.status(404).json({ message: 'User not found' });

//     res.status(200).json(data[0]);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };


const supabase = require('../config/supabaseClient');

// Ensures profile exists for the authenticated user
exports.ensureUserProfile = async (req, res) => {
  try {
    const user = req.user; // Comes from verifyUser middleware

    const { data: existing, error: fetchError } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    if (fetchError) throw fetchError;

    if (existing) {
      return res.status(200).json(existing); // Profile exists
    }

    const { data: newProfile, error: insertError } = await supabase
      .from('user_profiles')
      .insert([
        {
          id: user.id,
          username: user.user_metadata.name || user.email.split('@')[0],
          profile_pic: user.user_metadata.avatar_url || '',
          credits: 100,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    res.status(201).json(newProfile);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
