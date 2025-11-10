import React from 'react';
import { ProcessingStage } from '../types';
import PuzzleIcon from './icons/PuzzleIcon';
import CodeIcon from './icons/CodeIcon';
import PhotoIcon from './icons/PhotoIcon';
import FilmIcon from './icons/FilmIcon';
import RocketIcon from './icons/RocketIcon';
import CheckIcon from './icons/CheckIcon';

interface ProcessingPanelProps {
  currentStage: ProcessingStage;
  isProUser: boolean;
  stillUrl?: string;
  error?: string | null;
}

const StageStatus = {
  PENDING: 'pending',
  ACTIVE: 'active',
  COMPLETED: 'completed',
};

const Stage: React.FC<{ icon: React.ReactNode; title: string; status: string; children?: React.ReactNode }> = ({ icon, title, status, children }) => {
  const getStatusClasses = () => {
    switch (status) {
      case StageStatus.ACTIVE:
        return 'text-blue-400 border-blue-600';
      case StageStatus.COMPLETED:
        return 'text-green-400 border-green-700';
      default:
        return 'text-gray-500 border-gray-800';
    }
  };

  return (
    <div className={`flex items-start gap-4 p-4 border-l-2 transition-colors duration-500 ${getStatusClasses()}`}>
      <div className="flex-shrink-0 mt-1">
        {status === StageStatus.ACTIVE ? (
          <div className="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center animate-pulse">{icon}</div>
        ) : status === StageStatus.COMPLETED ? (
          <div className="w-8 h-8 rounded-full bg-green-900/50 flex items-center justify-center"><CheckIcon/></div>
        ) : (
          icon
        )}
      </div>
      <div>
        <h4 className="font-semibold text-lg">{title}</h4>
        {children}
      </div>
    </div>
  );
};


const ProcessingPanel: React.FC<ProcessingPanelProps> = ({ currentStage, isProUser, stillUrl, error }) => {
  const stages = [
    { id: ProcessingStage.ANALYZING_PROMPT, icon: <PuzzleIcon />, title: "Analyzing Prompt" },
    { id: ProcessingStage.PREPARING_COMMAND, icon: <CodeIcon />, title: "Preparing AI Command" },
    { id: ProcessingStage.GENERATING_IMAGE, icon: <PhotoIcon />, title: "Generating Base Image (NanoBanana)" },
    { id: ProcessingStage.GENERATING_VIDEO, icon: <FilmIcon />, title: "Creating Video (Veo 3)" },
    ...(isProUser ? [{ id: ProcessingStage.ENHANCING_VIDEO, icon: <RocketIcon />, title: "Enhancing with Gemini Pro" }] : []),
    { id: ProcessingStage.DONE, icon: <CheckIcon />, title: "Ready" },
  ];

  const getStageStatus = (stageId: ProcessingStage) => {
    if (currentStage === stageId) return StageStatus.ACTIVE;
    if (currentStage > stageId) return StageStatus.COMPLETED;
    return StageStatus.PENDING;
  };
  
  if (error) return null; // Error is displayed in App.tsx now

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black border border-gray-800 rounded-3xl p-4 md:p-8 shadow-2xl shadow-indigo-900/30">
          <h2 className="text-2xl font-bold text-center mb-2 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">
            Generating Your Vision...
          </h2>
          {isProUser && currentStage > ProcessingStage.STARTING && currentStage < ProcessingStage.DONE && (
            <div className="text-center mb-6">
                <p className="text-indigo-300 bg-indigo-900/40 rounded-full inline-block px-4 py-1.5 text-sm font-medium border border-indigo-700">
                    🎬 Gemini Pro Visual Boost Active
                </p>
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-8">
            <div className="flex-1 space-y-2">
              {stages.map(stage => (
                <Stage key={stage.id} icon={stage.icon} title={stage.title} status={getStageStatus(stage.id)} />
              ))}
            </div>
            {stillUrl && (
              <div className="md:w-1/2 flex-shrink-0">
                <div className="w-full aspect-video rounded-2xl overflow-hidden bg-gray-900 border border-gray-700 p-2">
                    <img 
                      src={stillUrl} 
                      alt="Generated still" 
                      className={`w-full h-full object-cover rounded-lg ${getStageStatus(ProcessingStage.GENERATING_VIDEO) === 'active' ? 'animate-pulse' : ''}`} 
                     />
                </div>
                 <p className="text-center text-gray-400 text-sm mt-2">Base visual generated</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ProcessingPanel;