import React, { useState, useRef } from 'react';
import { Upload, Coffee, Shirt, ShoppingBag, Loader2, Download, RefreshCw } from 'lucide-react';
import { ProductType, ProductPreset } from '../types';
import { editImageWithGemini, fileToBase64 } from '../services/geminiService';
import { Button } from './ui/Button';

const PRODUCTS: ProductPreset[] = [
  {
    id: ProductType.MUG,
    name: "Coffee Mug",
    icon: <Coffee className="w-5 h-5" />,
    promptTemplate: "A professional product photography shot of a clean white ceramic coffee mug sitting on a wooden table in a cozy cafe. The provided logo is printed realistically on the side of the mug, following the curve of the ceramic surface. High resolution, photorealistic, depth of field."
  },
  {
    id: ProductType.TSHIRT,
    name: "T-Shirt",
    icon: <Shirt className="w-5 h-5" />,
    promptTemplate: "A high-quality product shot of a plain white cotton t-shirt laying flat on a neutral background. The provided logo is printed on the center chest area of the t-shirt with realistic fabric texture and lighting. 4k, studio lighting."
  },
  {
    id: ProductType.HOODIE,
    name: "Hoodie",
    icon: <Shirt className="w-5 h-5" />, // Reusing shirt icon for simplicity
    promptTemplate: "A black streetwear hoodie hanging against a concrete wall. The provided logo is printed large on the back of the hoodie. Cinematic lighting, urban aesthetic, realistic fabric folds."
  },
  {
    id: ProductType.TOTE,
    name: "Tote Bag",
    icon: <ShoppingBag className="w-5 h-5" />,
    promptTemplate: "A canvas tote bag hanging on a shoulder in a lifestyle setting. The provided logo is screen printed on the side of the bag. Natural sunlight, soft shadows, realistic texture."
  }
];

export const MockupStudio: React.FC = () => {
  const [selectedProduct, setSelectedProduct] = useState<ProductType>(ProductType.MUG);
  const [sourceImage, setSourceImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSourceImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResultUrl(null);
      setError(null);
    }
  };

  const handleGenerate = async () => {
    if (!sourceImage) return;

    setIsGenerating(true);
    setError(null);

    try {
      const base64 = await fileToBase64(sourceImage);
      const product = PRODUCTS.find(p => p.id === selectedProduct);
      if (!product) return;

      const result = await editImageWithGemini(
        base64,
        sourceImage.type,
        product.promptTemplate
      );

      setResultUrl(result);
    } catch (err) {
      setError("Failed to generate mockup. Please try again.");
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full">
      {/* Left Sidebar: Controls */}
      <div className="lg:col-span-1 space-y-6 bg-slate-900 p-6 rounded-2xl border border-slate-800 h-fit">
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">1. Upload Logo</h2>
          <div 
            className="border-2 border-dashed border-slate-700 rounded-xl p-8 text-center hover:bg-slate-800/50 transition-colors cursor-pointer"
            onClick={() => fileInputRef.current?.click()}
          >
            {previewUrl ? (
              <div className="relative group">
                <img 
                  src={previewUrl} 
                  alt="Logo Preview" 
                  className="max-h-40 mx-auto object-contain rounded shadow-sm" 
                />
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity rounded">
                  <span className="text-white text-sm font-medium">Change Logo</span>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center text-slate-400">
                <Upload className="w-10 h-10 mb-3 text-slate-500" />
                <p className="text-sm">Click to upload PNG or JPG</p>
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
        </div>

        <div>
          <h2 className="text-xl font-semibold text-white mb-4">2. Select Product</h2>
          <div className="grid grid-cols-2 gap-3">
            {PRODUCTS.map((product) => (
              <button
                key={product.id}
                onClick={() => setSelectedProduct(product.id)}
                className={`p-4 rounded-xl border text-left transition-all flex flex-col gap-2 ${
                  selectedProduct === product.id
                    ? 'bg-indigo-600 border-indigo-500 text-white ring-2 ring-indigo-500/30'
                    : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-750 hover:border-slate-600'
                }`}
              >
                <div className={`${selectedProduct === product.id ? 'text-white' : 'text-indigo-400'}`}>
                  {product.icon}
                </div>
                <span className="font-medium text-sm">{product.name}</span>
              </button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleGenerate} 
          disabled={!sourceImage || isGenerating}
          className="w-full h-12 text-lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Generating Mockup...
            </>
          ) : (
            <>
              Generate Mockup
            </>
          )}
        </Button>
        
        {error && (
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
            {error}
          </div>
        )}
      </div>

      {/* Right Area: Canvas/Result */}
      <div className="lg:col-span-2 bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col items-center justify-center min-h-[500px] relative overflow-hidden">
        {!resultUrl ? (
          <div className="text-center max-w-md px-4">
            <div className="w-24 h-24 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
              <ShoppingBag className="w-10 h-10 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-slate-200 mb-2">Ready to Design</h3>
            <p className="text-slate-400">
              Upload a logo and select a product to see the magic of Gemini 2.5 transform your design into a realistic product photo.
            </p>
          </div>
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center animate-fade-in">
            <div className="relative w-full max-w-2xl aspect-square rounded-xl overflow-hidden shadow-2xl shadow-black/50 group">
              <img 
                src={resultUrl} 
                alt="Generated Mockup" 
                className="w-full h-full object-contain bg-slate-950" 
              />
              <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                 <a 
                   href={resultUrl} 
                   download="mockup.png" 
                   className="p-2 bg-black/60 backdrop-blur text-white rounded-lg hover:bg-black/80 transition-colors"
                   title="Download Image"
                 >
                   <Download className="w-5 h-5" />
                 </a>
              </div>
            </div>
            <div className="mt-6 flex gap-4">
              <Button variant="secondary" onClick={() => setResultUrl(null)}>
                <RefreshCw className="w-4 h-4" />
                Create Another
              </Button>
              <a href={resultUrl} download="merch-ai-mockup.png">
                <Button>
                  <Download className="w-4 h-4" />
                  Download
                </Button>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
