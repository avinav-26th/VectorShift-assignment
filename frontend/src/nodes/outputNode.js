// frontend/src/nodes/outputNode.js
import { useState, useEffect } from 'react';
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { MdOutput } from 'react-icons/md';
import { useStore } from '../store';

export const OutputNode = ({ id, data, selected }) => {
  const [currName, setCurrName] = useState(data?.outputName || id.replace('customOutput-', 'output_'));
  const [outputType, setOutputType] = useState(data.outputType || 'Text');
  const updateNodeField = useStore((state) => state.updateNodeField);

  // Sync Logic
  useEffect(() => {
    if(data.outputName) setCurrName(data.outputName);
    if(data.outputType) setOutputType(data.outputType);
  }, [data.outputName, data.outputType]);

  const handleNameChange = (e) => {
    setCurrName(e.target.value);
    updateNodeField(id, 'outputName', e.target.value);
  };

  const handleTypeChange = (e) => {
    setOutputType(e.target.value);
    updateNodeField(id, 'outputType', e.target.value);
  };

  return (
    <BaseNode
      id={id}
      data={data}
      title="Output"
      icon={<MdOutput />}
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: 'value' }
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Name
          <input 
            type="text" 
            value={currName} 
            onChange={handleNameChange} 
            className="nodrag"
          />
        </label>
        <label style={{ fontSize: '11px', color: 'var(--text-secondary)' }}>
          Type
          <select 
            value={outputType} 
            onChange={handleTypeChange}
            className="nodrag"
          >
            <option value="Text">Text</option>
            <option value="File">Image</option>
          </select>
        </label>
      </div>
    </BaseNode>
  );
};