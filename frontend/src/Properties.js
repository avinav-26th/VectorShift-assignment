// frontend/src/Properties.js
import React, { useState, useRef } from 'react';
import { useStore } from './store';
import { MdSettings, MdClose } from 'react-icons/md';

export const PropertiesPanel = () => {
    const nodes = useStore((state) => state.nodes);
    const updateNodeField = useStore((state) => state.updateNodeField);
    
    // Get the first selected node
    const selectedNode = nodes.find((n) => n.selected);

    // Widget State
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [position, setPosition] = useState({ x: window.innerWidth - 320, y: 80 });
    const dragging = useRef(false);
    const offset = useRef({ x: 0, y: 0 });

    const handleMouseDown = (e) => {
        dragging.current = true;
        offset.current = {
            x: e.clientX - position.x,
            y: e.clientY - position.y
        };
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = (e) => {
        if (dragging.current) {
            setPosition({
                x: e.clientX - offset.current.x,
                y: e.clientY - offset.current.y
            });
        }
    };

    const handleMouseUp = () => {
        dragging.current = false;
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    };

    const handleChange = (field, value) => {
        if (selectedNode) updateNodeField(selectedNode.id, field, value);
    };

    // Safety Check: If no node is selected, don't render anything
    if (!selectedNode) return null;

    return (
        <div style={{
            position: 'absolute',
            left: isCollapsed ? 'auto' : position.x,
            right: isCollapsed ? 20 : 'auto',
            top: isCollapsed ? 100 : position.y,
            width: isCollapsed ? '50px' : '300px',
            backgroundColor: 'var(--node-bg)',
            border: '1px solid var(--border-color)',
            borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
            zIndex: 1000,
            transition: isCollapsed ? 'all 0.3s ease' : 'none',
            overflow: 'hidden'
        }}>
            {/* Header / Drag Handle */}
            <div 
                onMouseDown={!isCollapsed ? handleMouseDown : undefined}
                style={{
                    padding: '10px',
                    backgroundColor: 'var(--input-bg)',
                    borderBottom: !isCollapsed ? '1px solid var(--border-color)' : 'none',
                    cursor: !isCollapsed ? 'move' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: isCollapsed ? 'center' : 'space-between',
                    color: 'var(--text-primary)'
                }}
                onClick={() => isCollapsed && setIsCollapsed(false)}
            >
                {isCollapsed ? (
                    <MdSettings size={24} />
                ) : (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <MdSettings />
                            <span style={{fontWeight: 600, fontSize: '14px'}}>Properties</span>
                        </div>
                        <div 
                            onClick={(e) => { e.stopPropagation(); setIsCollapsed(true); }} 
                            style={{ cursor: 'pointer', display: 'flex' }}
                        >
                             <MdClose /> 
                        </div>
                    </>
                )}
            </div>

            {/* Content Area */}
            {!isCollapsed && (
                <div style={{ padding: '15px', maxHeight: '500px', overflowY: 'auto' }}>
                     
                     {/* Common Info Header */}
                     <div style={{marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid var(--border-color)'}}>
                        <div style={{fontSize: '11px', color: 'var(--text-secondary)', marginBottom: '4px'}}>ID</div>
                        <div style={{fontSize: '12px', fontFamily: 'monospace', color: 'var(--text-primary)'}}>{selectedNode.id}</div>
                        <div style={{fontSize: '11px', color: 'var(--text-secondary)', marginTop: '8px', marginBottom: '4px'}}>Type</div>
                        <div style={{fontSize: '12px', fontWeight: '500'}}>{selectedNode.data.label || selectedNode.type.toUpperCase()}</div>
                     </div>

                     {/* ----------------- NODE SPECIFIC FIELDS ----------------- */}

                     {/* 1. INPUT NODE */}
                     {selectedNode.type === 'customInput' && (
                        <>
                            <label style={labelStyle}>Field Name</label>
                            <input type="text" value={selectedNode.data.inputName || ''} onChange={(e) => handleChange('inputName', e.target.value)} style={inputStyle} />
                            
                            <label style={labelStyle}>Data Type</label>
                            <select value={selectedNode.data.inputType || 'Text'} onChange={(e) => handleChange('inputType', e.target.value)} style={inputStyle}>
                                <option value="Text">Text</option>
                                <option value="File">File</option>
                            </select>
                        </>
                     )}

                     {/* 2. OUTPUT NODE */}
                     {selectedNode.type === 'customOutput' && (
                        <>
                            <label style={labelStyle}>Output Name</label>
                            <input type="text" value={selectedNode.data.outputName || ''} onChange={(e) => handleChange('outputName', e.target.value)} style={inputStyle} />
                            
                            <label style={labelStyle}>Output Type</label>
                            <select value={selectedNode.data.outputType || 'Text'} onChange={(e) => handleChange('outputType', e.target.value)} style={inputStyle}>
                                <option value="Text">Text</option>
                                <option value="Image">Image</option>
                            </select>
                        </>
                     )}

                     {/* 3. LLM NODE */}
                     {selectedNode.type === 'llm' && (
                        <>
                             <label style={labelStyle}>Model</label>
                             <select value={selectedNode.data.model || 'gpt-3.5'} onChange={(e) => handleChange('model', e.target.value)} style={inputStyle}>
                                <option value="gpt-3.5">GPT-3.5 Turbo</option>
                                <option value="gpt-4">GPT-4</option>
                                <option value="claude-3">Claude 3 Opus</option>
                             </select>

                             <label style={labelStyle}>Temperature: {selectedNode.data.temperature || 0.5}</label>
                             <input 
                                type="range" min="0" max="1" step="0.1"
                                value={selectedNode.data.temperature || 0.5} 
                                onChange={(e) => handleChange('temperature', parseFloat(e.target.value))}
                                style={{width: '100%', marginBottom: '10px'}}
                             />

                             <label style={labelStyle}>System Prompt</label>
                             <textarea 
                                rows={4} 
                                value={selectedNode.data.systemMessage || ''} 
                                onChange={(e) => handleChange('systemMessage', e.target.value)}
                                style={inputStyle}
                                className="nodrag"
                             />
                        </>
                     )}

                    {/* 4. TEXT NODE */}
                    {selectedNode.type === 'text' && (
                        <>
                            <label style={labelStyle}>Text Content</label>
                            <textarea 
                                rows={4} 
                                value={selectedNode.data.text || ''} 
                                onChange={(e) => handleChange('text', e.target.value)}
                                style={inputStyle}
                                className="nodrag"
                            />
                            <div style={{fontSize: '11px', color: 'var(--text-secondary)'}}>
                                Variables detected: {
                                    (selectedNode.data.text?.match(/{{[a-zA-Z_$][a-zA-Z0-9_$]*}}/g) || [])
                                    .map(v => v.replace(/{{|}}/g, '')).join(', ') || 'None'
                                }
                            </div>
                        </>
                    )}

                    {/* 5. API NODE */}
                    {selectedNode.type === 'api' && (
                        <>
                            <label style={labelStyle}>API Url</label>
                            <input type="text" value={selectedNode.data.url || ''} onChange={(e) => handleChange('url', e.target.value)} style={inputStyle} />

                            <label style={labelStyle}>Method</label>
                            <select value={selectedNode.data.method || 'GET'} onChange={(e) => handleChange('method', e.target.value)} style={inputStyle}>
                                <option value="GET">GET</option>
                                <option value="POST">POST</option>
                            </select>

                            <label style={labelStyle}>Headers (JSON)</label>
                            <textarea 
                                rows={3} 
                                value={selectedNode.data.headers || '{"Content-Type": "application/json"}'} 
                                onChange={(e) => handleChange('headers', e.target.value)}
                                style={inputStyle}
                                className="nodrag"
                            />
                        </>
                    )}

                    {/* 6. SLACK NODE */}
                    {selectedNode.type === 'slack' && (
                        <>
                            <label style={labelStyle}>Slack Channel</label>
                            <input type="text" value={selectedNode.data.channel || ''} onChange={(e) => handleChange('channel', e.target.value)} style={inputStyle} placeholder="#general" />
                        </>
                    )}

                    {/* 7. DATABASE NODE */}
                    {selectedNode.type === 'database' && (
                        <>
                            <label style={labelStyle}>Database / File</label>
                            <input type="text" value={selectedNode.data.fileName || ''} onChange={(e) => handleChange('fileName', e.target.value)} style={inputStyle} />
                        </>
                    )}

                    {/* 8. TIMER NODE */}
                    {selectedNode.type === 'timer' && (
                        <>
                            <label style={labelStyle}>Interval</label>
                            <input type="text" value={selectedNode.data.interval || '5 mins'} onChange={(e) => handleChange('interval', e.target.value)} style={inputStyle} />
                        </>
                    )}

                    {/* 9. NOTE NODE */}
                    {selectedNode.type === 'note' && (
                        <>
                            <label style={labelStyle}>Note Content</label>
                            <textarea 
                                rows={4} 
                                value={selectedNode.data.text || ''} 
                                onChange={(e) => handleChange('text', e.target.value)}
                                style={inputStyle}
                                className="nodrag"
                            />
                        </>
                    )}

                </div>
            )}
        </div>
    );
};

// Styles
const labelStyle = { display: 'block', marginBottom: '6px', fontSize: '12px', fontWeight: '500', color: 'var(--text-secondary)' };
const inputStyle = { width: '100%', marginBottom: '15px' };