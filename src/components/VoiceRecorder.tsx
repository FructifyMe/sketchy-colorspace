import React, { useState, useRef } from 'react';
import { Button } from "@/components/ui/button";
import { pipeline, AutomaticSpeechRecognitionOutput } from '@huggingface/transformers';
import { useToast } from "@/components/ui/use-toast";

interface VoiceRecorderProps {
  onTranscriptionComplete: (data: {
    description: string;
    items: Array<{
      name: string;
      quantity?: number;
      price?: number;
    }>;
  }) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const { toast } = useToast();

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      audioChunksRef.current = [];

      mediaRecorderRef.current.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorderRef.current.onstop = async () => {
        await processAudio();
      };

      mediaRecorderRef.current.start();
      setIsRecording(true);
      
      console.log("Started recording");
      toast({
        title: "Recording started",
        description: "Speak clearly about the job details",
      });
    } catch (error) {
      console.error("Error starting recording:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Could not access microphone",
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

  const processAudio = async () => {
    setIsProcessing(true);
    try {
      const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
      
      // Convert audio to base64
      const audioArrayBuffer = await audioBlob.arrayBuffer();
      const audioArray = new Uint8Array(audioArrayBuffer);
      
      // Initialize the transcription pipeline
      const transcriber = await pipeline(
        "automatic-speech-recognition",
        "openai/whisper-small"
      );

      // Transcribe the audio using the array buffer
      const transcription = await transcriber({ data: audioArray });
      const transcriptionText = Array.isArray(transcription) 
        ? transcription[0]?.text || ''
        : transcription.text || '';

      console.log("Transcription:", transcriptionText);

      // Initialize the text classification pipeline for entity extraction
      const classifier = await pipeline(
        "text-classification",
        "Xenova/bert-base-multilabel"
      );

      // Analyze the transcription
      const analysis = await classifier(transcriptionText);
      console.log("Analysis:", analysis);

      // Extract relevant information
      const estimateData = {
        description: transcriptionText,
        items: extractItemsFromText(transcriptionText)
      };

      onTranscriptionComplete(estimateData);
      
      toast({
        title: "Processing complete",
        description: "Your estimate has been created",
      });
    } catch (error) {
      console.error("Error processing audio:", error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to process audio",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const extractItemsFromText = (text: string) => {
    const items = [];
    const lines = text.split('.');
    
    for (const line of lines) {
      const priceMatch = line.match(/\$(\d+(\.\d{2})?)/);
      const quantityMatch = line.match(/(\d+)\s*(pieces?|units?|items?)/i);
      
      if (priceMatch || quantityMatch) {
        items.push({
          name: line.trim(),
          price: priceMatch ? parseFloat(priceMatch[1]) : undefined,
          quantity: quantityMatch ? parseInt(quantityMatch[1]) : undefined,
        });
      }
    }
    
    return items;
  };

  return (
    <div className="space-y-4 p-4 border rounded-lg bg-white shadow-sm">
      <h3 className="text-lg font-semibold text-gray-900">Voice Recording</h3>
      <div className="flex gap-4">
        <Button
          onClick={startRecording}
          disabled={isRecording || isProcessing}
          className="bg-emerald-600 hover:bg-emerald-700"
        >
          Start Recording
        </Button>
        <Button
          onClick={stopRecording}
          disabled={!isRecording || isProcessing}
          className="bg-red-600 hover:bg-red-700"
        >
          Stop Recording
        </Button>
      </div>
      {isProcessing && (
        <div className="text-sm text-gray-600">
          Processing your recording...
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;