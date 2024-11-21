import React, { useState, useEffect, useRef } from 'react';
import SendIcon from '@mui/icons-material/Send';
import SmartToyIcon from '@mui/icons-material/SmartToy';
import PersonIcon from '@mui/icons-material/Person';
import { Box, Typography, TextField, IconButton } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import styles from './ai-agent.module.css';

const AiAgent = () => {
  const [prompt, setPrompt] = useState('');
  const [messages, setMessages] = useState([]);
  const [botTypingMessage, setBotTypingMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const chatboxRef = useRef(null);

  //** Auto Scroll **//
  useEffect(() => {
    if (chatboxRef.current) {
      chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight;
    }
  }, [messages, botTypingMessage]);

  //** Initial Bot Message **//
  useEffect(() => {
    typeResponse("I am PandAI, here to answer your questions about our app!");
  }, []);

  //** API Call **//
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    const userMessage = prompt.trim();
    setMessages((prev) => [...prev, { sender: 'user', text: userMessage }]);
    setPrompt('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai-brain', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userMessage }),
      });

      if (!res.ok) throw new Error('Failed to fetch response.');

      const data = await res.json();
      const botMessage = data.response?.trim() || '...';

      if (typeof botMessage !== 'string') {
        console.error('Invalid bot response:', botMessage);
        throw new Error('Invalid bot response.');
      }

      typeResponse(botMessage);
    } catch (error) {
      console.error('Error:', error);
      setMessages((prev) => [
        ...prev,
        { sender: 'bot', text: 'An error occurred. Please try again.' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  //** Typer Effect **//
  const typeResponse = (text) => {
    const characters = [...text];
    let index = 0;
    setBotTypingMessage('');

    const typingInterval = setInterval(() => {
      if (index < characters.length) {
        const nextChar = characters[index];
        setBotTypingMessage((prev) => prev + nextChar);
        index++;
      } else {
        clearInterval(typingInterval);
        setMessages((prev) => [...prev, { sender: 'bot', text }]);
        setBotTypingMessage('');
      }
    }, 10); // Typing Speed
  };

  return (
    <Box className={styles.chatOrb}>
      {/* Before Hover */}
      <Box className={styles.orbContent}>
        <SmartToyIcon fontSize="large" />
      </Box>
      {/* After Hover */}
      <Box className={styles.chatContent}>
        <Box ref={chatboxRef} className={styles.chatbox}>
          {messages.map((message, index) => (
            <Box
              key={index}
              className={
                message.sender === 'user'
                  ? styles.userMessageContainer
                  : styles.botMessageContainer
              }
            >
              {message.sender === 'bot' && (
                <SmartToyIcon className={styles.messageIcon} />
              )}
              <Typography
                className={
                  message.sender === 'user'
                    ? styles.userMessage
                    : styles.botMessage
                }
              >
                <ReactMarkdown>{message.text}</ReactMarkdown>
              </Typography>
              {message.sender === 'user' && (
                <PersonIcon className={styles.messageIcon} />
              )}
            </Box>
          ))}
          {botTypingMessage && (
            <Box className={styles.botMessageContainer}>
              <SmartToyIcon className={styles.messageIcon} />
              <Typography className={styles.botMessage}>
                <ReactMarkdown>{botTypingMessage}</ReactMarkdown>
              </Typography>
            </Box>
          )}
        </Box>
        <form onSubmit={handleSubmit} className={styles.form}>
          <TextField
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Type your message..."
            fullWidth
            className={styles.inputField}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e);
              }
            }}
            disabled={loading}
            sx={{
                '& .MuiOutlinedInput-root': {
                  '& fieldset': {
                    borderColor: 'black', // Default state
                  },
                  '&:hover fieldset': {
                    borderColor: 'black', // Hover state
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'black', // Focused state
                  },
                  '&.Mui-disabled fieldset': {
                    borderColor: 'black', // Disabled state
                  },
                },
            }}
          />
          <IconButton
            type="submit"
            color="primary"
            disabled={loading}
            className={styles.sendButton}
          >
            <SendIcon />
          </IconButton>
        </form>
      </Box>
    </Box>
  );
};

export default AiAgent;