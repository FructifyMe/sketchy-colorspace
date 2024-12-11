import { Button } from "@/components/ui/button";
import { Plus, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface DashboardHeaderProps {
  onToggleSettings: () => void;
}

const DashboardHeader = ({ onToggleSettings }: DashboardHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Your Estimates</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your estimates
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={onToggleSettings} variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Business Settings
        </Button>
        <Button onClick={() => navigate('/estimates/new')} className="gap-2">
          <Plus className="h-4 w-4" />
          New Estimate
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;