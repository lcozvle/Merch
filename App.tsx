import React, { useState } from 'react';
import { AppMode } from './types';
import { MockupStudio } from './components/MockupStudio';
import { ImageEditor } from './components/ImageEditor';
import { ImageGenerator } from './components/ImageGenerator';
import { ShoppingBag, Wand2, Image as ImageIcon, Zap } from 'lucide-react';

const App: React.FC = () => {
  const [mode, setMode] = useState<AppMode>(AppMode.MOCKUP);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 font-sans flex flex-col">
      {/* Header */}
      <header className="bg-slate-900/50 backdrop-blur-xl border-b border-slate-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" fill="currentColor" />
            </div>
            <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">
              MerchAI Studio
            </h1>
          </div>
          
          <nav className="flex items-center gap-1 bg-slate-800/50 p-1 rounded-lg border border-slate-800">
            <button
              onClick={() => setMode(AppMode.MOCKUP)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                mode === AppMode.MOCKUP 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ShoppingBag className="w-4 h-4" />
              Mockups
            </button>
            <button
              onClick={() => setMode(AppMode.EDITOR)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                mode === AppMode.EDITOR 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <Wand2 className="w-4 h-4" />
              Magic Edit
            </button>
            <button
              onClick={() => setMode(AppMode.GENERATOR)}
              className={`px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-all ${
                mode === AppMode.GENERATOR 
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/25' 
                : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              <ImageIcon className="w-4 h-4" />
              Generate
            </button>
          </nav>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
        {mode === AppMode.MOCKUP && <MockupStudio />}
        {mode === AppMode.EDITOR && <ImageEditor />}
        {mode === AppMode.GENERATOR && <ImageGenerator />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 py-6 text-center text-slate-600 text-sm">
        <p>Powered by Google Gemini 2.5 Flash & Imagen 4.0</p>
      </footer>
    </div>
  );
};

export default App;
