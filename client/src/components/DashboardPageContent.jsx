import { useMemo } from 'react';
import { AreaChart, Area, BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import Card from './Card';
import Button from './Button';
import ChartContainer from './ChartContainer';
import Table from './Table';
import Badge from './Badge';
import { dashboardKpis, recentTrips, fuelLogs, recentExpenses } from '../services/mockData';

const statusVariant = {
  Scheduled: 'info',
  'On Trip': 'warning',
  Completed: 'success',
  Cancelled: 'danger',
};

const statusLabel = (status) => <Badge variant={statusVariant[status] || 'neutral'}>{status}</Badge>;

const columns = [
  { key: 'id', label: 'Trip ID' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'driver', label: 'Driver' },
  { key: 'destination', label: 'Destination' },
  { key: 'status', label: 'Status', render: (row) => statusLabel(row.status) },
  { key: 'revenue', label: 'Revenue', render: (row) => `₹${row.revenue.toLocaleString()}` },
];

export default function DashboardPageContent() {
  const chartData = useMemo(() => dashboardKpis.tripsPerMonth, []);
  const fuelData = useMemo(() => dashboardKpis.fuelConsumption, []);
  const expenseData = useMemo(() => dashboardKpis.expenseDistribution, []);
  const revenueData = useMemo(() => dashboardKpis.revenueExpense, []);

  return (
    <div className="space-y-8">
      <div className="grid gap-4 xl:grid-cols-4">
        <Card title="Total Trips" value={dashboardKpis.totalTrips.toLocaleString()} />
        <Card title="Active Trips" value={dashboardKpis.activeTrips.toLocaleString()} />
        <Card title="Fuel Cost" value={`₹${dashboardKpis.fuelCost.toLocaleString()}`} />
        <Card title="Maintenance Cost" value={`₹${dashboardKpis.maintenanceCost.toLocaleString()}`} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <Card title="Total Expenses" value={`₹${dashboardKpis.totalExpenses.toLocaleString()}`} />
        <Card title="Revenue" value={`₹${dashboardKpis.revenue.toLocaleString()}`} />
        <Card title="Vehicle ROI" value={dashboardKpis.vehicleRoi} />
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <ChartContainer title="Trips per Month">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorTrips" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0ea5e9" stopOpacity={0.35} />
                    <stop offset="100%" stopColor="#0ea5e9" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Area type="monotone" dataKey="trips" stroke="#0ea5e9" fill="url(#colorTrips)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Fuel Consumption">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={fuelData} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Bar dataKey="liters" fill="#0ea5e9" radius={[12, 12, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Expense Distribution">
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={expenseData} dataKey="amount" nameKey="category" innerRadius={50} outerRadius={90} paddingAngle={4}>
                  {expenseData.map((entry, index) => (
                    <Cell key={entry.category} fill={['#0ea5e9', '#38bdf8', '#7dd3fc', '#bae6fd'][index % 4]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>
      </div>

      <div className="grid gap-4 xl:grid-cols-2">
        <ChartContainer title="Revenue vs Expense">
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueData} margin={{ top: 12, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} />
                <Tooltip />
                <Line type="monotone" dataKey="revenue" stroke="#0ea5e9" strokeWidth={3} />
                <Line type="monotone" dataKey="expense" stroke="#0f766e" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartContainer>

        <ChartContainer title="Quick Actions">
          <div className="space-y-4">
            <Button className="w-full">Create Trip</Button>
            <Button className="w-full bg-slate-900 hover:bg-slate-800">Add Fuel Log</Button>
            <Button className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">Add Expense</Button>
            <Button className="w-full bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700">View Reports</Button>
          </div>
        </ChartContainer>
      </div>

      <div className="grid gap-4 xl:grid-cols-3">
        <div className="xl:col-span-2">
          <Card title="Recent Trips">
            <Table columns={columns} data={recentTrips} />
          </Card>
        </div>
        <div className="space-y-4">
          <Card title="Latest Fuel Logs">
            <div className="space-y-3">
              {fuelLogs.map((log) => (
                <div key={log.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{log.vehicle}</span>
                    <span>{log.date}</span>
                  </div>
                  <div className="mt-2 text-slate-900 dark:text-white">{log.station} · {log.liters}L · ₹{log.cost.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>
          <Card title="Latest Expenses">
            <div className="space-y-3">
              {recentExpenses.map((expense) => (
                <div key={expense.id} className="rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-900">
                  <div className="flex items-center justify-between text-sm text-slate-600 dark:text-slate-300">
                    <span>{expense.type}</span>
                    <span>{expense.date}</span>
                  </div>
                  <div className="mt-2 text-slate-900 dark:text-white">{expense.vehicle} · ₹{expense.amount.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
