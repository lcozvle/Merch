import React, { useState } from 'react';
import { Image, Loader2, Download, Sparkles, Layout } from 'lucide-react';
import { generateImageWithImagen } from '../services/geminiService';
import { Button } from './ui/Button';

export const ImageGenerator: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [aspectRatio, setAspectRatio] = useState<'1:1' | '16:9' | '9:16'>('1:1');
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt) return;

    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateImageWithImagen(prompt, aspectRatio);
      setResultUrl(result);
    } catch (err) {
      setError("Failed to generate image. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto h-full flex flex-col">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold text-white mb-2">Imagen 4 Generator</h2>
        <p className="text-slate-400">Generate high-fidelity assets from scratch.</p>
      </div>

      <div className="bg-slate-900 rounded-2xl border border-slate-800 p-1 overflow-hidden flex flex-col md:flex-row flex-1 min-h-[500px]">
        
        {/* Left Panel: Configuration */}
        <div className="p-6 md:w-1/3 border-b md:border-b-0 md:border-r border-slate-800 flex flex-col gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Prompt</label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the image you want to generate in detail..."
              className="w-full h-32 bg-slate-950 border border-slate-700 rounded-lg p-3 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Aspect Ratio</label>
            <div className="grid grid-cols-3 gap-2">
                {['1:1', '16:9', '9:16'].map((ratio) => (
                    <button
                        key={ratio}
                        onClick={() => setAspectRatio(ratio as any)}
                        className={`p-2 rounded-lg border text-sm font-medium flex flex-col items-center gap-1 transition-all ${
                            aspectRatio === ratio 
                            ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200' 
                            : 'bg-slate-950 border-slate-800 text-slate-400 hover:bg-slate-800'
                        }`}
                    >
                        <Layout className={`w-4 h-4 ${
                            ratio === '16:9' ? 'rotate-90' : ratio === '9:16' ? '' : ''
                        }`} />
                        {ratio}
                    </button>
                ))}
            </div>
          </div>

          <div className="mt-auto">
             <Button 
                onClick={handleGenerate} 
                disabled={!prompt || isGenerating} 
                className="w-full py-3"
             >
                {isGenerating ? (
                    <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        Generating...
                    </>
                ) : (
                    <>
                        <Sparkles className="w-4 h-4" />
                        Generate with Imagen
                    </>
                )}
             </Button>
             {error && <p className="text-red-400 text-xs mt-3 text-center">{error}</p>}
          </div>
        </div>

        {/* Right Panel: Output */}
        <div className="flex-1 bg-slate-950/50 flex items-center justify-center relative p-8">
            {!resultUrl ? (
                <div className="text-center text-slate-500">
                    {isGenerating ? (
                        <div className="flex flex-col items-center gap-4">
                             <div className="relative w-16 h-16">
                                <div className="absolute inset-0 border-4 border-slate-800 rounded-full"></div>
                                <div className="absolute inset-0 border-4 border-indigo-500 rounded-full border-t-transparent animate-spin"></div>
                             </div>
                             <p className="animate-pulse text-sm">Dreaming up pixels...</p>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-2">
                            <Image className="w-12 h-12 opacity-20" />
                            <p>Generated image will appear here</p>
                        </div>
                    )}
                </div>
            ) : (
                <div className="relative group max-w-full max-h-full flex items-center justify-center">
                    <img 
                        src={resultUrl} 
                        alt={prompt} 
                        className="max-w-full max-h-[600px] object-contain rounded-lg shadow-2xl shadow-black" 
                    />
                    <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                         <a href={resultUrl} download="imagen-generated.jpg">
                            <Button variant="secondary">
                                <Download className="w-4 h-4" />
                            </Button>
                         </a>
                    </div>
                </div>
            )}
        </div>

      </div>
    </div>
  );
};
