import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface EstimateNotesProps {
  notes: string | null;
  isEditing: boolean;
  onUpdate: (notes: string) => void;
}

const EstimateNotes = ({ notes, isEditing, onUpdate }: EstimateNotesProps) => {
  if (!notes && !isEditing) return null;

  return (
    <Card className="print:shadow-none print:border-none">
      <CardHeader>
        <CardTitle>Notes</CardTitle>
      </CardHeader>
      <CardContent>
        {isEditing ? (
          <Textarea
            value={notes || ''}
            onChange={(e) => onUpdate(e.target.value)}
            placeholder="Add notes..."
            className="min-h-[100px]"
          />
        ) : (
          <p className="whitespace-pre-wrap">{notes}</p>
        )}
      </CardContent>
    </Card>
  );
};

export default EstimateNotes;