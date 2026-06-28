import { FiList, FiClock, FiActivity, FiCheckCircle } from "react-icons/fi";

const statConfig = [
  {
    key: "total",
    title: "Total Tasks",
    icon: FiList,
    iconBg: "bg-zinc-100",
    iconColor: "text-zinc-700",
    ringColor: "group-hover:ring-zinc-300",
  },
  {
    key: "pending",
    title: "Pending",
    icon: FiClock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    ringColor: "group-hover:ring-amber-200",
  },
  {
    key: "inProgress",
    title: "In Progress",
    icon: FiActivity,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    ringColor: "group-hover:ring-blue-200",
  },
  {
    key: "completed",
    title: "Completed",
    icon: FiCheckCircle,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    ringColor: "group-hover:ring-emerald-200",
  },
];

const DashboardCards = ({ stats }) => {
  return (
    <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {statConfig.map(({ key, title, icon: Icon, iconBg, iconColor, ringColor }) => (
        <article
          key={key}
          className={`group rounded-xl border border-zinc-200 bg-white p-5 shadow-sm ring-1 ring-transparent transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md ${ringColor}`}
        >
          <div className="flex items-start justify-between">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-lg ${iconBg} transition-transform duration-200 group-hover:scale-110`}
            >
              <Icon className={`h-5 w-5 ${iconColor}`} />
            </div>
          </div>
          <p className="mt-4 text-sm font-medium text-zinc-500">{title}</p>
          <p className="mt-1 text-3xl font-semibold tracking-tight text-zinc-900">
            {stats?.[key] ?? 0}
          </p>
        </article>
      ))}
    </section>
  );
};

export default DashboardCards;
