// frontend/src/nodes/textNode.js
import { useState, useEffect, useRef } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import TextareaAutosize from 'react-textarea-autosize';
import { useStore } from '../store';
import { MdTextFields } from 'react-icons/md';

export const TextNode = ({ id, data, selected }) => {
  const [currText, setCurrText] = useState(data?.text || '{{input}}');
  const [handles, setHandles] = useState([]);
  const [variables, setVariables] = useState([]);
  const updateNodeField = useStore((state) => state.updateNodeField);
  
  // Ref to track if the update came from internal typing
  const isTyping = useRef(false);

  // SYNC: Listen for changes from Sidebar -> Node
  useEffect(() => {
    // Only update from props if we are NOT currently typing
    if (!isTyping.current && data?.text !== undefined && data.text !== currText) {
        setCurrText(data.text);
    }
  }, [data.text, currText]);

  // LOGIC: Regex for {{ variables }}
  useEffect(() => {
    const regex = /{{([a-zA-Z_$][a-zA-Z0-9_$]*)}}/g;
    const matches = [];
    let match;
    while ((match = regex.exec(currText)) !== null) {
        matches.push(match[1]);
    }
    const uniqueVars = [...new Set(matches)];
    setVariables(uniqueVars); 

    const newHandles = uniqueVars.map((variable, index) => ({
        id: variable,
        type: 'target', 
        position: Position.Left,
        style: { top: `${(index + 1) * (100 / (uniqueVars.length + 1))}%` } 
    }));
    setHandles(newHandles);
  }, [currText]); 

  // ACTION: Handle Typing
  const handleTextChange = (e) => {
    isTyping.current = true; // Mark as internal change
    const newVal = e.target.value;
    setCurrText(newVal); 
    updateNodeField(id, 'text', newVal);
    
    // Release lock after a short delay
    setTimeout(() => { isTyping.current = false; }, 200);
  };

  return (
    <BaseNode
        id={id}
        data={data}
        title="Text"
        icon={<MdTextFields />}
        selected={selected}
        handles={[
            ...handles, 
            { type: 'source', position: Position.Right, id: 'output' }
        ]}
    >
        <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '5px' }}>
            <label style={{ fontSize: '10px', color: 'var(--text-secondary)' }}>
                Text Content:
            </label>
            
            <TextareaAutosize
                minRows={1}
                value={currText} 
                onChange={handleTextChange} 
                className="nodrag noscroll"
                style={{
                    width: '100%',
                    flex: 1, 
                    padding: '8px',
                    borderRadius: '6px',
                    border: '1px solid var(--border-color)',
                    background: 'var(--input-bg)',
                    color: 'var(--text-primary)',
                    fontFamily: 'monospace',
                    fontSize: '11px',
                    resize: 'none', 
                    boxSizing: 'border-box',
                    outline: 'none',
                    lineHeight: '1.4'
                }}
            />

            {/* Variable Chips */}
            {variables.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginTop: '2px' }}>
                    {variables.map((v) => (
                        <span key={v} style={{
                            fontSize: '9px',
                            background: 'rgba(99, 102, 241, 0.2)', 
                            color: 'var(--primary-color)',
                            padding: '2px 6px',
                            borderRadius: '10px',
                            border: '1px solid rgba(99, 102, 241, 0.3)'
                        }}>
                            {v}
                        </span>
                    ))}
                </div>
            )}
        </div>
    </BaseNode>
  );
};