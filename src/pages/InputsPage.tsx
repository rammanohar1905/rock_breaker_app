import { useState } from "react";
import { useMiningData } from "@/context/MiningDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, Database } from "lucide-react";

const rockTypes = ["Limestone", "Granite", "Basalt", "Sandstone", "Marble", "Dolomite", "Shale", "Others"];
const weatheringOptions = ["Fresh", "Slightly Weathered", "Moderately Weathered", "Highly Weathered", "Completely Weathered"];

const InputsPage = () => {
  const { geological, setGeological } = useMiningData();
  const [customName, setCustomName] = useState("");

  const update = (field: string, value: string | number) => {
    setGeological((prev) => ({ ...prev, [field]: value }));
  };

  const addCustomParam = () => {
    if (!customName.trim()) return;
    setGeological((prev) => ({
      ...prev,
      customParams: [...prev.customParams, { name: customName, value: "" }],
    }));
    setCustomName("");
  };

  const removeCustomParam = (idx: number) => {
    setGeological((prev) => ({
      ...prev,
      customParams: prev.customParams.filter((_, i) => i !== idx),
    }));
  };

  const updateCustomParam = (idx: number, value: string) => {
    setGeological((prev) => ({
      ...prev,
      customParams: prev.customParams.map((p, i) => (i === idx ? { ...p, value } : p)),
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg gradient-gold flex items-center justify-center">
          <Database className="w-5 h-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Geological & Geotechnical Inputs</h1>
          <p className="text-xs text-muted-foreground">Define rock properties for performance analysis</p>
        </div>
      </div>

      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Rock Properties</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-xs">Rock Type</Label>
              <Select value={geological.rockType} onValueChange={(v) => update("rockType", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {rockTypes.map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label className="text-xs">Degree of Weathering</Label>
              <Select value={geological.weatheringDegree} onValueChange={(v) => update("weatheringDegree", v)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {weatheringOptions.map((w) => <SelectItem key={w} value={w}>{w}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: "UCS (MPa)", field: "ucs", value: geological.ucs },
              { label: "Mohs Hardness", field: "mohsHardness", value: geological.mohsHardness },
              { label: "Density (g/cm³)", field: "density", value: geological.density },
              { label: "RQD (%)", field: "rqd", value: geological.rqd },
            ].map((item) => (
              <div key={item.field} className="space-y-2">
                <Label className="text-xs">{item.label}</Label>
                <Input
                  type="number"
                  value={item.value}
                  onChange={(e) => update(item.field, parseFloat(e.target.value) || 0)}
                  className="font-mono text-sm"
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Custom Parameters */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm">Custom Parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {geological.customParams.map((p, i) => (
            <div key={i} className="flex gap-2 items-end">
              <div className="flex-1 space-y-1">
                <Label className="text-xs text-muted-foreground">{p.name}</Label>
                <Input value={p.value} onChange={(e) => updateCustomParam(i, e.target.value)} className="font-mono text-sm" />
              </div>
              <Button variant="ghost" size="icon" onClick={() => removeCustomParam(i)} className="text-destructive shrink-0">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}
          <div className="flex gap-2">
            <Input placeholder="Parameter name..." value={customName} onChange={(e) => setCustomName(e.target.value)} className="text-sm" />
            <Button variant="outline" size="sm" onClick={addCustomParam} className="shrink-0">
              <Plus className="w-4 h-4 mr-1" /> Add
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Live Preview */}
      <Card className="border-primary/20 bg-primary/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm text-primary">Live Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-xs">
            <div><span className="text-muted-foreground">Rock: </span><span className="font-mono font-medium">{geological.rockType}</span></div>
            <div><span className="text-muted-foreground">UCS: </span><span className="font-mono font-medium">{geological.ucs} MPa</span></div>
            <div><span className="text-muted-foreground">Hardness: </span><span className="font-mono font-medium">{geological.mohsHardness}</span></div>
            <div><span className="text-muted-foreground">Density: </span><span className="font-mono font-medium">{geological.density} g/cm³</span></div>
            <div><span className="text-muted-foreground">RQD: </span><span className="font-mono font-medium">{geological.rqd}%</span></div>
            <div><span className="text-muted-foreground">Weathering: </span><span className="font-mono font-medium">{geological.weatheringDegree}</span></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InputsPage;
