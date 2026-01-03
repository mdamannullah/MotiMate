import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ThemeProvider } from "@/contexts/ThemeContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { DataProvider } from "@/contexts/DataContext";

import SplashScreen from "./pages/SplashScreen";
import OnboardingScreen from "./pages/OnboardingScreen";
import HomeScreen from "./pages/HomeScreen";
import LoginScreen from "./pages/LoginScreen";
import SignupScreen from "./pages/SignupScreen";
import VerifyOtpScreen from "./pages/VerifyOtpScreen";
import ForgotPasswordScreen from "./pages/ForgotPasswordScreen";
import DashboardScreen from "./pages/DashboardScreen";
import AiTutorScreen from "./pages/AiTutorScreen";
import TestsScreen from "./pages/TestsScreen";
import TakeTestScreen from "./pages/TakeTestScreen";
import AnalyticsScreen from "./pages/AnalyticsScreen";
import ProfileScreen from "./pages/ProfileScreen";
import SettingsScreen from "./pages/SettingsScreen";
import SubscriptionScreen from "./pages/SubscriptionScreen";
import AboutScreen from "./pages/AboutScreen";
import ContactScreen from "./pages/ContactScreen";
import NotificationsScreen from "./pages/NotificationsScreen";
import ChangePasswordScreen from "./pages/ChangePasswordScreen";
import PrivacySettingsScreen from "./pages/PrivacySettingsScreen";
import TermsScreen from "./pages/TermsScreen";
import DeleteAccountScreen from "./pages/DeleteAccountScreen";
import LiveTranslateScreen from "./pages/LiveTranslateScreen";
import NotesScreen from "./pages/NotesScreen";
import HelpScreen from "./pages/HelpScreen";
import LanguageSettingsScreen from "./pages/LanguageSettingsScreen";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <DataProvider>
            <TooltipProvider>
              <Toaster />
              <Sonner />
              <BrowserRouter>
                <Routes>
                  <Route path="/" element={<SplashScreen />} />
                  <Route path="/onboarding" element={<OnboardingScreen />} />
                  <Route path="/home" element={<HomeScreen />} />
                  <Route path="/login" element={<LoginScreen />} />
                  <Route path="/signup" element={<SignupScreen />} />
                  <Route path="/verify-otp" element={<VerifyOtpScreen />} />
                  <Route path="/forgot-password" element={<ForgotPasswordScreen />} />
                  <Route path="/about" element={<AboutScreen />} />
                  <Route path="/contact" element={<ContactScreen />} />
                  <Route path="/dashboard" element={<DashboardScreen />} />
                  <Route path="/ai-tutor" element={<AiTutorScreen />} />
                  <Route path="/tests" element={<TestsScreen />} />
                  <Route path="/test/:testId" element={<TakeTestScreen />} />
                  <Route path="/analytics" element={<AnalyticsScreen />} />
                  <Route path="/profile" element={<ProfileScreen />} />
                  <Route path="/settings" element={<SettingsScreen />} />
                  <Route path="/subscription" element={<SubscriptionScreen />} />
                  <Route path="/notifications" element={<NotificationsScreen />} />
                  <Route path="/change-password" element={<ChangePasswordScreen />} />
                  <Route path="/privacy-settings" element={<PrivacySettingsScreen />} />
                  <Route path="/terms" element={<TermsScreen />} />
                  <Route path="/delete-account" element={<DeleteAccountScreen />} />
                  <Route path="/live-translate" element={<LiveTranslateScreen />} />
                  <Route path="/notes" element={<NotesScreen />} />
                  <Route path="/help" element={<HelpScreen />} />
                  <Route path="/language" element={<LanguageSettingsScreen />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </BrowserRouter>
            </TooltipProvider>
          </DataProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
