import React from 'react';
import { SILENT_YODHA_PROMPT } from '../constants';

interface ExamplePromptsProps {
  setPrompt: (prompt: string) => void;
}

const ExamplePrompts: React.FC<ExamplePromptsProps> = ({ setPrompt }) => {
  return (
    <div className="max-w-3xl mx-auto mt-8 text-center">
      <p className="text-gray-400 mb-3 text-sm">Or try an example:</p>
      <button
        onClick={() => setPrompt(SILENT_YODHA_PROMPT)}
        className="group w-full text-left p-4 bg-gray-900/50 border border-gray-700 rounded-2xl hover:bg-gray-800/70 hover:border-blue-600 transition-all duration-300 backdrop-blur-sm transform hover:scale-[1.02]"
      >
        <div className="flex items-center justify-between">
            <div>
                <h4 className="font-semibold text-white">🎬 The Silent Yodha - 90 Day Journey</h4>
                <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors">A moody, cinematic intro for a discipline challenge.</p>
            </div>
            <svg xmlns="http://www.w.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-gray-500 group-hover:text-blue-400 transition-all duration-300 transform group-hover:translate-x-1">
                 <path strokeLinecap="round" strokeLinejoin="round" d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            </svg>
        </div>
      </button>
    </div>
  );
};

export default ExamplePrompts;
