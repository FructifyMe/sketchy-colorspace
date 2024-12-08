import { formatDistanceToNow } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";

interface EstimateStatusProps {
  status: string;
  createdAt: string;
}

const EstimateStatus = ({ status, createdAt }: EstimateStatusProps) => {
  return (
    <Card className="print:shadow-none print:border-none">
      <CardContent className="pt-6">
        <div className="flex justify-between items-center">
          <div>
            <span className="text-sm text-gray-500">Status: </span>
            <span className="capitalize">{status}</span>
          </div>
          <div className="text-sm text-gray-500 print:hidden">
            Created {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstimateStatus;