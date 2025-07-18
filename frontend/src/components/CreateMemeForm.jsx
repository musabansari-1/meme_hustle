import React, { useState } from 'react';
import axios from 'axios';
import { BASE_URL } from '../utils/constants';
import { generateMemeImage } from '../services/api'; // Will add this function

const CreateMemeForm = () => {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState(''); // For manual input
  const [tags, setTags] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [creationMode, setCreationMode] = useState('manual'); // 'manual' or 'ai'
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGeneratedImageUrl, setAiGeneratedImageUrl] = useState('');
  const [generatingImage, setGeneratingImage] = useState(false); // New state for loading

  const handleGenerateImage = async () => {
    setError('');
    setAiGeneratedImageUrl('');
    if (!aiPrompt) {
      setError('Please enter a prompt to generate a meme.');
      return;
    }
    setGeneratingImage(true);
    try {
      const response = await generateMemeImage(aiPrompt); // New API call
      if (response && response.imageUrl) {
        setAiGeneratedImageUrl(response.imageUrl);
        setSuccess('Image generated successfully! You can now add a title and tags.');
      } else {
        setError('Failed to generate image. Please try again with a different prompt.');
      }
    } catch (err) {
      console.error('Error generating image:', err);
      setError('Failed to generate image. Please try again.');
    } finally {
      setGeneratingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    let finalImageUrl = imageUrl;
    if (creationMode === 'ai') {
      finalImageUrl = aiGeneratedImageUrl;
    }

    if (!title || !finalImageUrl || !tags) {
      setError('All fields are required.');
      return;
    }

    const memeData = {
      title,
      image_url: finalImageUrl,
      tags: tags.split(',').map(tag => tag.trim()),
      upvotes: 0,
      caption: '',
      vibe: '',
      highestBid: 0,
    };

    try {
      const response = await axios.post(`${BASE_URL}/api/memes`, memeData);
      setSuccess('Meme created successfully!');
      setTitle('');
      setImageUrl('');
      setTags('');
      setAiPrompt('');
      setAiGeneratedImageUrl('');
      console.log('Meme created:', response.data);
    } catch (err) {
      console.error('Error creating meme:', err);
      setError('Failed to create meme. Please try again.');
    }
  };

  return (
    <div className="bg-black p-6 rounded-lg border-2 border-neon-purple shadow-neon-purple-glow max-w-lg mx-auto my-8">
      <h2 className="text-3xl font-orbitron text-neon-pink text-center mb-6 animate-pulse">Create New Meme</h2>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => { setCreationMode('manual'); setError(''); setSuccess(''); }}
          className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
            creationMode === 'manual' ? 'bg-neon-blue text-black shadow-neon-blue-glow' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          Manual Upload
        </button>
        <button
          onClick={() => { setCreationMode('ai'); setError(''); setSuccess(''); }}
          className={`px-6 py-2 rounded-lg font-bold transition-all duration-300 ${
            creationMode === 'ai' ? 'bg-neon-blue text-black shadow-neon-blue-glow' : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
          }`}
        >
          AI Generate
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {creationMode === 'manual' ? (
          <div>
            <label htmlFor="imageUrl" className="block text-neon-blue text-sm font-bold mb-1">Image URL</label>
            <input
              type="text"
              id="imageUrl"
              className="w-full p-2 rounded bg-zinc-900 border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-pink text-white font-mono placeholder-zinc-500 transition-all duration-200"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="Enter image URL"
            />
            {imageUrl && ( // Live image preview
              <div className="mt-4 p-2 border-2 border-neon-green rounded-lg bg-zinc-800">
                <p className="text-neon-green text-sm mb-2">Image Preview:</p>
                <img src={imageUrl} alt="Meme Preview" className="w-full max-h-48 object-contain rounded" />
              </div>
            )}
          </div>
        ) : ( // AI mode
          <div>
            <label htmlFor="aiPrompt" className="block text-neon-blue text-sm font-bold mb-1">AI Prompt</label>
            <textarea
              id="aiPrompt"
              className="w-full p-2 rounded bg-zinc-900 border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-pink text-white font-mono placeholder-zinc-500 transition-all duration-200 h-24"
              value={aiPrompt}
              onChange={(e) => setAiPrompt(e.target.value)}
              placeholder="Describe the meme image you want to generate (e.g., 'A grumpy cat wearing a tiny hat, looking at a spreadsheet')."
            ></textarea>
            <button
              type="button"
              onClick={handleGenerateImage}
              disabled={generatingImage}
              className="mt-4 w-full py-2 bg-neon-green text-black font-bold rounded-lg shadow-neon-green-glow hover:shadow-neon-pink-glow animate-flicker-slow transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
            >
              <span className="relative z-10">{generatingImage ? 'Generating...' : 'Generate Image with AI'}</span>
              <span className="absolute top-0 left-0 w-full h-full bg-neon-pink opacity-0 animate-glitch-overlay-btn"></span>
            </button>
            {generatingImage && (
              <div className="mt-4 flex justify-center items-center">
                <p className="text-[#00FFFF] text-sm font-mono animate-terminal-type border-l-4 border-neon-green pl-4">
                  Generating image...
                </p>
              </div>
            )}
            {aiGeneratedImageUrl && (
              <div className="mt-4 p-2 border-2 border-neon-green rounded-lg bg-zinc-800">
                <p className="text-neon-green text-sm mb-2">AI Generated Image Preview:</p>
                <img src={aiGeneratedImageUrl} alt="AI Meme Preview" className="w-full max-h-48 object-contain rounded" />
              </div>
            )}
          </div>
        )}

        {/* Title and Tags remain common */}
        <div>
          <label htmlFor="title" className="block text-neon-blue text-sm font-bold mb-1">Meme Title</label>
          <input
            type="text"
            id="title"
            className="w-full p-2 rounded bg-zinc-900 border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-pink text-white font-mono placeholder-zinc-500 transition-all duration-200"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter meme title"
          />
        </div>

        <div>
          <label htmlFor="tags" className="block text-neon-blue text-sm font-bold mb-1">Tags (comma-separated)</label>
          <input
            type="text"
            id="tags"
            className="w-full p-2 rounded bg-zinc-900 border border-neon-blue focus:outline-none focus:ring-2 focus:ring-neon-pink text-white font-mono placeholder-zinc-500 transition-all duration-200"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., funny, dank, reaction"
          />
        </div>

        {error && <p className="text-red-500 text-sm animate-flicker">{error}</p>}
        {success && <p className="text-neon-green text-sm animate-pulse">{success}</p>}

        <button
          type="submit"
          className="w-full py-2 bg-neon-purple text-black font-bold rounded-lg shadow-neon-purple-glow hover:shadow-neon-pink-glow animate-flicker-slow transition-all duration-300 transform hover:scale-105 relative overflow-hidden"
        >
          <span className="relative z-10">Create Meme</span>
          <span className="absolute top-0 left-0 w-full h-full bg-neon-pink opacity-0 animate-glitch-overlay-btn"></span>
        </button>
      </form>
    </div>
  );
};

export default CreateMemeForm; 