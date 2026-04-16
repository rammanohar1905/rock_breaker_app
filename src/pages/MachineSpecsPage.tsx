import { useState, useMemo, useCallback } from "react";
import { useMiningData, MachineSpec } from "@/context/MiningDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Cpu, Save, Search, AlertCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { toast } from "sonner";

const specFields: { label: string; field: keyof MachineSpec; unit: string }[] = [
  { label: "Carrier Weight", field: "carrierWeight", unit: "tonnes" },
  { label: "Service Weight", field: "serviceWeight", unit: "kg" },
  { label: "Tool Diameter", field: "toolDiameter", unit: "mm" },
  { label: "Total Length", field: "totalLength", unit: "mm" },
  { label: "Impact Rate", field: "impactRate", unit: "blows/min" },
  { label: "Hydraulic Oil Flow", field: "hydraulicOilFlow", unit: "L/min" },
  { label: "Hydraulic Pressure", field: "hydraulicPressure", unit: "bar" },
  { label: "Hydraulic Input Power", field: "hydraulicInputPower", unit: "kW" },
  { label: "Impact Energy", field: "impactEnergy", unit: "J" },
  { label: "Input Power", field: "inputPower", unit: "kW" },
  { label: "Efficiency Factor", field: "efficiencyFactor", unit: "" },
];

const MachineSpecsPage = () => {
  const { machines, setMachines } = useMiningData();
  
  // Initialize selectedId safely - ensure it's a valid machine ID
  const [selectedId, setSelectedId] = useState<string>(() => {
    return machines.length > 0 ? machines[0].id : "";
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [editDraft, setEditDraft] = useState<Record<string, MachineSpec>>({});

  // Validate selectedId still exists in machines array
  const selectedMachine = useMemo(
    () => machines.find((m) => m.id === selectedId),
    [machines, selectedId]
  );

  // Ensure selectedId is valid after machines change
  useMemo(() => {
    if (selectedId && !machines.find((m) => m.id === selectedId)) {
      setSelectedId(machines.length > 0 ? machines[0].id : "");
    }
  }, [machines, selectedId]);

  // Use draft for editing, fallback to actual machine data
  const getEditValue = useCallback((machine: MachineSpec) => {
    return editDraft[machine.id] || machine;
  }, [editDraft]);

  const updateDraft = useCallback((id: string, field: keyof MachineSpec, value: number | string) => {
    const machine = machines.find((m) => m.id === id);
    if (!machine) {
      console.warn(`Machine with ID ${id} not found`);
      return;
    }
    const current = editDraft[id] || { ...machine };
    setEditDraft((prev) => ({
      ...prev,
      [id]: { ...current, [field]: value },
    }));
  }, [machines, editDraft]);

  const addMachine = useCallback(() => {
    const newId = `rb-${Date.now()}`;
    const newMachine: MachineSpec = {
      id: newId,
      name: "",
      carrierWeight: 0,
      serviceWeight: 0,
      toolDiameter: 0,
      totalLength: 0,
      impactRate: 0,
      hydraulicOilFlow: 0,
      hydraulicPressure: 0,
      hydraulicInputPower: 0,
      impactEnergy: 0,
      inputPower: 0,
      efficiencyFactor: 0.8,
      customParams: [],
    };
    setMachines((prev) => [...prev, newMachine]);
    setSelectedId(newId);
    toast.info("Enter machine name and save");
  }, [setMachines]);

  const saveMachine = useCallback((id: string) => {
    const draft = editDraft[id];
    if (!draft) {
      toast.info("No changes to save");
      return;
    }
    
    // Validate machine name - REQUIRED field
    if (!draft.name || draft.name.trim() === "") {
      toast.error("Machine name is required - please enter a name");
      return;
    }

    try {
      setMachines((prev) => prev.map((m) => (m.id === id ? { ...draft } : m)));
      setEditDraft((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      toast.success(`Machine "${draft.name}" saved successfully`);
    } catch (error) {
      console.error("Error saving machine:", error);
      toast.error("Failed to save machine");
    }
  }, [editDraft, setMachines]);

  const removeMachine = useCallback((id: string) => {
    if (machines.length <= 1) {
      toast.error("Cannot remove - at least one machine must exist");
      return;
    }
    
    const machineToRemove = machines.find(m => m.id === id);
    const machineName = machineToRemove?.name || "Machine";

    try {
      setMachines((prev) => {
        const updated = prev.filter((m) => m.id !== id);
        // Update selectedId if removing the selected machine
        if (selectedId === id && updated.length > 0) {
          setSelectedId(updated[0].id);
        }
        return updated;
      });
      
      setEditDraft((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      
      toast.success(`Machine "${machineName}" removed`);
    } catch (error) {
      console.error("Error removing machine:", error);
      toast.error("Failed to remove machine");
    }
  }, [machines, selectedId, setMachines]);

  const filteredMachines = useMemo(
    () =>
      machines.filter((m) =>
        m.name.toLowerCase().includes(searchTerm.toLowerCase())
      ),
    [machines, searchTerm]
  );

  const hasDraft = useCallback((id: string) => !!editDraft[id], [editDraft]);

  // Handle empty state
  if (!machines || machines.length === 0) {
    return (
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Machine Specifications</h1>
            <p className="text-xs text-muted-foreground">No rock breakers configured yet</p>
          </div>
        </div>
        <Card className="border-border bg-card border-dashed">
          <CardContent className="py-12 flex flex-col items-center justify-center">
            <AlertCircle className="w-8 h-8 text-muted-foreground mb-3" />
            <p className="text-sm font-medium text-muted-foreground mb-4">No machines configured</p>
            <Button onClick={addMachine} className="gap-1" aria-label="Add first rock breaker">
              <Plus className="w-4 h-4" /> Add Machine
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-teal-500/20 to-cyan-500/20 flex items-center justify-center">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold">Machine Specifications</h1>
            <p className="text-xs text-muted-foreground">{machines.length} rock breakers configured</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={addMachine} aria-label="Add new rock breaker" className="gap-1">
          <Plus className="w-4 h-4" /> Add Machine
        </Button>
      </div>

      <div className="grid lg:grid-cols-[280px_1fr] gap-6">
        {/* Machine List Sidebar */}
        <Card className="border-border bg-card">
          <CardHeader className="pb-2">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 w-3 h-3 text-muted-foreground" aria-hidden="true" />
              <Input
                placeholder="Search machines..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-7 h-8 text-xs"
                aria-label="Search machines by name"
              />
            </div>
          </CardHeader>
          <CardContent className="p-2 max-h-[500px] overflow-y-auto">
            <div className="space-y-1">
              {filteredMachines.length === 0 ? (
                <div className="text-center py-4">
                  <p className="text-xs text-muted-foreground">No machines match your search</p>
                </div>
              ) : (
                filteredMachines.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => setSelectedId(m.id)}
                    className={`w-full text-left px-3 py-2 rounded-md text-xs transition-colors flex items-center justify-between ${
                      selectedId === m.id
                        ? "bg-primary/10 text-primary border border-primary/30"
                        : "hover:bg-secondary/80 border border-transparent"
                    }`}
                    aria-label={`Select machine ${m.name}`}
                    aria-pressed={selectedId === m.id}
                  >
                    <span className="truncate">{m.name}</span>
                    {hasDraft(m.id) && (
                      <Badge variant="outline" className="text-[9px] ml-1 text-amber-500 border-amber-500/30">
                        Unsaved
                      </Badge>
                    )}
                  </button>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* Edit Form */}
        {selectedMachine ? (
          <Card className="border-border bg-card">
            <CardHeader className="pb-4 flex flex-row items-center justify-between">
              <div className="flex-1 mr-4">
                <Label htmlFor="machine-name" className="text-xs">Machine Name</Label>
                <Input
                  id="machine-name"
                  value={getEditValue(selectedMachine).name}
                  onChange={(e) => updateDraft(selectedMachine.id, "name", e.target.value)}
                  className="mt-1 font-semibold text-sm"
                  aria-label="Machine name input"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="default"
                  size="sm"
                  onClick={() => saveMachine(selectedMachine.id)}
                  className="gap-1"
                  aria-label="Save machine changes"
                >
                  <Save className="w-3 h-3" /> Save
                </Button>
                {machines.length > 1 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeMachine(selectedMachine.id)}
                    className="text-destructive"
                    aria-label="Delete machine"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {specFields.map((sf) => {
                  const value = getEditValue(selectedMachine)[sf.field];
                  return (
                    <div key={sf.field} className="space-y-1">
                      <Label htmlFor={`field-${sf.field}`} className="text-xs text-muted-foreground">
                        {sf.label} {sf.unit && <span className="text-[10px]">({sf.unit})</span>}
                      </Label>
                      <Input
                        id={`field-${sf.field}`}
                        type="number"
                        step={sf.field === "efficiencyFactor" ? "0.01" : "1"}
                        min="0"
                        value={typeof value === "number" ? value : 0}
                        onChange={(e) =>
                          updateDraft(selectedMachine.id, sf.field, parseFloat(e.target.value) || 0)
                        }
                        className="font-mono text-sm"
                        aria-label={sf.label}
                      />
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="border-border bg-card border-dashed">
            <CardContent className="py-8 flex items-center justify-center">
              <p className="text-sm text-muted-foreground">Select a machine to edit specifications</p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* All Machines Overview Table */}
      <Card className="border-border bg-card overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm">All Machines Overview ({machines.length})</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead className="text-[10px]" scope="col">#</TableHead>
                  <TableHead className="text-[10px]" scope="col">Name</TableHead>
                  <TableHead className="text-[10px]" scope="col">Weight (t)</TableHead>
                  <TableHead className="text-[10px]" scope="col">Impact Energy (J)</TableHead>
                  <TableHead className="text-[10px]" scope="col">Impact Rate</TableHead>
                  <TableHead className="text-[10px]" scope="col">Power (kW)</TableHead>
                  <TableHead className="text-[10px]" scope="col">Efficiency</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {machines.map((m, i) => (
                  <TableRow
                    key={m.id}
                    className={`border-border cursor-pointer hover:bg-secondary/50 ${
                      selectedId === m.id ? "bg-primary/5" : ""
                    }`}
                    onClick={() => setSelectedId(m.id)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setSelectedId(m.id);
                      }
                    }}
                    aria-label={`Select machine ${m.name}`}
                    aria-pressed={selectedId === m.id}
                  >
                    <TableCell className="text-xs text-muted-foreground">{i + 1}</TableCell>
                    <TableCell className="text-xs font-medium">{m.name}</TableCell>
                    <TableCell className="text-xs font-mono">{m.carrierWeight}</TableCell>
                    <TableCell className="text-xs font-mono">{m.impactEnergy.toLocaleString()}</TableCell>
                    <TableCell className="text-xs font-mono">{m.impactRate}</TableCell>
                    <TableCell className="text-xs font-mono">{m.inputPower}</TableCell>
                    <TableCell className="text-xs font-mono">{m.efficiencyFactor}</TableCell>
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

export default MachineSpecsPage;
