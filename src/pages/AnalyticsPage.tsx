import { useMiningData } from "@/context/MiningDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useState } from "react";
import { PieChart as PieIcon } from "lucide-react";
import {
  ScatterChart, Scatter, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  Legend,
} from "recharts";

const COLORS = ["#f59e0b", "#14b8a6", "#6366f1", "#ef4444", "#8b5cf6", "#ec4899", "#10b981", "#f97316", "#06b6d4", "#84cc16"];

const AnalyticsPage = () => {
  const { machines, performance, geological } = useMiningData();
  const [selectedMachines, setSelectedMachines] = useState<string[]>(machines.slice(0, 5).map((m) => m.id));

  const toggleMachine = (id: string) => {
    setSelectedMachines((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const filteredMachines = machines.filter((m) => selectedMachines.includes(m.id));

  const nbrData = filteredMachines.map((m) => {
    const entries = performance.filter((p) => p.breakerId === m.id);
    const avgProd = entries.reduce((s, e) => s + e.productionPerHour, 0) / (entries.length || 1);
    return { name: m.name, ucs: geological.ucs, nbr: avgProd, impactEnergy: m.impactEnergy };
  });

  const radarData = [
    { metric: "Utilization" },
    { metric: "Availability" },
    { metric: "Productivity" },
    { metric: "Efficiency" },
    { metric: "Fuel Economy" },
  ].map((item) => {
    const row: Record<string, string | number> = { metric: item.metric };
    filteredMachines.forEach((m) => {
      const entries = performance.filter((p) => p.breakerId === m.id);
      const avgShift = entries.reduce((s, e) => s + e.totalShiftTime, 0) / (entries.length || 1);
      const avgBreaking = entries.reduce((s, e) => s + e.breakingTime, 0) / (entries.length || 1);
      const avgBD = entries.reduce((s, e) => s + e.breakdownTime, 0) / (entries.length || 1);
      const avgProd = entries.reduce((s, e) => s + e.productionPerHour, 0) / (entries.length || 1);
      const avgFuel = entries.reduce((s, e) => s + e.fuelConsumption, 0) / (entries.length || 1);

      const values: Record<string, number> = {
        Utilization: avgShift > 0 ? (avgBreaking / avgShift) * 100 : 0,
        Availability: avgShift > 0 ? ((avgShift - avgBD) / avgShift) * 100 : 0,
        Productivity: Math.min(avgProd / 0.6, 100),
        Efficiency: m.efficiencyFactor * 100,
        "Fuel Economy": Math.max(0, 100 - avgFuel),
      };
      row[m.name] = +(values[item.metric] || 0).toFixed(1);
    });
    return row;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500/20 to-pink-500/20 flex items-center justify-center">
            <PieIcon className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Analytics</h1>
            <p className="text-xs text-muted-foreground">Advanced performance comparisons ({machines.length} machines)</p>
          </div>
        </div>
      </div>

      {/* Machine filter chips - scrollable for 20 machines */}
      <div className="flex gap-2 flex-wrap max-h-24 overflow-y-auto p-1">
        {machines.map((m) => (
          <button
            key={m.id}
            onClick={() => toggleMachine(m.id)}
            className={`text-[10px] px-2 py-1 rounded-full border transition-colors whitespace-nowrap ${
              selectedMachines.includes(m.id)
                ? "border-primary/50 bg-primary/10 text-primary"
                : "border-border text-muted-foreground hover:border-primary/30"
            }`}
          >
            {m.name.split(" ").slice(-1)[0]}
          </button>
        ))}
      </div>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Performance Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(220,15%,20%)" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: "hsl(220,10%,50%)", fontSize: 10 }} />
                <PolarRadiusAxis tick={{ fill: "hsl(220,10%,50%)", fontSize: 9 }} />
                {filteredMachines.map((m, i) => (
                  <Radar key={m.id} name={m.name} dataKey={m.name} stroke={COLORS[i % COLORS.length]} fill={COLORS[i % COLORS.length]} fillOpacity={0.15} />
                ))}
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, fontSize: 11 }} />
              </RadarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Net Breaking Rate vs UCS</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
                <XAxis dataKey="ucs" name="UCS (MPa)" tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <YAxis dataKey="nbr" name="NBR (m³/hr)" tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, fontSize: 12 }} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter data={nbrData} fill="#f59e0b">
                  {nbrData.map((_, i) => <circle key={i} r={6} fill={COLORS[i % COLORS.length]} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Impact Energy vs Efficiency</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <ScatterChart>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,15%,20%)" />
                <XAxis dataKey="impactEnergy" name="Impact Energy (J)" tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <YAxis dataKey="efficiency" name="Efficiency" tick={{ fill: "hsl(220,10%,50%)", fontSize: 11 }} />
                <Tooltip contentStyle={{ background: "hsl(220,18%,13%)", border: "1px solid hsl(220,15%,20%)", borderRadius: 8, fontSize: 12 }} cursor={{ strokeDasharray: "3 3" }} />
                <Scatter
                  data={filteredMachines.map((m) => ({
                    name: m.name,
                    impactEnergy: m.impactEnergy,
                    efficiency: m.efficiencyFactor * 100,
                  }))}
                  fill="#6366f1"
                >
                  {filteredMachines.map((_, i) => <circle key={i} r={6} fill={COLORS[i % COLORS.length]} />)}
                </Scatter>
              </ScatterChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AnalyticsPage;
