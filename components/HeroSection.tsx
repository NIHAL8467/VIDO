import React from 'react';
import ExamplePrompts from './ExamplePrompts';

interface HeroSectionProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
  onGenerate: () => void;
  isLoading: boolean;
  isProUser: boolean;
  onLogin: () => void;
}

const HeroSection: React.FC<HeroSectionProps> = ({ prompt, setPrompt, onGenerate, isLoading, isProUser, onLogin }) => {
  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onGenerate();
    }
  };
  
  return (
    <section className="relative text-center py-20 md:py-32 lg:py-40 px-4 min-h-[70vh] flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-indigo-900/50 to-black animated-gradient z-0"></div>
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-0"></div>
      
      <div className="relative z-10 max-w-4xl mx-auto w-full">
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold tracking-tighter mb-4 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
          Turn Words Into Cinema.
        </h1>
        <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
          AI that converts your imagination into 40-sec cinematic videos using Veo 3, NanoBanana, and Gemini Pro.
        </p>
        <div className="flex flex-col gap-3 max-w-3xl mx-auto">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Describe your scene… e.g. A soldier walking through the desert at sunset."
            className="w-full h-32 bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 rounded-2xl px-6 py-4 focus:ring-2 focus:ring-blue-500 focus:outline-none transition duration-300 backdrop-blur-sm resize-none"
            disabled={isLoading}
          />
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={onGenerate}
              disabled={isLoading || !prompt.trim()}
              className="flex-grow bg-blue-600 text-white font-bold py-4 px-8 rounded-2xl hover:bg-blue-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center shadow-[0_0_15px_rgba(59,130,246,0.5)] hover:shadow-[0_0_25px_rgba(59,130,246,0.8)]"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Generating...
                </>
              ) : (
                'Generate Video'
              )}
            </button>
             {isProUser ? (
              <div className="inline-flex items-center justify-center bg-green-900/50 text-green-300 border border-green-700 rounded-2xl px-4 py-1.5 text-sm font-medium">
                Gemini Pro Connected ✅
              </div>
            ) : (
              <button 
                onClick={onLogin}
                disabled={isLoading}
                className="inline-flex items-center justify-center gap-2 bg-gray-800/50 border border-gray-700 text-gray-300 rounded-2xl px-4 py-2 hover:bg-gray-700/70 transition-colors duration-300 backdrop-blur-sm disabled:opacity-50"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M15 6.38v2.07c0 .54.34.9.84.9h2.32c.5 0 .84.36.84.9v5.4c0 .54-.34.9-.84.9h-2.32c-.5 0-.84.36-.84.9v2.07A6.5 6.5 0 0 1 9.5 22a6.5 6.5 0 0 1-6.5-6.5c0-3.58 2.9-6.5 6.5-6.5a6.8 6.8 0 0 1 5.5 3.88Z"/><path d="M22 12h-5.96"/><path d="M22 12l-2.4-2.4"/><path d="M22 12l-2.4 2.4"/></svg>
                Boost with Gemini Pro
              </button>
            )}
          </div>
        </div>
        <ExamplePrompts setPrompt={setPrompt} />
      </div>
    </section>
  );
};

export default HeroSection;
