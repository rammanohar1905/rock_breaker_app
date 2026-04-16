import {
  Home, Settings2, Gauge, BarChart3, PieChart, FileText, Wrench, Database, Cpu, Zap, ClipboardCheck,
} from "lucide-react";
import { NavLink } from "@/components/NavLink";
import { useLocation } from "react-router-dom";
import {
  Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent,
  SidebarGroupLabel, SidebarMenu, SidebarMenuButton, SidebarMenuItem, useSidebar,
} from "@/components/ui/sidebar";

const mainItems = [
  { title: "Home", url: "/", icon: Home },
  { title: "Geological Inputs", url: "/inputs", icon: Database },
  { title: "Machine Specs", url: "/machine-specs", icon: Cpu },
  { title: "Performance Data", url: "/performance", icon: Gauge },
];

const analysisItems = [
  { title: "Dashboard", url: "/dashboard", icon: BarChart3 },
  { title: "Analytics", url: "/analytics", icon: PieChart },
  { title: "Results", url: "/results", icon: FileText },
  { title: "Recommendations", url: "/recommendations", icon: Zap },
  { title: "SOP & Optimization", url: "/sop", icon: Wrench },
  { title: "Analysis Checklist", url: "/checklist", icon: ClipboardCheck },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const collapsed = state === "collapsed";
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  const renderGroup = (label: string, items: typeof mainItems) => (
    <SidebarGroup>
      <SidebarGroupLabel className="text-muted-foreground/60 uppercase tracking-wider text-[10px] font-semibold">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild>
                <NavLink
                  to={item.url}
                  end={item.url === "/"}
                  className="hover:bg-secondary/80 transition-colors"
                  activeClassName="bg-primary/10 text-primary font-medium border-l-2 border-primary"
                >
                  <item.icon className="mr-2 h-4 w-4 shrink-0" />
                  {!collapsed && <span>{item.title}</span>}
                </NavLink>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );

  return (
    <Sidebar collapsible="icon" className="border-r border-border">
      <SidebarContent className="pt-4">
        <div className="px-4 pb-4 mb-2 border-b border-border">
          {!collapsed ? (
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-md gradient-gold flex items-center justify-center">
                <Settings2 className="w-4 h-4 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-sm font-bold gradient-gold-text">RockBreaker</h2>
                <p className="text-[10px] text-muted-foreground">Analytics Platform</p>
              </div>
            </div>
          ) : (
            <div className="w-8 h-8 rounded-md gradient-gold flex items-center justify-center mx-auto">
              <Settings2 className="w-4 h-4 text-primary-foreground" />
            </div>
          )}
        </div>
        {renderGroup("Data Entry", mainItems)}
        {renderGroup("Analysis", analysisItems)}
      </SidebarContent>
    </Sidebar>
  );
}
