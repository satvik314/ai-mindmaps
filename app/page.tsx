'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Brain } from 'lucide-react';
import MindMap from './components/MindMap';

export default function Page() {
  const [topic, setTopic] = useState('');
  const [mindmapData, setMindmapData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTopic(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!topic.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/generate-mindmap', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          `Server error (${response.status}): ${errorData.error || response.statusText}`
        );
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error || 'An error occurred while generating the mindmap.');
      }
      
      console.log('Received mindmap data:', data);
      setMindmapData(data);
    } catch (error) {
      console.error('Error generating mindmap:', error);
      setError(
        `${(error as Error).message}\n\nPlease check your server logs for more details.`
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 to-purple-100 text-gray-900">
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        <motion.div
          className="relative"
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-5xl font-extrabold text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-600">
            Mindmap Generator
          </h1>
          <motion.div
            className="absolute -top-10 -left-10 w-20 bg-blue-200 rounded-full opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 5,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-16 h-16 bg-purple-200 rounded-full opacity-50"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 7,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.div>
        
        <motion.form 
          onSubmit={handleSubmit}
          className="flex items-center justify-center space-x-4 relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <input
            type="text"
            value={topic}
            onChange={handleInputChange}
            placeholder="Enter a topic for your mindmap"
            className="flex-grow text-lg p-4 rounded-full border-2 border-blue-400 focus:border-purple-600 focus:ring-2 focus:ring-purple-600 shadow-lg"
          />
          <button 
            type="submit" 
            disabled={isLoading} 
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white rounded-full p-4 flex items-center shadow-lg transform hover:scale-105 transition-transform duration-200"
          >
            {isLoading ? 'Generating...' : <><Sparkles className="mr-2" /> Generate</>}
          </button>
          <motion.div
            className="absolute -z-10 w-full h-full bg-gradient-to-r from-blue-300 to-purple-300 rounded-full filter blur-xl opacity-30"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
        </motion.form>
        
        {error && (
          <motion.div 
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg relative shadow-md"
            role="alert"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline whitespace-pre-line">{error}</span>
            <p className="mt-2">
              Troubleshooting steps:
              <ol className="list-decimal list-inside ml-4">
                <li>Check your server logs for more detailed error information.</li>
                <li>Ensure your API route (/api/generate-mindmap) is correctly implemented.</li>
                <li>Verify that all required dependencies are installed and up-to-date.</li>
                <li>Check for any environment variables or configuration issues.</li>
              </ol>
            </p>
          </motion.div>
        )}
        
        <motion.div 
          className="mindmap-container border-4 border-blue-400 rounded-2xl p-8 bg-white shadow-2xl relative overflow-hidden"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <motion.div
            className="absolute -top-10 -left-10 w-40 h-40 bg-blue-100 rounded-full opacity-50"
            animate={{
              scale: [1, 1.2, 1],
              rotate: [0, 180, 360],
            }}
            transition={{
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div
            className="absolute -bottom-10 -right-10 w-32 h-32 bg-purple-100 rounded-full opacity-50"
            animate={{
              scale: [1, 1.3, 1],
              rotate: [0, -180, -360],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          {isLoading ? (
            <div className="text-center relative z-10">
              <motion.div
                animate={{
                  rotate: 360,
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <Brain size={48} className="text-blue-500 mx-auto" />
              </motion.div>
              <p className="mt-2 text-lg font-semibold">Your mindmap is cooking...</p>
            </div>
          ) : mindmapData ? (
            <MindMap data={mindmapData} />
          ) : (
            <p className="text-center text-gray-500 relative z-10">Enter a topic and click &quot;Generate&quot; to create a mindmap.</p>
          )}
        </motion.div>
      </div>
    </div>
  );
}