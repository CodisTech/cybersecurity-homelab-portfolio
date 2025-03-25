import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/header";
import Sidebar from "@/components/layout/sidebar";
import Footer from "@/components/layout/footer";
import Home from "@/pages/home";
import Documentation from "@/pages/documentation";
import Services from "@/pages/services";
import Tutorials from "@/pages/tutorials";
import TutorialDetail from "@/pages/tutorial-detail";
import { SearchProvider } from "@/contexts/search-context";

function Router() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Header />
      <div className="flex flex-col md:flex-row max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex-grow w-full">
        <Sidebar />
        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <Switch>
            <Route path="/" component={Home} />
            <Route path="/documentation" component={Documentation} />
            <Route path="/services" component={Services} />
            <Route path="/tutorials" component={Tutorials} />
            <Route path="/tutorials/:slug" component={TutorialDetail} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <SearchProvider>
        <Router />
        <Toaster />
      </SearchProvider>
    </QueryClientProvider>
  );
}

export default App;
