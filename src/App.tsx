import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "@/context/FinanceContext";
import { ThemeProvider } from "@/context/ThemeContext";
import Index from "./pages/Index";
import CalendarPage from "./pages/Calendar";
import SavingsPage from "./pages/Savings";
import AchievementsPage from "./pages/Achievements";
import AssistantPage from "./pages/Assistant";
import SettingsPage from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <FinanceProvider>
          <Toaster />
          <Sonner position="top-center" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/calendar" element={<CalendarPage />} />
              <Route path="/savings" element={<SavingsPage />} />
              <Route path="/achievements" element={<AchievementsPage />} />
              <Route path="/assistant" element={<AssistantPage />} />
              <Route path="/settings" element={<SettingsPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </FinanceProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
