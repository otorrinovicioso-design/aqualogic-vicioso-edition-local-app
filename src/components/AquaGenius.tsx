import React, { useState } from 'react';
import { Send, Bot } from 'lucide-react';
import { askAquaGenius } from '../services/geminiService';

export const AquaGenius: React.FC<{context: any}> = ({ context }) => {
  const [input, setInput] = useState('');
  const [resp, setResp] = useState('');
  const handle = async () => {
    const r = await askAquaGenius(input, context);
    setResp(r);
  };
  return (
    <div className="p-4 glass rounded-3xl">
      <p className="text-aqua-400 mb-4">{resp}</p>
      <div className="flex gap-2">
        <input className="flex-1 bg-white/5 p-2 rounded-xl" value={input} onChange={e => setInput(e.target.value)} />
        <button onClick={handle}><Send /></button>
      </div>
    </div>
  );
};
