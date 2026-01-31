// frontend/src/nodes/BaseNode.js
import { Handle, NodeResizer } from 'reactflow'; 
import { useStore } from '../store';
import { MdExtension } from 'react-icons/md';
import { shallow } from 'zustand/shallow';

export const BaseNode = ({ id, data, title, children, handles = [], icon, selected }) => {
  const removeNode = useStore((state) => state.removeNode);
  
  // OPTIMIZATION - Instead of subscribing to the whole array, we select ONLY the boolean we need.
  // We use a selector function to check specific inclusion.
  const isActive = useStore(
    (state) => state.activeNodes.includes(id),
    shallow // Prevents re-renders unless true/false flips
  );

  return (
    <div 
      style={{ 
        width: '100%', 
        height: '100%', 
        minWidth: '200px', 
        minHeight: '80px',
        
        // Styling Logic
        border: isActive 
            ? '2px solid var(--primary-color)' 
            : selected 
                ? '2px solid var(--primary-color)' 
                : '1px solid var(--border-color)', 
                
        backgroundColor: 'var(--node-bg)', 
        borderRadius: '12px',
        
        boxShadow: isActive 
            ? '0 0 15px 2px rgba(99, 102, 241, 0.4)' 
            : selected 
                ? '0 0 10px rgba(99, 102, 241, 0.3)' 
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1)', 
                
        color: 'var(--text-primary)', 
        display: 'flex', 
        flexDirection: 'column',
        position: 'relative', 
        fontFamily: 'Inter, sans-serif',
        transition: 'all 0.2s ease-in-out'
      }}
    >
      <NodeResizer 
        color="var(--primary-color)" 
        isVisible={selected} 
        minWidth={200} 
        minHeight={80} 
      />

      {/* Close Button */}
      <button 
        onClick={() => removeNode(id)}
        style={{
            position: 'absolute',
            top: '8px',
            right: '8px',
            background: 'transparent',
            border: 'none',
            color: 'var(--text-secondary)',
            cursor: 'pointer',
            fontSize: '14px',
            zIndex: 10
        }}
        onMouseOver={(e) => e.target.style.color = 'var(--danger-color)'}
        onMouseOut={(e) => e.target.style.color = 'var(--text-secondary)'}
      >
        ✕
      </button>

      {/* Header */}
      <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          padding: '12px 12px 8px 12px',
          borderBottom: '1px solid transparent' 
      }}>
        <span style={{ fontSize: '18px', color: 'var(--text-secondary)', display: 'flex' }}>
            {icon || <MdExtension />}
        </span>
        <span style={{ fontWeight: '600', fontSize: '14px' }}>{title}</span>
      </div>

      {/* Content */}
      <div style={{ 
          flex: 1, 
          display: 'flex', 
          flexDirection: 'column', 
          gap: '8px', 
          padding: '0 12px 12px 12px',
          overflow: 'hidden' 
      }}>
        {children}
      </div>

      {/* Handles */}
      {handles.map((handle, index) => (
        <Handle
          key={`${id}-${handle.id}-${index}`}
          type={handle.type}
          position={handle.position}
          id={`${id}-${handle.id}`}
          style={{
            ...handle.style,
          }}
        />
      ))}
    </div>
  );
};