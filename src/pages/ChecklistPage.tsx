import AnalysisChecklist from "@/components/AnalysisChecklist";
import { ClipboardCheck } from "lucide-react";

const ChecklistPage = () => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500/20 to-orange-500/20 flex items-center justify-center">
          <ClipboardCheck className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">Analysis Checklist</h1>
          <p className="text-xs text-muted-foreground">
            Verify all parameters before finalizing your analysis
          </p>
        </div>
      </div>
      <AnalysisChecklist />
    </div>
  );
};

export default ChecklistPage;
