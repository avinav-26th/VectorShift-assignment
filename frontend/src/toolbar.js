// frontend/src/toolbar.js
import { DraggableNode } from './draggableNode';
import { useStore } from './store';
import { 
  MdInput, MdOutput, MdTextFields, MdChat, 
  MdTimer, MdApi, MdStorage, MdMessage, MdNote,
  MdDelete
} from 'react-icons/md';

export const PipelineToolbar = () => {
    const clearCanvas = useStore((state) => state.clearCanvas); 

    const handleClear = () => {
        if (window.confirm("Are you sure you want to clear the entire canvas? This cannot be undone.")) {
            clearCanvas();
        }
    };

    return (
        <div className='overall-div' style={{backgroundColor: 'var(--node-bg)', padding: '5px 10px', display: 'flex', flexDirection: 'row', gap: '20px', alignItems: 'center' }}>
            <div className='general-div' style={{ marginBottom: '5px' }}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '10px' }}>GENERAL</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <DraggableNode type='customInput' label='Input' icon={<MdInput />} />
                    <DraggableNode type='llm' label='LLM' icon={<MdChat />} />
                    <DraggableNode type='customOutput' label='Output' icon={<MdOutput />} />
                    <DraggableNode type='text' label='Text' icon={<MdTextFields />} />
                </div>
            </div>

            <div style={{height: '70px', minWidth: '1px', backgroundColor: 'var(--border-color)'}}></div>
            
            <div className='integrations-div' style={{marginBottom:'5px'}}>
                <div style={{ fontSize: '10px', color: 'var(--text-secondary)', marginBottom: '10px' }}>INTEGRATIONS</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                    <DraggableNode type='timer' label='Timer' icon={<MdTimer />} />
                    <DraggableNode type='api' label='API' icon={<MdApi />} />
                    <DraggableNode type='database' label='DB' icon={<MdStorage />} />
                    <DraggableNode type='slack' label='Slack' icon={<MdMessage />} />
                    <DraggableNode type='note' label='Note' icon={<MdNote />} />
                </div>
            </div>

            <button 
                onClick={handleClear}
                style={{
                    marginLeft: 'auto', 
                    background: 'transparent',
                    border: '1px solid #A23B3B',
                    color: '#A23B3B',
                    borderRadius: '6px',
                    padding: '8px 12px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '5px',
                    fontSize: '12px',
                    fontWeight: '600',
                    transition: 'all 0.2s'
                }}
                onMouseOver={(e) => {
                    e.currentTarget.style.background = '#ef4444';
                    e.currentTarget.style.color = 'white';
                }}
                onMouseOut={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = '#ef4444';
                    e.currentTarget.style.opacity = '0.8';
                }}
            >
                <MdDelete size={16} /> Clear
            </button>
        </div>
    );
};