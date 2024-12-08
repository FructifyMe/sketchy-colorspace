import { Card } from "@/components/ui/card";
import VoiceRecorder from '../VoiceRecorder';

interface VoiceRecordingSectionProps {
  onTranscriptionComplete: (data: any) => void;
}

const VoiceRecordingSection = ({ onTranscriptionComplete }: VoiceRecordingSectionProps) => {
  return (
    <Card className="mb-6">
      <div className="p-6 text-center space-y-4">
        <h3 className="text-lg font-semibold">Record Your Estimate Details</h3>
        <p className="text-gray-600">
          Simply speak into your device to create an estimate. Describe the work, 
          pricing, and client details naturally.
        </p>
        <VoiceRecorder onTranscriptionComplete={onTranscriptionComplete} />
      </div>
    </Card>
  );
};

export default VoiceRecordingSection;