import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { HashRouter, Routes, Route } from "react-router-dom";
import SparkleTrail from "./components/SparkleTrail";
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

const App = () => {
  console.log('=== APP COMPONENT RENDERING ===');
  
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <SparkleTrail />
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
      </TooltipProvider>
    </QueryClientProvider>
  );
};

console.log('=== APP COMPONENT DEFINED ===');

export default App;
