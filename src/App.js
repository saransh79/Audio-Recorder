import React, { useState, useRef } from 'react';
import './App.css';

const App = () => {
  const [messages, setMessages] = useState([]);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  const handleRecordStart = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      const audioChunks = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunks.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunks, { type: 'audio/wav' });
        const audioUrl = URL.createObjectURL(audioBlob);
        setMessages([...messages, { text: 'Audio Recorded', type: 'audio', audioUrl }]);
        setIsRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder; 

      mediaRecorder.start();
      setMessages([...messages, { text: 'Recording audio...', type: 'info' }]);
      setIsRecording(true);
    } catch (error) {
      console.error('Error accessing microphone:', error);
      setMessages([...messages, { text: 'Error accessing microphone', type: 'error' }]);
      setIsRecording(false);
    }
  };

  const handleRecordStop = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
  };

  const handlePlayback = (audioUrl) => {
    if (audioRef.current) {
      audioRef.current.src = audioUrl;
      audioRef.current.play();
    }
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Audio Recorder</h1>
        <div className="Chat-container">
          {messages.map((message, index) => (
            <div key={index} className={`Message ${message.type}`}>
              {message.type === 'audio' ? (
                <button onClick={() => handlePlayback(message.audioUrl)}>Play Audio</button>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          ))}
        </div>
        {isRecording ? (
          <button onClick={handleRecordStop}>Stop Recording</button>
        ) : (
          <button onClick={handleRecordStart}>Record Audio</button>
        )}
        <audio ref={audioRef} controls />
      </header>
    </div>
  );
};

export default App;
