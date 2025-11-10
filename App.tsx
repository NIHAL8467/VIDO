import React, { useState, useRef, useCallback } from 'react';
import HeroSection from './components/HeroSection';
import PreviewSection from './components/PreviewSection';
import FeaturesSection from './components/FeaturesSection';
import GallerySection from './components/GallerySection';
import Footer from './components/Footer';
import ProcessingPanel from './components/ProcessingPanel';
import { generateCinematicVideo } from './services/geminiService';
import { ProcessingStage } from './types';

const App: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedVideoUrl, setGeneratedVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isProUser, setIsProUser] = useState(false);
  
  // State for the new processing panel
  const [currentStage, setCurrentStage] = useState<ProcessingStage>(ProcessingStage.STARTING);
  const [stageData, setStageData] = useState<any>({});

  const previewRef = useRef<HTMLDivElement>(null);

  const handleLogin = () => {
    // This is a mock login. In a real app, this would involve an OAuth flow.
    setIsProUser(true);
  };

  const handleGenerate = useCallback(async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setGeneratedVideoUrl(null);
    setError(null);
    setStageData({});
    setCurrentStage(ProcessingStage.STARTING);
    
    previewRef.current?.scrollIntoView({ behavior: 'smooth' });

    try {
      await generateCinematicVideo(prompt, isProUser, {
        onStageChange: (stage, data) => {
          setCurrentStage(stage);
          if (data) {
            setStageData(prevData => ({...prevData, ...data}));
          }
        },
      });
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred during video generation.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, isLoading, isProUser]);

  // Update generated video URL when the final stage data is received
  React.useEffect(() => {
    if (currentStage === ProcessingStage.DONE && stageData.videoUrl) {
      setGeneratedVideoUrl(stageData.videoUrl);
      setIsLoading(false);
    }
  }, [currentStage, stageData]);

  return (
    <div className="bg-black text-white min-h-screen overflow-x-hidden">
      <main>
        <HeroSection
          prompt={prompt}
          setPrompt={setPrompt}
          onGenerate={handleGenerate}
          isLoading={isLoading}
          isProUser={isProUser}
          onLogin={handleLogin}
        />
        <div ref={previewRef} className="pt-10">
          {isLoading && (
            <ProcessingPanel 
              currentStage={currentStage} 
              isProUser={isProUser}
              stillUrl={stageData.stillUrl}
              error={error}
            />
          )}
          {!isLoading && error && (
             <div className="max-w-4xl mx-auto my-12 px-4">
               <div className="text-center text-red-400 bg-red-900/20 p-6 rounded-2xl border border-red-800">
                  <h3 className="text-xl font-bold mb-2">Generation Failed</h3>
                  <p>{error}</p>
                </div>
             </div>
          )}
          <PreviewSection
            videoUrl={generatedVideoUrl}
            prompt={prompt}
          />
        </div>
        <FeaturesSection />
        <GallerySection />
      </main>
      <Footer />
    </div>
  );
};

export default App;
