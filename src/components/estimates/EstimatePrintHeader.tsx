import { BusinessSettings } from "@/types/estimateDetail";

interface EstimatePrintHeaderProps {
  businessSettings: BusinessSettings;
}

const EstimatePrintHeader = ({ businessSettings }: EstimatePrintHeaderProps) => {
  return (
    <div className="hidden print:block mb-8">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">{businessSettings.company_name || 'Company Name'}</h1>
        <p className="text-sm text-gray-600">
          {businessSettings.address}, {businessSettings.city}, {businessSettings.state} {businessSettings.zip_code}
        </p>
        <p className="text-sm text-gray-600">
          {businessSettings.phone} | {businessSettings.email}
        </p>
      </div>
    </div>
  );
};

export default EstimatePrintHeader;