import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider, useAuth } from "./components/auth/AuthProvider";
import { LoginScreen } from "./components/auth/LoginScreen";
import { SubscriptionGate } from "./components/subscription/SubscriptionGate";
import SparkleTrail from "./components/SparkleTrail";
import { UpdateNotification } from "./components/UpdateNotification";
import Index from "./pages/Index";
import Hair from "./pages/Hair";
import Colours from "./pages/Colours";
import Tops from "./pages/Tops";
import Dresses from "./pages/Dresses";
import Pants from "./pages/Pants";
import Shoes from "./pages/Shoes";
import Adjustments from "./pages/Adjustments";
import NotFound from "./pages/NotFound";

console.log('=== APP.TSX LOADING ===');
const queryClient = new QueryClient();

console.log('=== APP COMPONENT STARTING ===');

const AppContent = () => {
  const { user, loading, hasActiveSubscription } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-purple-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  // Show login screen if not authenticated
  if (!user) {
    return <LoginScreen />;
  }

  // Show subscription gate if user doesn't have active subscription
  if (!hasActiveSubscription) {
    return <SubscriptionGate />;
  }

  // Show the main app if user is authenticated and has active subscription
  return (
    <>
      <SparkleTrail />
      <UpdateNotification />
      <HashRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/hair" element={<Hair />} />
          <Route path="/colours" element={<Colours />} />
          <Route path="/tops" element={<Tops />} />
          <Route path="/dresses" element={<Dresses />} />
          <Route path="/pants" element={<Pants />} />
          <Route path="/shoes" element={<Shoes />} />
          <Route path="/adjustments" element={<Adjustments />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </HashRouter>
    </>
  );
};

const App = () => {
  console.log('=== APP COMPONENT RENDERING ===');
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <AppContent />
          </TooltipProvider>
        </ThemeProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

console.log('=== APP COMPONENT DEFINED ===');

export default App;
