import React from 'react';
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { useAudioRecorder } from '@/hooks/useAudioRecorder';
import { processAudioData } from '@/utils/audioProcessing';

interface VoiceRecorderProps {
  onTranscriptionComplete: (data: any) => void;
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
    
    setTimeout(async () => {
      setIsProcessing(true);
      
      try {
        if (audioChunksRef.current.length === 0) {
          throw new Error("No audio data recorded");
        }

        console.log("Processing audio chunks:", audioChunksRef.current.length);
        const result = await processAudioData(audioChunksRef.current);
        console.log("Processed audio result:", result);
        
        onTranscriptionComplete({
          description: result.transcriptionText,
          items: result.items,
          clientInfo: result.clientInfo
        });
        
        toast({
          title: "Success",
          description: "Audio processed successfully",
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
    }, 1000);
  };

  return (
    <div className="w-full space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">Voice Recording</h3>
      <div className="flex gap-4 justify-center">
        <Button
          onClick={startRecording}
          disabled={isRecording || isProcessing}
          className="bg-emerald-600 hover:bg-emerald-700 min-w-[200px]"
        >
          Start Recording
        </Button>
        <Button
          onClick={handleStopRecording}
          disabled={!isRecording || isProcessing}
          className="bg-red-600 hover:bg-red-700 min-w-[200px]"
        >
          Stop Recording
        </Button>
      </div>
      {isProcessing && (
        <div className="text-sm text-gray-600 text-center">
          Processing your recording...
        </div>
      )}
      {isRecording && (
        <div className="text-sm text-emerald-600 text-center">
          Recording in progress...
        </div>
      )}
    </div>
  );
};

export default VoiceRecorder;