import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      // Specify MP3 as the recording format
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: 'audio/mp3'
      });
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      console.log("Started recording in MP3 format");
      toast({
        title: "Recording started",
        description: "Speak clearly about the job details",
      });
    } catch (error) {
      // If MP3 is not supported, try WAV
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream, {
          mimeType: 'audio/wav'
        });
        audioChunksRef.current = [];

        mediaRecorderRef.current.ondataavailable = (event) => {
          audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.start();
        setIsRecording(true);
        
        console.log("Started recording in WAV format");
        toast({
          title: "Recording started",
          description: "Speak clearly about the job details",
        });
      } catch (fallbackError) {
        console.error("Error starting recording:", fallbackError);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Could not access microphone or unsupported audio format",
        });
      }
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      console.log("Stopped recording");
      toast({
        title: "Recording stopped",
        description: "Processing your audio...",
      });
    }
  };

  return {
    isRecording,
    isProcessing,
    setIsProcessing,
    audioChunksRef,
    startRecording,
    stopRecording
  };
};