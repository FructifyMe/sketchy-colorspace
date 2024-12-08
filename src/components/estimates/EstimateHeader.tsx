import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface EstimateHeaderProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onNavigateBack: () => void;
  estimateId: string;
}

const EstimateHeader = ({ 
  isEditing, 
  onToggleEdit, 
  onDelete, 
  onNavigateBack,
  estimateId
}: EstimateHeaderProps) => {
  const [emailAddress, setEmailAddress] = useState("");
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    setIsSending(true);
    try {
      const { data, error } = await supabase.functions.invoke('send-estimate', {
        body: {
          estimateId,
          to: emailAddress,
        },
      });

      if (error) throw error;

      toast({
        title: "Email Sent",
        description: "The estimate has been sent successfully.",
      });
    } catch (error) {
      console.error('Error sending email:', error);
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
      setEmailAddress("");
    }
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Estimate Details</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onNavigateBack}>
          Back to Dashboard
        </Button>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline">
              <Mail className="mr-2 h-4 w-4" />
              Email
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Send Estimate</DialogTitle>
              <DialogDescription>
                Send this estimate to your client via email.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  type="email"
                  value={emailAddress}
                  onChange={(e) => setEmailAddress(e.target.value)}
                  placeholder="client@example.com"
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={handleSendEmail}
                disabled={!emailAddress || isSending}
              >
                {isSending ? "Sending..." : "Send Email"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button 
          variant="secondary"
          onClick={onToggleEdit}
        >
          {isEditing ? 'Save' : 'Edit'}
        </Button>

        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive">Delete</Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the estimate.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={onDelete}>
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default EstimateHeader;