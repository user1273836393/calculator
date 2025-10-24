import { Toaster } from "@/components/ui";
import { SonnerToaster as Sonner } from "@/components/ui";
import { TooltipProvider } from "@/components/ui";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "@/components/Layout";
import Calculator from "./pages/Calculator";
import Converter from "./pages/Converter";
import Tools from "./pages/Tools";
import Finance from "./pages/Finance";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
    <QueryClientProvider client={queryClient}>
        <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<Calculator />} />
                        <Route path="/converter" element={<Converter />} />
                        <Route path="/tools" element={<Tools />} />
                        <Route path="/finance" element={<Finance />} />
                        <Route path="/settings" element={<Settings />} />
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </BrowserRouter>
        </TooltipProvider>
    </QueryClientProvider>
);

export default App;
