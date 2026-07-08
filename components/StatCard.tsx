type StatCardProps = {
  label: string;
  value: string;
  change?: string;
};

export default function StatCard({ label, value, change }: StatCardProps) {
  const isPositive = change?.startsWith("-") === false;

  return (
    <div className="card fade-in p-4 w-64 flex items-stretch gap-3">
      <div className="accent-bar" />
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-semibold text-gray-900">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${isPositive ? "text-green-600" : "text-red-600"}`}>
            {change}
          </p>
        )}
      </div>
    </div>
  );
}