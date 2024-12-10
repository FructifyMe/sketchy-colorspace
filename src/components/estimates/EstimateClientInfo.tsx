interface ClientInfo {
  name?: string;
  email?: string;
  phone?: string;
  address?: string;
}

interface EstimateClientInfoProps {
  clientInfo: ClientInfo | null;
}

const EstimateClientInfo = ({ clientInfo }: EstimateClientInfoProps) => {
  return (
    <div className="print:mb-8">
      <h2 className="text-2xl font-semibold mb-4 print:text-xl">Client Information</h2>
      <div className="grid grid-cols-2 gap-4 print:text-sm">
        <div>
          <p className="font-medium text-gray-500">Name</p>
          <p>{clientInfo?.name || 'N/A'}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500">Email</p>
          <p>{clientInfo?.email || 'N/A'}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500">Phone</p>
          <p>{clientInfo?.phone || 'N/A'}</p>
        </div>
        <div>
          <p className="font-medium text-gray-500">Address</p>
          <p>{clientInfo?.address || 'N/A'}</p>
        </div>
      </div>
    </div>
  );
};

export default EstimateClientInfo;