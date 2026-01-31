// frontend/src/nodes/integrationNodes.js
import { useState, useEffect } from 'react';
import { MdTimer, MdApi, MdStorage, MdMessage, MdNote, MdCloudUpload, MdCheckCircle } from 'react-icons/md';
import { BaseNode } from './BaseNode';
import { Position } from 'reactflow';
import { useStore } from '../store';

export const TimerNode = ({ id, data, selected }) => (
    <BaseNode id={id} data={data} title="Timer" icon={<MdTimer />} selected={selected} handles={[{ type: 'source', position: Position.Right, id: 'time' }]}>
       <div style={{fontSize: '12px', color: '#aaa'}}>Runs every 5 mins</div>
    </BaseNode>
);

export const SlackNode = ({ id, data, selected }) => {
    const [channel, setChannel] = useState(data.channel || '#general');
    const updateNodeField = useStore((state) => state.updateNodeField);

    return (
        <BaseNode id={id} data={data} title="Slack" icon={<MdMessage />} selected={selected} handles={[{ type: 'target', position: Position.Left, id: 'msg' }]}>
            <label style={{display:'block', fontSize:'11px', color:'var(--text-secondary)', marginBottom:'4px'}}>Channel</label>
            <input 
                type="text" 
                value={channel}
                onChange={(e) => { setChannel(e.target.value); updateNodeField(id, 'channel', e.target.value); }}
                className="nodrag"
                style={{width: '100%'}} 
            />
        </BaseNode>
    );
};

export const DatabaseNode = ({ id, data, selected }) => {
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fileName, setFileName] = useState(data.fileName || '');
    const updateNodeField = useStore((state) => state.updateNodeField);

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setUploading(true);
            setProgress(0);
        }
    };

    // To handle the interval (Prevents Render Loop Error)
    useEffect(() => {
        let interval;
        if (uploading) {
            interval = setInterval(() => {
                setProgress((prev) => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setUploading(false);
                        setFileName("knowledge_base.pdf"); // Fake name
                        updateNodeField(id, 'fileName', "knowledge_base.pdf");
                        return 100;
                    }
                    return prev + 10;
                });
            }, 200);
        }
        return () => clearInterval(interval);
    }, [uploading, id, updateNodeField]);

    return (
        <BaseNode id={id} data={data} title="Knowledge Base" icon={<MdStorage />} selected={selected} handles={[{ type: 'source', position: Position.Right, id: 'data' }]}>
            <div style={{display: 'flex', flexDirection: 'column', gap: '10px'}}>
                <div style={{fontSize: '11px', color: 'var(--text-secondary)'}}>
                    Upload PDF/CSV to index.
                </div>
                
                {!fileName && !uploading && (
                     <label style={{
                         border: '1px dashed var(--border-color)', borderRadius: '6px', padding: '10px',
                         display: 'flex', flexDirection: 'column', alignItems: 'center', cursor: 'pointer',
                         color: 'var(--text-secondary)', fontSize: '10px'
                     }}>
                         <MdCloudUpload size={20} />
                         <span>Click to Upload</span>
                         <input type="file" style={{display: 'none'}} onChange={handleFileChange} />
                     </label>
                )}

                {uploading && (
                    <div style={{width: '100%', background: 'var(--border-color)', height: '6px', borderRadius: '3px', overflow: 'hidden'}}>
                        <div style={{width: `${progress}%`, background: 'var(--primary-color)', height: '100%', transition: 'width 0.2s'}}></div>
                    </div>
                )}

                {fileName && !uploading && (
                    <div style={{display: 'flex', alignItems: 'center', gap: '5px', fontSize: '11px', color: 'var(--success-color)'}}>
                        <MdCheckCircle />
                        <span style={{color: 'var(--text-primary)'}}>{fileName}</span>
                    </div>
                )}
            </div>
        </BaseNode>
    );
};

export const APINode = ({ id, data, selected }) => {
    const [url, setUrl] = useState(data.url || '');
    const updateNodeField = useStore((state) => state.updateNodeField);

    return (
        <BaseNode id={id} data={data} title="API Call" icon={<MdApi />} selected={selected} handles={[
            { type: 'target', position: Position.Left, id: 'req' },
            { type: 'source', position: Position.Right, id: 'res' }
        ]}>
            <label style={{display:'block', fontSize:'11px', color:'var(--text-secondary)', marginBottom:'4px'}}>Endpoint</label>
            <input 
                type="text" 
                value={url}
                onChange={(e) => { setUrl(e.target.value); updateNodeField(id, 'url', e.target.value); }}
                className="nodrag"
                placeholder="https://api..." 
                style={{width: '100%'}} 
            />
        </BaseNode>
    );
};

export const NoteNode = ({ id, data, selected }) => {
    const [text, setText] = useState(data.text || '');
    const updateNodeField = useStore((state) => state.updateNodeField);

    return (
        <BaseNode id={id} data={data} title="Note" icon={<MdNote />} selected={selected}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <textarea
                    className="nodrag noscroll" 
                    value={text}
                    onChange={(e) => { setText(e.target.value); updateNodeField(id, 'text', e.target.value); }}
                    placeholder="Type your note..."
                    style={{
                        width: '100%', height: '100%', resize: 'none', background: 'transparent',
                        border: 'none', color: 'var(--text-primary)', fontFamily: 'inherit',
                        outline: 'none', fontSize: '12px', padding: '0'
                    }}
                />
            </div>
        </BaseNode>
    );
};