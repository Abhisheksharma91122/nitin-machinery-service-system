export default function DashboardCard({ title, value, icon: Icon, description }) {
  return (
    <div className="rounded-xl border border-zinc-200 bg-white text-zinc-950 shadow-sm p-6 flex flex-col gap-1 transition-all hover:shadow-md">
      <div className="flex flex-row items-center justify-between pb-2">
        <h3 className="tracking-tight text-sm font-medium text-zinc-500">{title}</h3>
        {Icon && <Icon className="h-4 w-4 text-zinc-500" />}
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {description && (
        <p className="text-xs text-zinc-500">{description}</p>
      )}
    </div>
  );
}
