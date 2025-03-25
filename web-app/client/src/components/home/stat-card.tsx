import { Card } from "@/components/ui/card";

interface StatCardProps {
  title: string;
  value: string | number;
  icon: string;
  color: string;
  borderColor: string;
}

const StatCard = ({ title, value, icon, color, borderColor }: StatCardProps) => {
  return (
    <Card className={`bg-surface rounded-lg shadow p-4 border-l-4 border-${borderColor}`}>
      <div className="flex items-center">
        <div className={`p-3 rounded-full bg-${color}-500 bg-opacity-10 text-${color}`}>
          <i className={`fas fa-${icon}`}></i>
        </div>
        <div className="ml-4">
          <p className="text-sm font-medium text-text-secondary">{title}</p>
          <p className="text-lg font-semibold text-text-primary">{value}</p>
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
