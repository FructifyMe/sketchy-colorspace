import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import RecentEstimates from "@/components/dashboard/RecentEstimates";
import BusinessSettingsCard from "@/components/dashboard/BusinessSettingsCard";

const DashboardPage = () => {
  const [showSettings, setShowSettings] = useState(false);
  const { toast } = useToast();
  
  const { data: estimates, isLoading: estimatesLoading } = useQuery({
    queryKey: ['estimates'],
    queryFn: async () => {
      console.log("Fetching estimates for dashboard");
      const { data, error } = await supabase
        .from('estimates')
        .select('*')
        .is('deleted', false)  // Only fetch non-deleted estimates
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching estimates:", error);
        throw error;
      }

      console.log("Fetched estimates:", data);
      return data as Database['public']['Tables']['estimates']['Row'][];
    },
    // Disable caching to always fetch fresh data
    staleTime: 0,
    cacheTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: true
  });

  return (
    <div className="container mx-auto p-6 space-y-8">
      <DashboardHeader
        onToggleSettings={() => setShowSettings(!showSettings)}
      />

      {showSettings && <BusinessSettingsCard />}

      <RecentEstimates 
        estimates={estimates} 
        isLoading={estimatesLoading} 
      />
    </div>
  );
};

export default DashboardPage;