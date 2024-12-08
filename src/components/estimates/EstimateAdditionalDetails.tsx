import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";

interface EstimateAdditionalDetailsProps {
  terms: string | null;
  paymentPolicy: string | null;
  notes: string | null;
  showTerms: boolean;
  showPaymentPolicy: boolean;
  expirationDate: string | null;
  isEditing: boolean;
  onUpdate: (updates: {
    terms?: string;
    paymentPolicy?: string;
    notes?: string;
    showTerms?: boolean;
    showPaymentPolicy?: boolean;
  }) => void;
}

const EstimateAdditionalDetails = ({
  terms,
  paymentPolicy,
  notes,
  showTerms,
  showPaymentPolicy,
  expirationDate,
  isEditing,
  onUpdate,
}: EstimateAdditionalDetailsProps) => {
  return (
    <div className="space-y-6">
      {expirationDate && (
        <div className="text-sm text-muted-foreground">
          Valid until: {format(new Date(expirationDate), 'PPP')}
        </div>
      )}

      {notes && (
        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle>Notes</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={notes}
                onChange={(e) => onUpdate({ notes: e.target.value })}
                placeholder="Add notes..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="whitespace-pre-wrap">{notes}</p>
            )}
          </CardContent>
        </Card>
      )}

      {isEditing && (
        <div className="flex items-center space-x-4">
          <Switch
            id="show-terms"
            checked={showTerms}
            onCheckedChange={(checked) => onUpdate({ showTerms: checked })}
          />
          <Label htmlFor="show-terms">Show Terms & Conditions</Label>

          <Switch
            id="show-payment-policy"
            checked={showPaymentPolicy}
            onCheckedChange={(checked) => onUpdate({ showPaymentPolicy: checked })}
          />
          <Label htmlFor="show-payment-policy">Show Payment Policy</Label>
        </div>
      )}

      {showTerms && (
        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle>Terms & Conditions</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={terms || ''}
                onChange={(e) => onUpdate({ terms: e.target.value })}
                placeholder="Enter terms and conditions..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="whitespace-pre-wrap">{terms}</p>
            )}
          </CardContent>
        </Card>
      )}

      {showPaymentPolicy && (
        <Card className="print:shadow-none print:border-none">
          <CardHeader>
            <CardTitle>Payment Policy</CardTitle>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={paymentPolicy || ''}
                onChange={(e) => onUpdate({ paymentPolicy: e.target.value })}
                placeholder="Enter payment policy..."
                className="min-h-[100px]"
              />
            ) : (
              <p className="whitespace-pre-wrap">{paymentPolicy}</p>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default EstimateAdditionalDetails;