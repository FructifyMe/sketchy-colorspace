import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
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
    <div className="space-y-6 print:space-y-4">
      {expirationDate && (
        <div className="text-sm text-gray-600">
          Valid until: {format(new Date(expirationDate), 'PPP')}
        </div>
      )}

      {notes && (
        <div className="print:border-t print:pt-4">
          {isEditing ? (
            <Textarea
              value={notes}
              onChange={(e) => onUpdate({ notes: e.target.value })}
              placeholder="Add notes..."
              className="min-h-[100px]"
            />
          ) : (
            <div className="space-y-2">
              <h3 className="font-medium">Notes</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{notes}</p>
            </div>
          )}
        </div>
      )}

      {isEditing && (
        <div className="flex items-center space-x-4 print:hidden">
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

      {showTerms && terms && (
        <div className="print:border-t print:pt-4">
          {isEditing ? (
            <Textarea
              value={terms}
              onChange={(e) => onUpdate({ terms: e.target.value })}
              placeholder="Enter terms and conditions..."
              className="min-h-[100px]"
            />
          ) : (
            <div className="space-y-2">
              <h3 className="font-medium">Terms & Conditions</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{terms}</p>
            </div>
          )}
        </div>
      )}

      {showPaymentPolicy && paymentPolicy && (
        <div className="print:border-t print:pt-4">
          {isEditing ? (
            <Textarea
              value={paymentPolicy}
              onChange={(e) => onUpdate({ paymentPolicy: e.target.value })}
              placeholder="Enter payment policy..."
              className="min-h-[100px]"
            />
          ) : (
            <div className="space-y-2">
              <h3 className="font-medium">Payment Policy</h3>
              <p className="text-gray-600 whitespace-pre-wrap">{paymentPolicy}</p>
            </div>
          )}
        </div>
      )}

      <div className="mt-16 print:block hidden border-t pt-8">
        <div className="w-64 border-t border-black mx-auto text-center pt-2">
          Customer Signature
        </div>
      </div>
    </div>
  );
};

export default EstimateAdditionalDetails;