import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { MiningDataProvider } from "@/context/MiningDataContext";
import { AppLayout } from "@/components/AppLayout";
import HomePage from "@/pages/HomePage";
import InputsPage from "@/pages/InputsPage";
import MachineSpecsPage from "@/pages/MachineSpecsPage";
import PerformancePage from "@/pages/PerformancePage";
import DashboardPage from "@/pages/DashboardPage";
import AnalyticsPage from "@/pages/AnalyticsPage";
import ResultsPage from "@/pages/ResultsPage";
import RecommendationsPage from "@/pages/RecommendationsPage";
import SOPPage from "@/pages/SOPPage";
import ChecklistPage from "@/pages/ChecklistPage";
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <MiningDataProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<AppLayout />}>
              <Route path="/" element={<HomePage />} />
              <Route path="/inputs" element={<InputsPage />} />
              <Route path="/machine-specs" element={<MachineSpecsPage />} />
              <Route path="/performance" element={<PerformancePage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/analytics" element={<AnalyticsPage />} />
              <Route path="/results" element={<ResultsPage />} />
              <Route path="/recommendations" element={<RecommendationsPage />} />
              <Route path="/sop" element={<SOPPage />} />
              <Route path="/checklist" element={<ChecklistPage />} />
            </Route>
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </MiningDataProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
