// src/components/common/VoiceSearch.tsx
import React, { useState, useEffect, useRef } from 'react';
import { FaMicrophone, FaSpinner } from 'react-icons/fa';

interface VoiceSearchProps {
  onTranscript: (text: string) => void;
  onListening?: (isListening: boolean) => void;
  className?: string;
}

// ✅ Declare SpeechRecognition globally
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

// ✅ Use NodeJS.Timeout instead of NodeJS namespace
type TimeoutId = ReturnType<typeof setTimeout>;

const VoiceSearch: React.FC<VoiceSearchProps> = ({
  onTranscript,
  onListening,
  className = ''
}) => {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(true);
  const [transcript, setTranscript] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<TimeoutId | null>(null);

  // ✅ Check browser support
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      console.warn('Speech recognition not supported in this browser');
    }
  }, []);

  // ✅ Initialize speech recognition
  const startListening = () => {
    if (!isSupported) {
      alert('Voice search is not supported in your browser. Please use Chrome, Edge, or Safari.');
      return;
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognitionRef.current = recognition;

    // Configure recognition
    recognition.lang = 'en-US';
    recognition.continuous = false;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    // ✅ Start listening
    recognition.start();
    setIsListening(true);
    setIsProcessing(true);
    setTranscript('');

    if (onListening) onListening(true);

    // ✅ Auto-stop after 10 seconds if no speech
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      if (isListening) {
        stopListening();
      }
    }, 10000);

    // ✅ Event handlers
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }

      const transcriptText = finalTranscript || interimTranscript;
      setTranscript(transcriptText);

      // ✅ If we have final transcript, process it
      if (finalTranscript) {
        setIsProcessing(false);
        onTranscript(finalTranscript);
        stopListening();
      }
    };

    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      
      // ✅ Don't show error for 'no-speech' or 'aborted'
      if (event.error !== 'no-speech' && event.error !== 'aborted') {
        alert(`Voice search error: ${event.error}. Please try again.`);
      }
      
      setIsListening(false);
      setIsProcessing(false);
      if (onListening) onListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
      setIsProcessing(false);
      if (onListening) onListening(false);
      
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      // ✅ If we have interim transcript but no final, still use it
      if (transcript && !isProcessing) {
        onTranscript(transcript);
      }
    };
  };

  // ✅ Stop listening
  const stopListening = () => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        // Ignore errors when stopping
      }
    }
    setIsListening(false);
    setIsProcessing(false);
    if (onListening) onListening(false);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // ✅ Toggle listening
  const toggleListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch (error) {
          // Ignore
        }
      }
    };
  }, []);

  return (
    <button
      type="button"
      onClick={toggleListening}
      className={`relative p-2 rounded-full transition-all duration-300 ${
        isListening
          ? 'bg-red-500 text-white animate-pulse shadow-lg shadow-red-500/50'
          : 'bg-green-500 text-white hover:bg-[#D4AF37] hover:text-white hover:shadow-lg hover:shadow-[#D4AF37]/50 transform hover:scale-110'
      } ${className}`}
      title={isListening ? 'Stop listening...' : 'Voice search'}
      disabled={!isSupported}
    >
      {isProcessing ? (
        <FaSpinner className="animate-spin text-sm sm:text-base" />
      ) : (
        <FaMicrophone className="text-sm sm:text-base" />
      )}
      
      {/* ✅ Recording indicator dots */}
      {isListening && (
        <span className="absolute -top-1 -right-1 flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
        </span>
      )}
    </button>
  );
};

export default VoiceSearch;