import React, { useState } from 'react';
import { Play, Plus, Trash2, Loader } from 'lucide-react';

export default function PublicDomainStreamer() {
  const [sources, setSources] = useState([
    { id: 1, name: 'Archive.org Movies', url: 'https://archive.org/details/movies' },
    { id: 2, name: 'Internet Archive Classics', url: 'https://archive.org/details/classicfilms' }
  ]);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedSource, setSelectedSource] = useState(null);
  const [currentVideo, setCurrentVideo] = useState(null);

  const addSource = () => {
    if (newUrl && newName) {
      setSources([...sources, { id: Date.now(), name: newName, url: newUrl }]);
      setNewUrl('');
      setNewName('');
    }
  };

  const removeSource = (id) => {
    setSources(sources.filter(s => s.id !== id));
  };

  const scrapeContent = async (sourceUrl) => {
    setLoading(true);
    try {
      const response = await fetch(`https://api.allorigins.win/get?url=${encodeURIComponent(sourceUrl)}`);
      const data = await response.json();
      const html = data.contents;

      // Parse video links - adjust selectors based on site structure
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      const videoLinks = [];
      
      // Look for common video patterns
      const links = doc.querySelectorAll('a[href*=".mp4"], a[href*=".webm"], a[href*=".ogv"]');
      links.forEach(link => {
        const href = link.getAttribute('href');
        const title = link.textContent.trim() || href.split('/').pop();
        if (href && !videoLinks.find(v => v.url === href)) {
          videoLinks.push({
            id: Math.random(),
            title: title.substring(0, 50),
            url: href.startsWith('http') ? href : new URL(href, sourceUrl).href
          });
        }
      });

      setVideos(videoLinks);
    } catch (error) {
      console.error('Error scraping:', error);
      setVideos([]);
    }
    setLoading(false);
  };

  const handleSourceSelect = (source) => {
    setSelectedSource(source);
    scrapeContent(source.url);
  };

  if (currentVideo) {
    return (
      <div className="w-full h-screen bg-black flex flex-col">
        <button
          onClick={() => setCurrentVideo(null)}
          className="absolute top-4 left-4 z-10 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-bold"
        >
          ← Back
        </button>
        <div className="flex-1 flex items-center justify-center">
          <video
            src={currentVideo.url}
            controls
            autoPlay
            className="w-full h-full max-w-4xl max-h-screen object-contain"
          />
        </div>
        <div className="bg-gray-900 text-white p-4">
          <h2 className="text-xl font-bold">{currentVideo.title}</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black text-white p-4">
      <h1 className="text-4xl font-bold mb-8">Public Domain Streamer</h1>

      {!selectedSource ? (
        <div className="max-w-4xl">
          <div className="bg-gray-800 rounded-lg p-6 mb-8">
            <h2 className="text-2xl font-bold mb-4">Add Source</h2>
            <input
              type="text"
              placeholder="Source name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded mb-3 placeholder-gray-400"
            />
            <input
              type="text"
              placeholder="Website URL"
              value={newUrl}
              onChange={(e) => setNewUrl(e.target.value)}
              className="w-full bg-gray-700 text-white p-3 rounded mb-3 placeholder-gray-400"
            />
            <button
              onClick={addSource}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded flex items-center justify-center gap-2"
            >
              <Plus size={20} /> Add Source
            </button>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Available Sources</h2>
            <div className="grid gap-3">
              {sources.map(source => (
                <div key={source.id} className="bg-gray-800 rounded-lg p-4 flex items-center justify-between hover:bg-gray-750">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{source.name}</h3>
                    <p className="text-gray-400 text-sm truncate">{source.url}</p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSourceSelect(source)}
                      className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded flex items-center gap-2"
                    >
                      <Play size={18} /> Browse
                    </button>
                    {source.id > 2 && (
                      <button
                        onClick={() => removeSource(source.id)}
                        className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                      >
                        <Trash2 size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-8 bg-blue-900 rounded-lg p-4">
            <h3 className="font-bold mb-2">Popular Public Domain Sources:</h3>
            <ul className="text-sm text-gray-300 space-y-1">
              <li>• Archive.org - Thousands of public domain films</li>
              <li>• Internet Archive - Classic movies and documentaries</li>
              <li>• Open Video Project - Educational content</li>
              <li>• Vimeo - Has public domain collections</li>
            </ul>
          </div>
        </div>
      ) : (
        <div>
          <button
            onClick={() => {
              setSelectedSource(null);
              setVideos([]);
            }}
            className="mb-6 bg-red-600 hover:bg-red-700 px-4 py-2 rounded text-white font-bold"
          >
            ← Back to Sources
          </button>

          <h2 className="text-2xl font-bold mb-4">{selectedSource.name}</h2>

          {loading && (
            <div className="flex items-center justify-center py-12">
              <Loader className="animate-spin" size={40} />
              <span className="ml-3 text-xl">Scanning for videos...</span>
            </div>
          )}

          {!loading && videos.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {videos.map(video => (
                <div
                  key={video.id}
                  onClick={() => setCurrentVideo(video)}
                  className="bg-gray-800 rounded-lg overflow-hidden hover:bg-gray-700 cursor-pointer transform hover:scale-105 transition"
                >
                  <div className="bg-gray-700 h-40 flex items-center justify-center">
                    <Play size={48} />
                  </div>
                  <div className="p-3">
                    <h3 className="font-bold truncate">{video.title}</h3>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentVideo(video);
                      }}
                      className="mt-2 w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-3 rounded text-sm"
                    >
                      Play
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && videos.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <p className="text-xl mb-4">No videos found</p>
              <p>Try adjusting the URL or check if the site structure matches expected patterns</p>
              <button
                onClick={() => scrapeContent(selectedSource.url)}
                className="mt-4 bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
