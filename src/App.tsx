import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { FinanceProvider } from "@/context/FinanceContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { AuthProvider } from "@/context/AuthContext";
import { PWAInstallPrompt } from "@/components/PWAInstallPrompt";
import Index from "./pages/Index";
import CalendarPage from "./pages/Calendar";
import SavingsPage from "./pages/Savings";
import AchievementsPage from "./pages/Achievements";
import AssistantPage from "./pages/Assistant";
import SettingsPage from "./pages/Settings";
import RecurringPage from "./pages/Recurring";
import AuthPage from "./pages/Auth";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <ThemeProvider>
        <AuthProvider>
          <FinanceProvider>
            <Toaster />
            <Sonner position="top-center" />
            <PWAInstallPrompt />
            <BrowserRouter>
              <Routes>
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/" element={<Index />} />
                <Route path="/calendar" element={<CalendarPage />} />
                <Route path="/savings" element={<SavingsPage />} />
                <Route path="/achievements" element={<AchievementsPage />} />
                <Route path="/assistant" element={<AssistantPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/recurring" element={<RecurringPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </FinanceProvider>
        </AuthProvider>
      </ThemeProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
