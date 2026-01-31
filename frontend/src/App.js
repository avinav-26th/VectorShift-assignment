// frontend/src/App.js
import { PipelineToolbar } from './toolbar';
import { PipelineUI } from './ui';
import { SubmitButton } from './submit';
import { PropertiesPanel } from './Properties';
import { PipelineTemplatePanel } from './PipelineTemplatePanel';
import { useState, useEffect } from 'react';
import { useStore } from './store'; 
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { MdDarkMode, MdLightMode, MdPlayArrow, MdFeaturedPlayList } from 'react-icons/md';

function App() {
  // Destructure state from store
  const { undo, redo, isRunning, loadPipeline, savePipeline, saveStatus } = useStore(state => ({
    undo: state.undo,
    redo: state.redo,
    isRunning: state.isRunning,
    loadPipeline: state.loadPipeline,
    savePipeline: state.savePipeline,
    saveStatus: state.saveStatus
  }));

  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isTemplatePanelOpen, setIsTemplatePanelOpen] = useState(false);

  useEffect(() => {
    loadPipeline();
  }, [loadPipeline]);

  useEffect(() => {
    const handleUnload = () => savePipeline();
    window.addEventListener('beforeunload', handleUnload);
    return () => window.removeEventListener('beforeunload', handleUnload);
  }, [savePipeline]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        undo();
      }
      if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        redo();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo]);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.body.classList.toggle('light-mode');
  };

  const handleRun = () => {
    useStore.getState().runSimulation();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      
      {/* HEADER */}
      <div style={{ 
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
        padding: '0 20px', height: '60px', borderBottom: '1px solid var(--border-color)',
        backgroundColor: 'var(--bg-color)', transition: 'background-color 0.3s'
      }}>
        <div style={{fontWeight: 'bold', fontSize: '18px', color: 'var(--text-primary)'}}>
            VectorShift Pipeline
        </div>
        
        <div style={{display: 'flex', gap: '15px', alignItems: 'center'}}>
           
           {/* save status indicator */}
           {saveStatus === 'saving' && (
                <div style={{
                    padding: '5px 10px', borderRadius: '20px', backgroundColor: 'var(--input-bg)',
                    color: 'var(--text-secondary)', fontSize: '12px', fontWeight: '500',
                    display: 'flex', alignItems: 'center', gap: '5px'
                }}>
                    <span className="spinner" style={{width: 10, height: 10, border: '2px solid var(--text-secondary)', borderTopColor: 'transparent', borderRadius: '50%', display: 'inline-block', animation: 'spin 1s linear infinite'}}></span>
                    Saving...
                </div>
           )}
           {saveStatus === 'saved' && (
                <div style={{
                    padding: '5px 10px', borderRadius: '20px', backgroundColor: 'rgba(34, 197, 94, 0.1)',
                    color: '#22c55e', fontSize: '12px', fontWeight: '600',
                    display: 'flex', alignItems: 'center', gap: '5px', transition: 'all 0.3s'
                }}>
                    ✅ Saved
                </div>
           )}

           <button 
             onClick={() => setIsTemplatePanelOpen(true)}
             style={{
               display: 'flex', alignItems: 'center', gap: '5px',
               background: 'var(--input-bg)', border: '1px solid var(--border-color)', 
               color: 'var(--text-primary)', padding: '8px 12px', borderRadius: '6px', 
               cursor: 'pointer', fontSize: '13px', fontWeight: '500'
             }}
           >
             <MdFeaturedPlayList size={16} /> Templates
           </button>

           <button 
             onClick={handleRun}
             disabled={isRunning}
             style={{
               display: 'flex', alignItems: 'center', gap: '5px',
               background: isRunning ? 'var(--input-bg)' : 'var(--primary-color)', 
               border: 'none', color: '#fff', padding: '8px 16px', borderRadius: '6px', 
               cursor: isRunning ? 'not-allowed' : 'pointer', fontSize: '13px', fontWeight: '600',
               opacity: isRunning ? 0.7 : 1,
               transition: 'all 0.3s'
             }}
           >
             <MdPlayArrow size={18} /> {isRunning ? 'Running...' : 'Run'}
           </button>

           <SubmitButton /> 

           <button 
             onClick={toggleTheme}
             style={{
               background: 'transparent', border: 'none', 
               color: 'var(--text-secondary)', padding: '5px', 
               cursor: 'pointer', display: 'flex', alignItems: 'center'
             }}
           >
             {isDarkMode ? <MdLightMode size={20} /> : <MdDarkMode size={20} />}
           </button>
        </div>
      </div>

      {/* BODY CONTENT */}
      <div style={{ display: 'flex', flex: 1, position: 'relative', overflow: 'hidden' }}>
          
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
             <PipelineToolbar />
             <PipelineUI />
          </div>

          <PropertiesPanel />
          
          <PipelineTemplatePanel 
            isOpen={isTemplatePanelOpen} 
            onClose={() => setIsTemplatePanelOpen(false)} 
          />
      </div>

      <ToastContainer position="bottom-right" theme={isDarkMode ? "dark" : "light"} />
    </div>
  );
}

export default App;