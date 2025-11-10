import React from 'react';

interface PreviewSectionProps {
  videoUrl: string | null;
  prompt: string;
}

const PreviewSection: React.FC<PreviewSectionProps> = ({ videoUrl, prompt }) => {
  if (!videoUrl) {
    return null;
  }
  
  const handleDownload = () => {
    const a = document.createElement('a');
    a.href = videoUrl;
    // Sanitize prompt to create a valid filename
    const fileName = prompt.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').slice(0, 50) || 'generated-video';
    a.download = `${fileName}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <section className="py-12 md:py-20 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-black border border-gray-800 rounded-3xl p-4 md:p-6 shadow-2xl shadow-blue-900/40">
            <div>
              <h2 className="text-2xl font-bold text-center mb-6 text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-blue-400">Your Cinematic Video is Ready!</h2>
              <div className="aspect-video w-full rounded-2xl overflow-hidden shadow-lg mb-6">
                <video src={videoUrl} controls autoPlay loop className="w-full h-full object-cover">
                  Your browser does not support the video tag.
                </video>
              </div>
              <div className="text-center">
                 <button 
                  onClick={handleDownload}
                  className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-500 transition-all duration-300 ease-in-out transform hover:scale-105 disabled:bg-gray-700 disabled:cursor-not-allowed disabled:scale-100 flex items-center justify-center mx-auto"
                  >
                    Download Video
                  </button>
              </div>
            </div>
        </div>
      </div>
    </section>
  );
};

export default PreviewSection;
