import { Button } from "@/components/ui/button";
import { Plus, Settings, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

interface DashboardHeaderProps {
  onToggleSettings: () => void;
}

const DashboardHeader = ({ onToggleSettings }: DashboardHeaderProps) => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogout = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate('/');
    } catch (error) {
      console.error('Error logging out:', error);
      toast({
        title: "Error",
        description: "Failed to log out. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center justify-between">
      <div>
        <h1 className="text-3xl font-bold">Your Estimates</h1>
        <p className="text-muted-foreground mt-2">
          Create and manage your estimates
        </p>
      </div>
      <div className="flex gap-4">
        <Button onClick={handleLogout} variant="outline" className="gap-2">
          <LogOut className="h-4 w-4" />
          Sign Out
        </Button>
        <Button onClick={onToggleSettings} variant="outline" className="gap-2">
          <Settings className="h-4 w-4" />
          Business Settings
        </Button>
        <Button 
          onClick={() => navigate('/estimates/new')} 
          className="gap-2 bg-gradient-to-r from-violet-600 to-indigo-600 text-white hover:from-violet-700 hover:to-indigo-700 transition-all duration-200"
        >
          <Plus className="h-4 w-4" />
          New Estimate
        </Button>
      </div>
    </div>
  );
};

export default DashboardHeader;