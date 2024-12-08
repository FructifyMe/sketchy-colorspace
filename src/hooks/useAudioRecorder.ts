import { useState, useRef } from 'react';
import { useToast } from "@/components/ui/use-toast";

export const useAudioRecorder = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const getSupportedMimeType = () => {
    const types = [
      'audio/webm',
      'audio/mp4',
      'audio/ogg',
      'audio/wav',
      'audio/mp3'
    ];
    
    for (const type of types) {
      if (MediaRecorder.isTypeSupported(type)) {
        console.log("Found supported MIME type:", type);
        return type;
      }
    }
    return null;
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mimeType = getSupportedMimeType();
      
      if (!mimeType) {
        throw new Error("No supported audio MIME type found");
      }

      console.log("Creating MediaRecorder with MIME type:", mimeType);
      mediaRecorderRef.current = new MediaRecorder(stream, {
        mimeType: mimeType
      });
      
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      console.log("Started recording with format:", mimeType);
      toast({
        title: "Recording started",
        description: "Speak clearly about the job details",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Could not start recording",
      });
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