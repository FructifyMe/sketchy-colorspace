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

interface EstimateHeaderProps {
  isEditing: boolean;
  onToggleEdit: () => void;
  onDelete: () => void;
  onNavigateBack: () => void;
}

const EstimateHeader = ({ 
  isEditing, 
  onToggleEdit, 
  onDelete, 
  onNavigateBack 
}: EstimateHeaderProps) => {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-bold">Estimate Details</h2>
      <div className="flex gap-2">
        <Button variant="outline" onClick={onNavigateBack}>
          Back to Dashboard
        </Button>
        <Button 
          variant="secondary"
          onClick={onToggleEdit}
        >
          {isEditing ? 'Done Editing' : 'Edit'}
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