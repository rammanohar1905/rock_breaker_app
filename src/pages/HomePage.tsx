import { Link } from "react-router-dom";
import { Database, Cpu, Gauge, BarChart3, PieChart, FileText, Zap, Wrench, ArrowRight } from "lucide-react";

const modules = [
  { title: "Geological Inputs", desc: "Rock type, UCS, hardness, density, RQD", icon: Database, url: "/inputs", color: "from-amber-500/20 to-orange-500/20" },
  { title: "Machine Specs", desc: "Carrier weight, hydraulic parameters, impact energy", icon: Cpu, url: "/machine-specs", color: "from-teal-500/20 to-cyan-500/20" },
  { title: "Performance Data", desc: "Weekly operational data & multi-machine comparison", icon: Gauge, url: "/performance", color: "from-blue-500/20 to-indigo-500/20" },
  { title: "Dashboard", desc: "Real-time utilization, production, downtime charts", icon: BarChart3, url: "/dashboard", color: "from-green-500/20 to-emerald-500/20" },
  { title: "Analytics", desc: "Advanced performance comparisons & correlations", icon: PieChart, url: "/analytics", color: "from-purple-500/20 to-pink-500/20" },
  { title: "Results", desc: "Calculated outputs, reports & recommendations", icon: FileText, url: "/results", color: "from-red-500/20 to-rose-500/20" },
  { title: "Recommendations", desc: "AI-driven optimal breaker selection", icon: Zap, url: "/recommendations", color: "from-yellow-500/20 to-amber-500/20" },
  { title: "SOP & Optimization", desc: "Standard procedures & efficiency improvements", icon: Wrench, url: "/sop", color: "from-slate-500/20 to-gray-500/20" },
];

const HomePage = () => {
  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Hero */}
      <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8 glow-amber">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-accent/5" />
        <div className="relative">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4">
            <span className="w-2 h-2 rounded-full bg-primary animate-pulse-glow" />
            MINING ANALYTICS PLATFORM
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            Rock Breaker <span className="gradient-gold-text">Performance Analysis</span>
          </h1>
          <p className="text-muted-foreground max-w-2xl text-sm leading-relaxed">
            Comprehensive analysis and optimization platform for rock breakers in limestone mining.
            Monitor equipment performance, predict productivity, and optimize operational efficiency
            through data-driven insights.
          </p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Active Breakers", value: "3", unit: "machines" },
          { label: "Avg Utilization", value: "78", unit: "%" },
          { label: "Weekly Output", value: "2,859", unit: "m³" },
          { label: "Avg Availability", value: "91", unit: "%" },
        ].map((m) => (
          <div key={m.label} className="rounded-lg border border-border bg-card p-4 card-hover">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground mb-1">{m.label}</p>
            <p className="text-2xl font-bold font-mono">
              {m.value}<span className="text-sm text-muted-foreground ml-1">{m.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Module Grid */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Modules</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
          {modules.map((mod) => (
            <Link
              key={mod.title}
              to={mod.url}
              className="group rounded-lg border border-border bg-card p-5 card-hover block"
            >
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${mod.color} flex items-center justify-center mb-3`}>
                <mod.icon className="w-5 h-5 text-foreground" />
              </div>
              <h3 className="font-semibold text-sm mb-1 group-hover:text-primary transition-colors">{mod.title}</h3>
              <p className="text-xs text-muted-foreground leading-relaxed">{mod.desc}</p>
              <div className="mt-3 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Open <ArrowRight className="w-3 h-3 ml-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Importance Section */}
      <div className="rounded-xl border border-border bg-card p-6">
        <h2 className="text-lg font-semibold mb-3">Why Rock Breaker Performance Matters</h2>
        <div className="grid md:grid-cols-3 gap-4 text-sm text-muted-foreground">
          <div>
            <h3 className="text-foreground font-medium mb-1">Cost Optimization</h3>
            <p className="text-xs leading-relaxed">Proper breaker selection and operation can reduce primary breaking costs by 15-30%, directly impacting mine profitability.</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Equipment Longevity</h3>
            <p className="text-xs leading-relaxed">Matching breaker specifications to rock properties minimizes wear and extends tool life by up to 40%.</p>
          </div>
          <div>
            <h3 className="text-foreground font-medium mb-1">Production Targets</h3>
            <p className="text-xs leading-relaxed">Data-driven optimization ensures consistent production rates and reduces unplanned downtime.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
