import { useMiningData, ChecklistItem } from "@/context/MiningDataContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Trash2, ClipboardCheck } from "lucide-react";
import { useState } from "react";

const AnalysisChecklist = () => {
  const { checklist, setChecklist } = useMiningData();
  const [newParam, setNewParam] = useState("");
  const [newCategory, setNewCategory] = useState("Geological");

  const categories = [...new Set(checklist.map((c) => c.category))];
  const completedCount = checklist.filter((c) => c.checked).length;
  const totalCount = checklist.length;
  const progress = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  const toggleCheck = (id: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, checked: !c.checked } : c))
    );
  };

  const updateNotes = (id: string, notes: string) => {
    setChecklist((prev) =>
      prev.map((c) => (c.id === id ? { ...c, notes } : c))
    );
  };

  const addItem = () => {
    if (!newParam.trim()) return;
    const item: ChecklistItem = {
      id: `cl-${Date.now()}`,
      category: newCategory,
      parameter: newParam.trim(),
      checked: false,
      notes: "",
    };
    setChecklist((prev) => [...prev, item]);
    setNewParam("");
  };

  const removeItem = (id: string) => {
    setChecklist((prev) => prev.filter((c) => c.id !== id));
  };

  return (
    <Card className="border-border bg-card">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ClipboardCheck className="w-4 h-4 text-primary" />
            <CardTitle className="text-sm">Analysis Checklist</CardTitle>
          </div>
          <Badge variant="outline" className="text-[10px] font-mono">
            {completedCount}/{totalCount} ({progress.toFixed(0)}%)
          </Badge>
        </div>
        <div className="w-full h-2 bg-secondary rounded-full mt-2 overflow-hidden">
          <div
            className="h-full bg-primary rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {categories.map((cat) => (
          <div key={cat}>
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
              {cat}
            </p>
            <div className="space-y-2">
              {checklist
                .filter((c) => c.category === cat)
                .map((item) => (
                  <div
                    key={item.id}
                    className={`flex items-start gap-3 p-2 rounded-md border transition-colors ${
                      item.checked
                        ? "border-primary/30 bg-primary/5"
                        : "border-border bg-secondary/30"
                    }`}
                  >
                    <Checkbox
                      checked={item.checked}
                      onCheckedChange={() => toggleCheck(item.id)}
                      className="mt-0.5"
                    />
                    <div className="flex-1 min-w-0">
                      <p
                        className={`text-xs ${
                          item.checked
                            ? "line-through text-muted-foreground"
                            : "text-foreground"
                        }`}
                      >
                        {item.parameter}
                      </p>
                      <Input
                        placeholder="Add notes..."
                        value={item.notes}
                        onChange={(e) => updateNotes(item.id, e.target.value)}
                        className="mt-1 h-7 text-[10px] bg-background/50"
                      />
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 text-destructive shrink-0"
                      onClick={() => removeItem(item.id)}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
            </div>
          </div>
        ))}

        {/* Add new item */}
        <div className="flex gap-2 pt-2 border-t border-border">
          <select
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            className="text-xs rounded-md border border-input bg-background px-2 py-1.5"
          >
            <option>Geological</option>
            <option>Machine</option>
            <option>Performance</option>
            <option>Safety</option>
          </select>
          <Input
            placeholder="New checklist parameter..."
            value={newParam}
            onChange={(e) => setNewParam(e.target.value)}
            className="h-8 text-xs flex-1"
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <Button variant="outline" size="sm" onClick={addItem}>
            <Plus className="w-3 h-3 mr-1" /> Add
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default AnalysisChecklist;
