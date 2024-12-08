import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";

interface DashboardHeaderProps {
  onCreateTemplate: () => void;
  onToggleSettings: () => void;
}

const DashboardHeader = ({ onCreateTemplate, onToggleSettings }: DashboardHeaderProps) => {
  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Your Templates</h1>
        <p className="text-muted-foreground mt-2">
          Manage and create new templates for your estimates
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={onToggleSettings} variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Business Settings
        </Button>
        <Button onClick={onCreateTemplate} className="gap-2">
          <Plus className="h-4 w-4" />
          New Template
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;