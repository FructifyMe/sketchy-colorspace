import { useQuery } from '@tanstack/react-query';
import { supabase } from "@/integrations/supabase/client";

interface EstimateHeaderProps {
  estimateId: string;
}

const EstimateHeader = ({ estimateId }: EstimateHeaderProps) => {
  const { data: businessSettings } = useQuery({
    queryKey: ['businessSettings'],
    queryFn: async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error("No user found");

      const { data, error } = await supabase
        .from('business_settings')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (error) throw error;
      return data;
    }
  });

  return (
    <div className="border-b pb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          {businessSettings?.company_logo && (
            <img 
              src={businessSettings.company_logo} 
              alt="Company logo" 
              className="h-16 w-16 object-contain"
            />
          )}
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {businessSettings?.company_name || 'Company Name'}
            </h1>
            {businessSettings?.company_header && (
              <p className="text-gray-600 mt-1">{businessSettings.company_header}</p>
            )}
            <div className="text-sm text-gray-500 mt-2">
              <p>{businessSettings?.address}</p>
              <p>
                {businessSettings?.city}{businessSettings?.city && ','} {businessSettings?.state} {businessSettings?.zip_code}
              </p>
              <p>{businessSettings?.phone}</p>
              <p>{businessSettings?.email}</p>
            </div>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-semibold text-gray-900">Estimate #{estimateId.slice(0, 8)}</p>
          <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
        </div>
      </div>
    </div>
  );
};

export default EstimateHeader;