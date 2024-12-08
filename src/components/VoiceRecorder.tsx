import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { processAudioData } from '@/utils/audioProcessing';
import type { TranscriptionResult } from '@/types/estimate';

interface VoiceRecorderProps {
  onTranscriptionComplete: (data: TranscriptionResult) => void;
}

const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onTranscriptionComplete }) => {
  const { toast } = useToast();
  const {
    isRecording,
    isProcessing,
    setIsProcessing,
    audioChunksRef,
    startRecording,
    stopRecording
  } = useAudioRecorder();

  const handleStopRecording = async () => {
    stopRecording();
    
    // Wait a bit for the final chunks to be processed
    setTimeout(async () => {
      setIsProcessing(true);
      
      try {
        if (audioChunksRef.current.length === 0) {
          throw new Error("No audio data recorded. Please try recording again.");
        }

        const result = await processAudioData(audioChunksRef.current);
        onTranscriptionComplete({
          description: result.transcriptionText,
          items: result.items
        });
        
        toast({
          title: "Processing complete",
          description: "Your estimate has been created",
        });
      } catch (error) {
        console.error("Error processing audio:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to process audio",
        });
      } finally {
        setIsProcessing(false);
      }
    }, 1000); // Wait 1 second for final data
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
          onClick={handleStopRecording}
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
      {isRecording && (
        <div className="text-sm text-emerald-600">
          Recording in progress...
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;
