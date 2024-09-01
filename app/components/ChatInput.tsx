import React, { useState } from 'react';

interface ChatInputProps {
  onSubmit: (input: string) => void;
  placeholder?: string;
}

const ChatInput: React.FC<ChatInputProps> = ({ onSubmit, placeholder = 'Type your message...' }) => {
  const [input, setInput] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit} className="p-4 border-t">
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={placeholder}
        className="w-full p-2 rounded border"
      />
    </form>
  );
};

export default ChatInput;