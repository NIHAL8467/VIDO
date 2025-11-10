
import React from 'react';
import FilmIcon from './icons/FilmIcon';
import PhotoIcon from './icons/PhotoIcon';
import CogIcon from './icons/CogIcon';

const features = [
  {
    icon: <FilmIcon />,
    title: "Veo 3 AI Video Engine",
    description: "Cinematic storytelling in seconds, bringing your prompts to life with stunning motion and detail.",
  },
  {
    icon: <PhotoIcon />,
    title: "NanoBanana Visuals",
    description: "Ultra-realistic image generation creates the perfect visual foundation for every scene.",
  },
  {
    icon: <CogIcon />,
    title: "Full AI Pipeline",
    description: "A seamless flow from your initial idea to storyboard visuals and the final rendered video.",
  },
];

const FeaturesSection: React.FC = () => {
  return (
    <section className="py-20 md:py-28 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
          {features.map((feature) => (
            <div key={feature.title} className="text-center p-6 bg-gray-900/30 rounded-2xl border border-gray-800 hover:border-blue-700 transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center justify-center h-16 w-16 rounded-full bg-blue-600/20 text-blue-400 mx-auto mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2 text-white">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;
