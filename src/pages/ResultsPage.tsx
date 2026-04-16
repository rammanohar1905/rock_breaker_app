import { useMiningData } from "@/context/MiningDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Download, Trophy, TrendingUp, Gauge, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const ResultsPage = () => {
  const { machines, performance, geological } = useMiningData();

  const results = machines.map((m) => {
    const entries = performance.filter((p) => p.breakerId === m.id);
    const n = entries.length || 1;

    const avgShift = entries.reduce((s, e) => s + e.totalShiftTime, 0) / n;
    const avgIdle = entries.reduce((s, e) => s + e.idleTime, 0) / n;
    const avgBD = entries.reduce((s, e) => s + e.breakdownTime, 0) / n;
    const avgBreaking = entries.reduce((s, e) => s + e.breakingTime, 0) / n;
    const avgProdHr = entries.reduce((s, e) => s + e.productionPerHour, 0) / n;
    const avgProdShift = entries.reduce((s, e) => s + e.productionPerShift, 0) / n;
    const avgProdDay = entries.reduce((s, e) => s + e.productionPerDay, 0) / n;
    const avgFuel = entries.reduce((s, e) => s + e.fuelConsumption, 0) / n;

    const utilization = avgShift > 0 ? (avgBreaking / avgShift) * 100 : 0;
    const availability = avgShift > 0 ? ((avgShift - avgBD) / avgShift) * 100 : 0;
    const nbr = avgProdHr * m.efficiencyFactor;
    const estBreakingTime = avgProdDay > 0 ? 1000 / avgProdDay : 0;
    const fuelPerTon = avgProdDay > 0 ? (avgFuel * 2.65) / avgProdDay : 0;
    const costPerTon = fuelPerTon * 1.5 + 2.5; // fuel + maintenance estimate

    // Score: weighted combination
    const score = utilization * 0.25 + availability * 0.2 + (nbr / 0.6) * 0.25 + m.efficiencyFactor * 100 * 0.15 + (100 - fuelPerTon * 10) * 0.15;

    return {
      machine: m, utilization, availability, nbr, avgProdHr, avgProdShift, avgProdDay,
      avgFuel, estBreakingTime, fuelPerTon, costPerTon, score,
    };
  });

  const sorted = [...results].sort((a, b) => b.score - a.score);
  const recommended = sorted[0];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-red-500/20 to-rose-500/20 flex items-center justify-center">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Results & Calculations</h1>
          <p className="text-xs text-muted-foreground">Computed outputs for {geological.rockType} (UCS: {geological.ucs} MPa)</p>
        </div>
      </div>

      {/* Recommended */}
      {recommended && (
        <Card className="border-primary/30 glow-amber">
          <CardContent className="py-5">
            <div className="flex items-center gap-3 mb-3">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-semibold text-sm">Recommended Rock Breaker</span>
              <Badge className="gradient-gold text-primary-foreground text-[10px]">BEST FIT</Badge>
            </div>
            <p className="text-lg font-bold gradient-gold-text">{recommended.machine.name}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3 text-xs">
              <div className="flex items-center gap-2"><TrendingUp className="w-3 h-3 text-primary" /><span className="text-muted-foreground">Utilization:</span><span className="font-mono font-medium">{recommended.utilization.toFixed(1)}%</span></div>
              <div className="flex items-center gap-2"><Gauge className="w-3 h-3 text-primary" /><span className="text-muted-foreground">NBR:</span><span className="font-mono font-medium">{recommended.nbr.toFixed(1)} m³/hr</span></div>
              <div className="flex items-center gap-2"><DollarSign className="w-3 h-3 text-primary" /><span className="text-muted-foreground">Cost/ton:</span><span className="font-mono font-medium">${recommended.costPerTon.toFixed(2)}</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground">Score:</span><span className="font-mono font-medium text-primary">{recommended.score.toFixed(1)}</span></div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Detailed Results Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">Detailed Calculation Results</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-[10px]">Breaker</TableHead>
                  <TableHead className="text-[10px]">NBR (m³/hr)</TableHead>
                  <TableHead className="text-[10px]">Prod/Hr</TableHead>
                  <TableHead className="text-[10px]">Prod/Shift</TableHead>
                  <TableHead className="text-[10px]">Prod/Day</TableHead>
                  <TableHead className="text-[10px]">Utilization %</TableHead>
                  <TableHead className="text-[10px]">Availability %</TableHead>
                  <TableHead className="text-[10px]">Fuel (L/shift)</TableHead>
                  <TableHead className="text-[10px]">Cost/Ton ($)</TableHead>
                  <TableHead className="text-[10px]">Score</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((r, i) => (
                  <TableRow key={r.machine.id} className={`border-border ${i === 0 ? "bg-primary/5" : ""}`}>
                    <TableCell className="font-medium text-xs">{r.machine.name} {i === 0 && <Badge variant="outline" className="ml-1 text-[9px] text-primary border-primary/30">TOP</Badge>}</TableCell>
                    <TableCell className="font-mono text-xs">{r.nbr.toFixed(1)}</TableCell>
                    <TableCell className="font-mono text-xs">{r.avgProdHr.toFixed(1)}</TableCell>
                    <TableCell className="font-mono text-xs">{r.avgProdShift.toFixed(0)}</TableCell>
                    <TableCell className="font-mono text-xs">{r.avgProdDay.toFixed(0)}</TableCell>
                    <TableCell className="font-mono text-xs">{r.utilization.toFixed(1)}</TableCell>
                    <TableCell className="font-mono text-xs">{r.availability.toFixed(1)}</TableCell>
                    <TableCell className="font-mono text-xs">{r.avgFuel.toFixed(1)}</TableCell>
                    <TableCell className="font-mono text-xs">{r.costPerTon.toFixed(2)}</TableCell>
                    <TableCell className="font-mono text-xs font-bold">{r.score.toFixed(1)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3">
        <Button variant="outline" size="sm" onClick={() => window.print()}>
          <Download className="w-4 h-4 mr-1" /> Export Report
        </Button>
      </div>
    </div>
  );
};

export default ResultsPage;
