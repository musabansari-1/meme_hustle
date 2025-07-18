const supabase = require('../config/supabaseClient');
const { generateAICaption, generateAIVibe } = require('../utils/geminiClient');

exports.uploadMeme = async (req, res) => {
    try {
      const { title, image_url, tags } = req.body;
      const owner_id = '1f32f8c5-ad98-4420-a59c-1998e83d295f'; // hardcoded default user
  
      if (!title || !image_url) {
        return res.status(400).json({ error: 'Missing required fields' });
      }
  
      const tagsArray = Array.isArray(tags)
        ? tags
        : typeof tags === 'string'
          ? tags.split(',').map(t => t.trim())
          : [];
  
      const ai_caption = await generateAICaption(title, tagsArray);
      const ai_vibe = await generateAIVibe(title, tagsArray);
  
      const { data, error } = await supabase
        .from('memes')
        .insert([{
          title,
          image_url,
          tags: tagsArray,
          ai_caption,
          ai_vibe,
          owner_id,
          upvotes: 0,
        }]);
  
      if (error) throw error;
  
      res.status(201).json(data[0]);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };
  

exports.getAllMemes = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getSpecificMeme = async (req, res) => {
  try {
    const { id } = req.params;
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;

    if (!data) return res.status(404).json({ message: 'Meme not found' });

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMemesByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const { data, error } = await supabase
      .from('memes')
      .select('*')
      .eq('owner_id', userId)
      .order('created_at', { ascending: false });

    if (error) throw error;

    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
