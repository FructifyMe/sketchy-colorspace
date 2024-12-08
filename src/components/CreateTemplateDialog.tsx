import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import TemplateForm from "./TemplateForm";

interface CreateTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const CreateTemplateDialog = ({ open, onOpenChange }: CreateTemplateDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Template</DialogTitle>
        </DialogHeader>
        <TemplateForm onClose={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  );
};

export default CreateTemplateDialog;