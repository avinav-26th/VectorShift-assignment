// frontend/src/nodes/llmNode.js
import { Position } from 'reactflow';
import { BaseNode } from './BaseNode';
import { MdChat } from 'react-icons/md';

export const LLMNode = ({ id, data, selected }) => {
  return (
    <BaseNode
      id={id}
      data={data}
      title="LLM"
      icon={<MdChat />}
      selected={selected}
      handles={[
        { type: 'target', position: Position.Left, id: 'system', style: { top: '30%' } },
        { type: 'target', position: Position.Left, id: 'prompt', style: { top: '70%' } },
        { type: 'source', position: Position.Right, id: 'response' },
      ]}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', height: '100%' }}>
        
        {/* Main info area that grows */}
        <div style={{ flex: 1, overflow: 'hidden' }}>
            <div style={{ fontSize: '11px', fontWeight: 'bold', color: 'var(--text-primary)' }}>
                System Prompt:
            </div>
            <div style={{ 
                fontSize: '11px', color: 'var(--text-secondary)', 
                fontStyle: 'italic', whiteSpace: 'pre-wrap', lineHeight: '1.3' 
            }}>
                {data.systemMessage || "You are a helpful assistant..."}
            </div>
        </div>
        
        {/* Footer info */}
        <div style={{ 
            fontSize: '10px', color: 'var(--primary-color)', 
            marginTop: 'auto', paddingTop: '5px', borderTop: '1px solid var(--border-color)' 
        }}>
            <span>Model: {data.model || 'gpt-3.5'}</span> | 
            <span> Temp: {data.temperature || 0.5}</span>
        </div>
      </div>
    </BaseNode>
  );
};