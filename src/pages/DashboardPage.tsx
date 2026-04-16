import { useMiningData } from "@/context/MiningDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart3, TrendingUp, Clock, AlertTriangle } from "lucide-react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, Legend,
} from "recharts";

const COLORS = ["#f59e0b", "#14b8a6", "#6366f1", "#ef4444", "#22c55e"];

const DashboardPage = () => {
  const { machines, performance, geological } = useMiningData();

  // Utilization per machine
  const utilizationData = machines.map((m) => {
    const entries = performance.filter((p) => p.breakerId === m.id);
    const avgBreaking = entries.reduce((s, e) => s + e.breakingTime, 0) / (entries.length || 1);
    const avgShift = entries.reduce((s, e) => s + e.totalShiftTime, 0) / (entries.length || 1);
    const utilization = avgShift > 0 ? (avgBreaking / avgShift) * 100 : 0;
    return { name: m.name.split(" ").slice(-1)[0], utilization: +utilization.toFixed(1), fullName: m.name };
  });

  // Production by week
  const weeks = [...new Set(performance.map((p) => p.week))];
  const productionData = weeks.map((week) => {
    const row: Record<string, string | number> = { week };
    machines.forEach((m) => {
      const entry = performance.find((p) => p.breakerId === m.id && p.week === week);
      row[m.name] = entry?.productionPerShift || 0;
    });
    return row;
  });

  // Downtime analysis
  const downtimeData = machines.map((m) => {
    const entries = performance.filter((p) => p.breakerId === m.id);
    const totalIdle = entries.reduce((s, e) => s + e.idleTime, 0);
    const totalBreakdown = entries.reduce((s, e) => s + e.breakdownTime, 0);
    const totalBreaking = entries.reduce((s, e) => s + e.breakingTime, 0);
    return { name: m.name.split(" ").slice(-1)[0], idle: +totalIdle.toFixed(1), breakdown: +totalBreakdown.toFixed(1), breaking: +totalBreaking.toFixed(1) };
  });

  // Availability
  const availabilityData = machines.map((m) => {
    const entries = performance.filter((p) => p.breakerId === m.id);
    const totalShift = entries.reduce((s, e) => s + e.totalShiftTime, 0);
    const totalBreakdown = entries.reduce((s, e) => s + e.breakdownTime, 0);
    const availability = totalShift > 0 ? ((totalShift - totalBreakdown) / totalShift) * 100 : 0;
    return { name: m.name.split(" ").slice(-1)[0], value: +availability.toFixed(1) };
  });

  // Alerts
  const alerts = machines.flatMap((m) => {
    const entries = performance.filter((p) => p.breakerId === m.id);
    const msgs: string[] = [];
    const avgUtil = entries.reduce((s, e) => s + (e.breakingTime / e.totalShiftTime) * 100, 0) / (entries.length || 1);
    if (avgUtil < 60) msgs.push(`${m.name}: Low utilization (${avgUtil.toFixed(0)}%)`);
    const totalBD = entries.reduce((s, e) => s + e.breakdownTime, 0);
    if (totalBD > 2) msgs.push(`${m.name}: High breakdown time (${totalBD.toFixed(1)}h)`);
    return msgs;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-green-500/20 to-emerald-500/20 flex items-center justify-center">
          <BarChart3 className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Dashboard</h1>
          <p className="text-xs text-muted-foreground">Real-time equipment monitoring & performance overview</p>
        </div>
      </div>

      {/* Alerts */}
      {alerts.length > 0 && (
        <Card className="border-destructive/30 bg-destructive/5">
          <CardContent className="py-3">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="w-4 h-4 text-destructive" />
              <span className="text-xs font-semibold text-destructive">Maintenance Alerts</span>
            </div>
            {alerts.map((a, i) => (
              <p key={i} className="text-xs text-muted-foreground ml-6">• {a}</p>
            ))}
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-2 gap-6">
        {/* Utilization */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-primary" /> Equipment Utilization (%)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={utilizationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="utilization" fill="#f59e0b" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Production Monitoring */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-primary" /> Production per Shift (m³)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={productionData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
                <XAxis dataKey="week" tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                {machines.map((m, i) => (
                  <Line key={m.id} type="monotone" dataKey={m.name} stroke={COLORS[i % COLORS.length]} strokeWidth={2} dot={{ r: 4 }} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Downtime Analysis */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-primary" /> Downtime Analysis (hours)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={downtimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
                <XAxis dataKey="name" tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <YAxis tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, fontSize: 12 }} />
                <Legend wrapperStyle={{ fontSize: 11 }} />
                <Bar dataKey="idle" fill="#f59e0b" stackId="a" radius={[0, 0, 0, 0]} />
                <Bar dataKey="breakdown" fill="#ef4444" stackId="a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Availability Pie */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Equipment Availability (%)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={availabilityData} cx="50%" cy="50%" outerRadius={90} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                  {availabilityData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                </Pie>
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default DashboardPage;
