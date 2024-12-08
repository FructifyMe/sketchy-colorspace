import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    <Card>
      <CardHeader>
        <CardTitle>Client Information</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-4">
          <div>
            <dt className="font-medium text-gray-500">Name</dt>
            <dd>{clientInfo?.name || 'N/A'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Email</dt>
            <dd>{clientInfo?.email || 'N/A'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Phone</dt>
            <dd>{clientInfo?.phone || 'N/A'}</dd>
          </div>
          <div>
            <dt className="font-medium text-gray-500">Address</dt>
            <dd>{clientInfo?.address || 'N/A'}</dd>
          </div>
        </dl>
      </CardContent>
    </Card>
  );
};

export default EstimateClientInfo;