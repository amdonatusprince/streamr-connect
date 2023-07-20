import React, { useState, useEffect } from 'react';
import { Stream, StreamrClient } from 'streamr-client';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
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
    // Function to create the data stream
    const createStream = async () => {
      try {
        // Replace '/your/namespace/yourstreamname' with your desired stream ID
        const stream = await streamr.getOrCreateStream({
          id: '/amdonatusprince',
        });
        console.log('Stream created:', stream.id);
        // const streamm = await streamr.getStream(stream.id);
        // console.log("get stream", streamm)
      } catch (error) {
        console.error('Error creating the stream:', error);
      }
    };

    createStream();
    
  }, []);

  useEffect(() => {
    // Subscribe to incoming messages when the component mounts
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

    // Unsubscribe from the data stream when the component unmounts
    return () => {
      streamr.unsubscribe();
    };
  }, []);


  return (
    <>
    <h1>My Streamr Dapp 💬</h1>
      <div>
      <h2>Incoming Messages 📩 </h2>
       {/* Display incoming messages in this div */}
       {messages.map((msg, index) => (
          <p key={index}>{msg}</p>
        ))}
      </div>
      <h2>Publish To Streamr 📨 </h2>
      <div className="card">
        {/* Input field for typing the message */}
        <input type="text" value={message} onChange={(e) => setMessage(e.target.value)} />
        {/* Submit button */}
        <button onClick={handleSubmit}>Send</button>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
