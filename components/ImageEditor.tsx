import React, { useState, useRef } from 'react';
import { Upload, Wand2, Loader2, ArrowRight, Download, ImageIcon } from 'lucide-react';
import { editImageWithGemini, fileToBase64 } from '../services/geminiService';
import { Button } from './ui/Button';

export const ImageEditor: React.FC = () => {
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSourceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null); // Clear previous result on new upload
      setError(null);
    }
  };

  const handleEdit = async () => {
    if (!sourceImage || !prompt) return;

    setIsGenerating(true);
    setError(null);

    try {
      const base64 = await fileToBase64(sourceImage);
      // The "Edit" flow uses Gemini 2.5 Flash Image which takes image + prompt and returns a transformed image.
      const result = await editImageWithGemini(
        base64,
        sourceImage.type,
        prompt
      );
      setResultUrl(result);
    } catch (err) {
      setError("Failed to edit image. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-white mb-2">Magic Editor</h2>
        <p className="text-slate-400">Use natural language to transform your images with Gemini 2.5 Flash Image.</p>
      </div>

      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 gap-8 min-h-[500px]">
        
        {/* Source Column */}
        <div className="flex flex-col gap-4">
           <div 
            className={`flex-1 rounded-2xl border-2 border-dashed transition-all relative overflow-hidden flex items-center justify-center bg-slate-900 ${
                !sourceImage ? 'border-slate-700 hover:border-slate-500 cursor-pointer' : 'border-slate-800'
            }`}
            onClick={() => !sourceImage && fileInputRef.current?.click()}
          >
            {previewUrl ? (
               <img src={previewUrl} alt="Original" className="max-w-full max-h-full object-contain" />
            ) : (
              <div className="text-center p-8 text-slate-500">
                 <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-50" />
                 <p className="font-medium">Click to upload an image</p>
                 <p className="text-sm mt-2">JPG or PNG</p>
              </div>
            )}
            
            {sourceImage && (
                <div className="absolute top-4 right-4">
                    <Button variant="secondary" onClick={(e) => { e.stopPropagation(); fileInputRef.current?.click(); }} className="text-xs h-8">Change</Button>
                </div>
            )}
            
            <input 
              ref={fileInputRef}
              type="file" 
              accept="image/*" 
              className="hidden" 
              onChange={handleFileChange} 
            />
          </div>
          
          <div className="bg-slate-900 p-4 rounded-xl border border-slate-800">
             <label className="block text-sm font-medium text-slate-300 mb-2">How should we change this image?</label>
             <div className="flex gap-2">
                <input 
                  type="text" 
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="e.g., 'Add a retro filter', 'Remove the background person'..."
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  onKeyDown={(e) => e.key === 'Enter' && handleEdit()}
                />
                <Button onClick={handleEdit} disabled={!sourceImage || !prompt || isGenerating}>
                  {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Wand2 className="w-4 h-4" />}
                </Button>
             </div>
             {error && <p className="text-red-400 text-xs mt-2">{error}</p>}
          </div>
        </div>

        {/* Result Column */}
        <div className="flex flex-col">
          <div className="flex-1 bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center relative overflow-hidden">
             {!resultUrl ? (
               <div className="text-slate-600 flex flex-col items-center">
                 {isGenerating ? (
                    <>
                        <Loader2 className="w-10 h-10 animate-spin mb-4 text-indigo-500" />
                        <p className="animate-pulse">Processing with Nano Banana...</p>
                    </>
                 ) : (
                    <>
                        <ArrowRight className="w-12 h-12 mb-4 opacity-20" />
                        <p>Edited image will appear here</p>
                    </>
                 )}
               </div>
             ) : (
               <img src={resultUrl} alt="Edited" className="max-w-full max-h-full object-contain" />
             )}

             {resultUrl && (
                <div className="absolute bottom-4 right-4">
                    <a href={resultUrl} download="edited-image.png">
                        <Button>
                            <Download className="w-4 h-4" />
                            Download
                        </Button>
                    </a>
                </div>
             )}
          </div>
          {/* Spacer to match input height alignment if needed, or just empty */}
          <div className="h-[88px]"></div> 
        </div>

      </div>
    </div>
  );
};
