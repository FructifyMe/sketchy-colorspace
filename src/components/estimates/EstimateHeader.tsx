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
    <div className="border-b pb-6 mb-6 print:pb-4 print:mb-4">
      <div className="flex justify-between items-start">
        <div className="text-left">
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
        {businessSettings?.company_logo && (
          <img 
            src={businessSettings.company_logo} 
            alt="Company logo" 
            className="h-16 w-auto object-contain print:hidden"
          />
        )}
      </div>
    </div>
  );
};

export default EstimateHeader;