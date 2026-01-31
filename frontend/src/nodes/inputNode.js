// frontend/src/nodes/inputNode.js
import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { MdInput } from 'react-icons/md';
import { useStore } from '../store';

export const InputNode = ({ id, data, selected }) => {
  // Initialize local state from data (or defaults)
  const [currName, setCurrName] = useState(data?.inputName || id.replace('customInput-', 'input_'));
  const [inputType, setInputType] = useState(data.inputType || 'Text');
  
  // Get global update function to sync changes to Properties Panel
  const updateNodeField = useStore((state) => state.updateNodeField);

  // SYNC 1: Listen for changes from the Properties Panel (Global State -> Local State)
  useEffect(() => {
    if(data.inputName !== undefined && data.inputName !== currName) {
        setCurrName(data.inputName);
    }
    if(data.inputType !== undefined && data.inputType !== inputType) {
        setInputType(data.inputType);
    }
  }, [data.inputName, data.inputType, currName, inputType]);

  // SYNC 2: Push local changes to Global State (Local State -> Global State)
  const handleNameChange = (e) => {
    const newVal = e.target.value;
    setCurrName(newVal);
    updateNodeField(id, 'inputName', newVal);
  };

  const handleTypeChange = (e) => {
    const newVal = e.target.value;
    setInputType(newVal);
    updateNodeField(id, 'inputType', newVal);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title="Input"
      icon={<MdInput />}
      selected={selected}
      handles={[
        { type: 'source', position: Position.Right, id: 'value' }
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Name
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange} 
            className="nodrag" // Allows text selection without dragging node
          />
        </label>
        
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Type
          <select 
            value={inputType} 
            onChange={handleTypeChange}
            className="nodrag"
          >
            <option value="Text">Text</option>
            <option value="File">File</option>
            <option value="JSON">JSON</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};