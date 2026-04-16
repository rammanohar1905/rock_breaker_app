import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Wrench, Shield, Target, Zap, AlertTriangle, CheckCircle2 } from "lucide-react";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

const sopSections = [
  {
    id: "positioning",
    title: "Proper Positioning of Breaker",
    icon: Target,
    steps: [
      "Position the breaker perpendicular to the rock surface for maximum impact energy transfer",
      "Ensure the carrier is on stable, level ground before commencing breaking operations",
      "Maintain minimum 1.5m distance from bench edge to prevent carrier tip-over",
      "Align the tool tip with natural fracture planes when visible",
      "Reposition every 15-20 seconds if no penetration is achieved",
    ],
  },
  {
    id: "impact-angle",
    title: "Correct Impact Angle (~90°)",
    icon: Zap,
    steps: [
      "Maintain tool perpendicular to rock surface (85-95° optimal range)",
      "Avoid angled impacts which reduce energy transfer by up to 40%",
      "Use boom positioning to achieve correct angle rather than forcing the tool",
      "For irregular surfaces, start at the highest point and work downward",
      "Monitor tool tip alignment through cabin visibility or camera systems",
    ],
  },
  {
    id: "idle-blows",
    title: "Avoid Idle Blows",
    icon: AlertTriangle,
    steps: [
      "Stop breaking immediately when tool penetrates through the rock",
      "Never operate breaker with tool fully extended (blank firing)",
      "Limit continuous breaking to 30-second intervals to prevent overheating",
      "Monitor hydraulic pressure gauges for drop indicating tool has penetrated",
      "Train operators to recognize audio cues of idle blows vs productive breaking",
    ],
  },
  {
    id: "tool-selection",
    title: "Optimal Tool Selection",
    icon: Shield,
    steps: [
      "Use moil point tools for hard, massive rock (UCS > 100 MPa)",
      "Use chisel tools for bedded or laminated limestone formations",
      "Use blunt tools for secondary breaking of pre-cracked material",
      "Inspect tool wear daily - replace when wear exceeds 30% of original diameter",
      "Match tool grade to rock abrasiveness (higher Mohs = harder tool steel)",
    ],
  },
  {
    id: "maintenance",
    title: "Maintenance Practices",
    icon: Wrench,
    steps: [
      "Grease tool bushings every 2 hours of operation",
      "Check hydraulic oil level and condition at start of each shift",
      "Inspect accumulator nitrogen pressure weekly (within ±5% of specification)",
      "Replace hydraulic filters at 500-hour intervals or per manufacturer schedule",
      "Document all maintenance activities for trend analysis and cost tracking",
    ],
  },
];

const efficiencyTips = [
  { title: "Reduce Idle Time", desc: "Coordinate with loader operators to minimize wait times. Target <15% idle time per shift. Use radio communication for material flow coordination.", icon: "⏱️" },
  { title: "Optimize Hydraulic Parameters", desc: "Adjust hydraulic pressure and flow to match rock conditions. Over-pressure wastes energy; under-pressure reduces breaking efficiency. Fine-tune within ±10% of nominal.", icon: "⚙️" },
  { title: "Match Breaker with Rock Strength", desc: "Select breaker with impact energy ≥ 100× UCS value. Oversized breakers waste fuel; undersized ones increase wear and cycle time.", icon: "🎯" },
  { title: "Improve Operator Practices", desc: "Provide quarterly training on breaking techniques. Experienced operators achieve 20-30% higher productivity. Use performance data to identify coaching opportunities.", icon: "👷" },
  { title: "Optimize Blast Fragmentation", desc: "Coordinate with drill & blast team to optimize fragment size. Ideal feed size for primary breaking: 0.8-1.2m. Reduces secondary breaking requirement.", icon: "💎" },
  { title: "Implement Preventive Maintenance", desc: "Follow manufacturer maintenance schedules strictly. Preventive maintenance reduces unplanned downtime by 40-60%. Track component life for predictive replacement.", icon: "🔧" },
];

const SOPPage = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-slate-500/20 to-gray-500/20 flex items-center justify-center">
          <Wrench className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold">SOP & Optimization</h1>
          <p className="text-xs text-muted-foreground">Standard Operating Procedures & efficiency improvement guidelines</p>
        </div>
      </div>

      {/* SOP Accordion */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" /> Standard Operating Procedures
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="multiple" className="space-y-2">
            {sopSections.map((section) => (
              <AccordionItem key={section.id} value={section.id} className="border border-border rounded-lg px-4">
                <AccordionTrigger className="text-sm hover:no-underline">
                  <div className="flex items-center gap-2">
                    <section.icon className="w-4 h-4 text-primary" />
                    {section.title}
                  </div>
                </AccordionTrigger>
                <AccordionContent>
                  <ol className="space-y-2 ml-6">
                    {section.steps.map((step, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-muted-foreground">
                        <CheckCircle2 className="w-3 h-3 text-primary mt-0.5 shrink-0" />
                        {step}
                      </li>
                    ))}
                  </ol>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Efficiency Tips */}
      <Card className="border-border bg-card">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-primary" /> Efficiency Improvement Suggestions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4">
            {efficiencyTips.map((tip, i) => (
              <div key={i} className="rounded-lg border border-border p-4 card-hover">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">{tip.icon}</span>
                  <h3 className="text-sm font-semibold">{tip.title}</h3>
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">{tip.desc}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default SOPPage;
