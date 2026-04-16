import { useState } from "react";
import { useMiningData, PerformanceEntry } from "@/context/MiningDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, Gauge } from "lucide-react";

const PerformancePage = () => {
  const { machines, performance, setPerformance } = useMiningData();
  const [filterBreaker, setFilterBreaker] = useState("all");

  const filtered = filterBreaker === "all" ? performance : performance.filter((p) => p.breakerId === filterBreaker);

  const addEntry = () => {
    const entry: PerformanceEntry = {
      id: `p-${Date.now()}`, breakerId: machines[0]?.id || "", week: `Week ${performance.length + 1}`,
      totalShiftTime: 8, idleTime: 0, breakdownTime: 0, breakingTime: 0,
      productionPerHour: 0, productionPerShift: 0, productionPerDay: 0, fuelConsumption: 0, customFields: [],
    };
    setPerformance((prev) => [...prev, entry]);
  };

  const updateEntry = (id: string, field: string, value: number | string) => {
    setPerformance((prev) => prev.map((p) => (p.id === id ? { ...p, [field]: value } : p)));
  };

  const removeEntry = (id: string) => {
    setPerformance((prev) => prev.filter((p) => p.id !== id));
  };

  const getMachineName = (id: string) => machines.find((m) => m.id === id)?.name || "Unknown";

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500/20 to-indigo-500/20 flex items-center justify-center">
            <Gauge className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Performance Data</h1>
            <p className="text-xs text-muted-foreground">{performance.length} entries recorded</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Select value={filterBreaker} onValueChange={setFilterBreaker}>
            <SelectTrigger className="w-48 text-xs"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Breakers</SelectItem>
              {machines.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm" onClick={addEntry}><Plus className="w-4 h-4 mr-1" /> Add Entry</Button>
        </div>
      </div>

      <Card className="border-border bg-card overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-[10px]">Breaker</TableHead>
                  <TableHead className="text-[10px]">Week</TableHead>
                  <TableHead className="text-[10px]">Shift (h)</TableHead>
                  <TableHead className="text-[10px]">Idle (h)</TableHead>
                  <TableHead className="text-[10px]">B/Down (h)</TableHead>
                  <TableHead className="text-[10px]">Breaking (h)</TableHead>
                  <TableHead className="text-[10px]">Prod/Hr (m³)</TableHead>
                  <TableHead className="text-[10px]">Prod/Shift</TableHead>
                  <TableHead className="text-[10px]">Prod/Day</TableHead>
                  <TableHead className="text-[10px]">Fuel (L)</TableHead>
                  <TableHead className="text-[10px] w-10"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.map((entry) => (
                  <TableRow key={entry.id} className="border-border">
                    <TableCell>
                      <Select value={entry.breakerId} onValueChange={(v) => updateEntry(entry.id, "breakerId", v)}>
                        <SelectTrigger className="text-xs h-8 w-36"><SelectValue /></SelectTrigger>
                        <SelectContent>{machines.map((m) => <SelectItem key={m.id} value={m.id}>{m.name}</SelectItem>)}</SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell><Input value={entry.week} onChange={(e) => updateEntry(entry.id, "week", e.target.value)} className="h-8 text-xs w-20 font-mono" /></TableCell>
                    {(["totalShiftTime", "idleTime", "breakdownTime", "breakingTime", "productionPerHour", "productionPerShift", "productionPerDay", "fuelConsumption"] as const).map((f) => (
                      <TableCell key={f}>
                        <Input type="number" value={entry[f]} onChange={(e) => updateEntry(entry.id, f, parseFloat(e.target.value) || 0)} className="h-8 text-xs w-20 font-mono" />
                      </TableCell>
                    ))}
                    <TableCell>
                      <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => removeEntry(entry.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PerformancePage;
