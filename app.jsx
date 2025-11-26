import React, { useState } from 'react';
import { Play, Plus, Trash2, Search, Settings } from 'lucide-react';

export default function PlexClone() {
  const [channels, setChannels] = useState([]);
  const [newUrl, setNewUrl] = useState('');
  const [newName, setNewName] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);

  const addChannel = () => {
    if (newUrl.trim() && newName.trim()) {
      const channel = {
        id: Date.now(),
        name: newName,
        url: newUrl,
        thumbnail: `https://via.placeholder.com/200x300?text=${encodeURIComponent(newName)}`
      };
      setChannels([...channels, channel]);
      setNewUrl('');
      setNewName('');
      setShowAddForm(false);
    }
  };

  const removeChannel = (id) => {
    setChannels(channels.filter(ch => ch.id !== id));
    if (selectedChannel?.id === id) {
      setSelectedChannel(null);
    }
  };

  const filteredChannels = channels.filter(ch =>
    ch.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black">
      {/* Header */}
      <div className="bg-black/50 backdrop-blur border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-red-500 to-red-600 rounded-lg flex items-center justify-center">
              <Play className="w-6 h-6 text-white fill-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">MediaStream</h1>
          </div>
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Plus className="w-5 h-5" />
            Add Channel
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Add Channel Form */}
        {showAddForm && (
          <div className="bg-gray-800 rounded-lg p-6 mb-8 border border-gray-700">
            <h2 className="text-xl font-semibold text-white mb-4">Add New Channel</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  Channel Name
                </label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g., HBO, Netflix, Sports"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">
                  IPTV URL / Stream URL
                </label>
                <input
                  type="text"
                  value={newUrl}
                  onChange={(e) => setNewUrl(e.target.value)}
                  placeholder="https://example.com/stream.m3u8 or http://iptv.provider/stream"
                  className="w-full bg-gray-700 text-white px-4 py-2 rounded-lg border border-gray-600 focus:border-red-500 focus:outline-none"
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={addChannel}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition font-medium"
                >
                  Add Channel
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Search Bar */}
        {channels.length > 0 && (
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search channels..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-gray-800 text-white pl-10 pr-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none"
              />
            </div>
          </div>
        )}

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Channel Grid */}
          <div className="lg:col-span-3">
            {filteredChannels.length === 0 ? (
              <div className="text-center py-16">
                <Play className="w-16 h-16 text-gray-700 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-300 mb-2">
                  {channels.length === 0 ? 'No channels yet' : 'No results found'}
                </h3>
                <p className="text-gray-400">
                  {channels.length === 0
                    ? 'Add your first IPTV URL to get started'
                    : 'Try a different search term'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {filteredChannels.map((channel) => (
                  <div
                    key={channel.id}
                    className="group cursor-pointer"
                    onClick={() => setSelectedChannel(channel)}
                  >
                    <div className="relative rounded-lg overflow-hidden bg-gray-800 aspect-video flex items-center justify-center border border-gray-700 group-hover:border-red-500 transition">
                      <img
                        src={channel.thumbnail}
                        alt={channel.name}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                        <Play className="w-12 h-12 text-white fill-white" />
                      </div>
                    </div>
                    <h3 className="text-sm font-medium text-gray-200 mt-2 truncate">
                      {channel.name}
                    </h3>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Player / Details Sidebar */}
          <div className="lg:col-span-1">
            {selectedChannel ? (
              <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 sticky top-4">
                <div className="aspect-video bg-black rounded-lg mb-4 flex items-center justify-center overflow-hidden">
                  <video
                    key={selectedChannel.id}
                    controls
                    className="w-full h-full"
                    src={selectedChannel.url}
                  />
                </div>
                <h2 className="text-lg font-semibold text-white mb-2">
                  {selectedChannel.name}
                </h2>
                <p className="text-xs text-gray-400 mb-4 break-all">
                  {selectedChannel.url}
                </p>
                <button
                  onClick={() => removeChannel(selectedChannel.id)}
                  className="w-full flex items-center justify-center gap-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 px-4 py-2 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                  Remove
                </button>
              </div>
            ) : (
              <div className="bg-gray-800 rounded-lg p-6 border border-gray-700 text-center">
                <Settings className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-sm">
                  Select a channel to play
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
