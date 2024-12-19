import { Card, CardHeader, CardContent } from "@/components/ui/card";
import VoiceRecorder from '../VoiceRecorder';

interface VoiceRecordingSectionProps {
  onTranscriptionComplete: (data: any) => void;
}

const VoiceRecordingSection = ({ onTranscriptionComplete }: VoiceRecordingSectionProps) => {
  return (
    <Card className="mb-4 sm:mb-6">
      <CardHeader>
        <h3 className="text-lg sm:text-xl font-semibold text-center">Record Your Estimate Details</h3>
      </CardHeader>
      <CardContent className="space-y-4 p-4 sm:p-6">
        <p className="text-sm sm:text-base text-muted-foreground text-center max-w-md mx-auto">
          Simply speak into your device to create an estimate. Describe the work, 
          pricing, and client details naturally.
        </p>
        <div className="flex justify-center">
          <VoiceRecorder onTranscriptionComplete={onTranscriptionComplete} />
        </div>
      </CardContent>
    </Card>
  );
};

export default VoiceRecordingSection;