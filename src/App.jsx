import React, { useState, useEffect } from 'react';
import { Stream, StreamrClient } from 'streamr-client';
import './App.css'

const ETHEREUM_PRIVATE_KEY = import.meta.env.VITE_REACT_APP_PRIVATE_KEY;

const streamr = new StreamrClient({
  auth: {
    privateKey: ETHEREUM_PRIVATE_KEY,
  },
});

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [streamId, setStreamId] = useState('');

  const handleSubmit = async () => {
    if (message.trim() !== '') {
      try {
        // Publish the message to the data stream
        await streamr.publish('/amdonatusprince', { message });
        setMessage('');
      } catch (error) {
        console.error('Error publishing message:', error);
      }
    }
  };

  useEffect(() => {
    // Function to create the data stream and subscribe to incoming messages
    const createStreamAndSubscribe = async () => {
      try {
        // creating or getting stream
        const stream = await streamr.getOrCreateStream({
          id: '/amdonatusprince',
        });
        setStreamId(stream.id);

        // Subscribe to incoming messages
        const subscription = streamr.subscribe(
          {
            id: '/amdonatusprince',
          },
          (message) => {
            // 'message' contains the incoming data
            const incomingMessage = message;
            setMessages((prevMessages) => [...prevMessages, incomingMessage]);
          },
          (error) => {
            console.error('Error subscribing to the data stream:', error);
          }
        );
      } catch (error) {
        console.error('Error creating the stream:', error);
      }
    };

    createStreamAndSubscribe();
  }, []);

  return (
    <>
      <h1>My Streamr Dapp 💬</h1>
      <div>
        <p>Stream ID: <strong>{streamId}</strong></p>
        <h2>Incoming Messages 📩</h2>
        {/* Display incoming messages in this div */}
        {messages.map((msgObj, index) => (
          <p key={index}>
            <strong>You:</strong> {msgObj.message}
          </p>
        ))}
      </div>
      <h2>Publish To Streamr 📨</h2>
      <div className="card">
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        <button onClick={handleSubmit}>Send</button>
      </div>
      <p className="read-the-docs">Made with ❤️ for Streamr Network</p>
    </>
  );
}

export default App;

