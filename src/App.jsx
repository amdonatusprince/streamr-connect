import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  // Function to fetch messages (mocked API call)
  // rhhnn
  const fetchMessages = async () => {
    try {
      const response = await axios.get(CHAT_SERVER_URL);
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  // Function to handle form submission
  const handleSubmit = (event) => {
    event.preventDefault();
    if (newMessage.trim() === "") return;
    // Replace the following line with your API call to send messages to the chat server
    // For this example, we're just appending the new message to the messages array.
    setMessages([...messages, { text: newMessage, sender: "You" }]);
    setNewMessage("");
  };


  return (
    <>
      <div>
      <h1>Received Messages</h1>
      {messages.map((message, index) => (
          <div key={index} className="message">
            <strong>{message.sender}:</strong> {message.text}
          </div>
        ))}
      </div>
      <h1>Streamr Chat</h1>
      <div className="card">
      <form onSubmit={handleSubmit} className="message-input-form">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Type your message..."
        />
        <button type="submit">Send</button>
      </form>
      </div>
      <p className="read-the-docs">
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
