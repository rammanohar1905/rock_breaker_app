import { useMiningData } from "@/context/MiningDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Zap, CheckCircle2, AlertCircle, TrendingUp } from "lucide-react";

const RecommendationsPage = () => {
  const { machines, performance, geological } = useMiningData();

  const analysis = machines.map((m) => {
    const entries = performance.filter((p) => p.breakerId === m.id);
    const n = entries.length || 1;
    const avgBreaking = entries.reduce((s, e) => s + e.breakingTime, 0) / n;
    const avgShift = entries.reduce((s, e) => s + e.totalShiftTime, 0) / n;
    const avgBD = entries.reduce((s, e) => s + e.breakdownTime, 0) / n;
    const avgIdle = entries.reduce((s, e) => s + e.idleTime, 0) / n;
    const avgProd = entries.reduce((s, e) => s + e.productionPerHour, 0) / n;
    const util = avgShift > 0 ? (avgBreaking / avgShift) * 100 : 0;
    const avail = avgShift > 0 ? ((avgShift - avgBD) / avgShift) * 100 : 0;

    // Suitability based on UCS and impact energy
    const ucsSuitability = m.impactEnergy >= geological.ucs * 100 ? "Excellent" : m.impactEnergy >= geological.ucs * 70 ? "Good" : "Marginal";
    const hardnessSuitability = geological.mohsHardness <= 4 ? "Suitable" : geological.mohsHardness <= 6 ? "Adequate" : "Challenging";

    const strengths: string[] = [];
    const improvements: string[] = [];

    if (util > 75) strengths.push("High utilization rate");
    else improvements.push(`Increase utilization from ${util.toFixed(0)}% (target: >75%)`);

    if (avail > 90) strengths.push("Excellent availability");
    else improvements.push(`Reduce breakdown time to improve availability (${avail.toFixed(0)}%)`);

    if (avgIdle < 1.5) strengths.push("Low idle time");
    else improvements.push(`Reduce idle time from ${avgIdle.toFixed(1)}h (target: <1.5h)`);

    if (ucsSuitability === "Excellent") strengths.push(`Impact energy well-matched to ${geological.ucs} MPa UCS`);
    else if (ucsSuitability === "Marginal") improvements.push("Impact energy may be insufficient for rock UCS - consider higher-powered breaker");

    if (m.efficiencyFactor > 0.85) strengths.push("High mechanical efficiency");
    else improvements.push(`Improve efficiency factor from ${(m.efficiencyFactor * 100).toFixed(0)}%`);

    const overallScore = util * 0.3 + avail * 0.25 + avgProd * 0.25 + m.efficiencyFactor * 100 * 0.2;

    return { machine: m, util, avail, avgProd, ucsSuitability, hardnessSuitability, strengths, improvements, overallScore };
  });

  const sorted = [...analysis].sort((a, b) => b.overallScore - a.overallScore);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-yellow-500/20 to-amber-500/20 flex items-center justify-center">
          <Zap className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Smart Recommendations</h1>
          <p className="text-xs text-muted-foreground">AI-driven analysis for {geological.rockType} primary breaking</p>
        </div>
      </div>

      {/* Rock Context */}
      <Card className="border-border bg-card">
        <CardContent className="py-4">
          <p className="text-xs text-muted-foreground mb-2">Analysis Context</p>
          <div className="flex flex-wrap gap-3 text-xs">
            <Badge variant="outline" className="font-mono">{geological.rockType}</Badge>
            <Badge variant="outline" className="font-mono">UCS: {geological.ucs} MPa</Badge>
            <Badge variant="outline" className="font-mono">Hardness: {geological.mohsHardness}</Badge>
            <Badge variant="outline" className="font-mono">RQD: {geological.rqd}%</Badge>
            <Badge variant="outline" className="font-mono">{geological.weatheringDegree}</Badge>
          </div>
        </CardContent>
      </Card>

      {sorted.map((item, rank) => (
        <Card key={item.machine.id} className={`border-border bg-card ${rank === 0 ? "border-primary/30 glow-amber" : ""}`}>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${rank === 0 ? "gradient-gold text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  #{rank + 1}
                </div>
                <div>
                  <CardTitle className="text-sm">{item.machine.name}</CardTitle>
                  <p className="text-[10px] text-muted-foreground mt-0.5">Score: {item.overallScore.toFixed(1)}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant={item.ucsSuitability === "Excellent" ? "default" : "outline"} className={`text-[10px] ${item.ucsSuitability === "Excellent" ? "gradient-gold text-primary-foreground" : ""}`}>
                  UCS: {item.ucsSuitability}
                </Badge>
                <Badge variant="outline" className="text-[10px]">Hardness: {item.hardnessSuitability}</Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-4 gap-3 text-xs">
              <div className="bg-secondary/50 rounded-md p-2">
                <p className="text-muted-foreground mb-0.5">Utilization</p>
                <p className="font-mono font-bold">{item.util.toFixed(1)}%</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-2">
                <p className="text-muted-foreground mb-0.5">Availability</p>
                <p className="font-mono font-bold">{item.avail.toFixed(1)}%</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-2">
                <p className="text-muted-foreground mb-0.5">Avg Production</p>
                <p className="font-mono font-bold">{item.avgProd.toFixed(1)} m³/hr</p>
              </div>
              <div className="bg-secondary/50 rounded-md p-2">
                <p className="text-muted-foreground mb-0.5">Impact Energy</p>
                <p className="font-mono font-bold">{item.machine.impactEnergy.toLocaleString()} J</p>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              {item.strengths.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1"><CheckCircle2 className="w-3 h-3 text-green-500" /> Strengths</p>
                  {item.strengths.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground ml-4 mb-1">• {s}</p>
                  ))}
                </div>
              )}
              {item.improvements.length > 0 && (
                <div>
                  <p className="text-xs font-medium mb-2 flex items-center gap-1"><TrendingUp className="w-3 h-3 text-primary" /> Improvements</p>
                  {item.improvements.map((s, i) => (
                    <p key={i} className="text-xs text-muted-foreground ml-4 mb-1">• {s}</p>
                  ))}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default RecommendationsPage;
