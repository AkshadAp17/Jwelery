import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LanguageProvider } from "@/contexts/LanguageContext";
import Home from "@/pages/Home";
import CategoryPage from "@/pages/CategoryPage";
import ProductPage from "@/pages/ProductPage";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/necklaces" component={() => <CategoryPage category="necklaces" />} />
      <Route path="/haras" component={() => <CategoryPage category="haras" />} />
      <Route path="/mangalsutra" component={() => <CategoryPage category="mangalsutra" />} />
      <Route path="/rings" component={() => <CategoryPage category="rings" />} />
      <Route path="/earrings" component={() => <CategoryPage category="earrings" />} />
      <Route path="/bracelets" component={() => <CategoryPage category="bracelets" />} />
      <Route path="/pooja-items" component={() => <CategoryPage category="pooja-items" />} />
      <Route path="/product/:id" component={ProductPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </LanguageProvider>
    </QueryClientProvider>
  );
}

export default App;
