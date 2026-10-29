import { lazy, Suspense } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index.tsx";
import NotFound from "./pages/NotFound.tsx";
import ThankYou from "./pages/ThankYou.tsx";
import FiveFoldGift from "./pages/FiveFoldGift.tsx";
import PastorSystemsAudit from "./pages/PastorSystemsAudit.tsx";
import PSAThankYou from "./pages/PSAThankYou.tsx";
import CookiePolicy from "./pages/CookiePolicy.tsx";
import DoNotSell from "./pages/DoNotSell.tsx";
import CCPAInfo from "./pages/CCPAInfo.tsx";
import SitemapPage from "./pages/Sitemap.tsx";
import Trust from "./pages/Trust.tsx";
import AdminLogin from "./pages/AdminLogin.tsx";
import AdminDashboard from "./pages/AdminDashboard.tsx";
import InheritYourFreedom from "./pages/InheritYourFreedom.tsx";
import InheritYourFreedomShop from "./pages/InheritYourFreedomShop.tsx";
import InheritYourFreedomCheckout from "./pages/InheritYourFreedomCheckout.tsx";
import InheritYourFreedomSuccess from "./pages/InheritYourFreedomSuccess.tsx";
import InheritYourFreedomCancel from "./pages/InheritYourFreedomCancel.tsx";
import ChurchSystemsStarterKit from "./pages/ChurchSystemsStarterKit.tsx";
import ScrollToTop from "./components/ScrollToTop.tsx";
import PageMeta from "./components/PageMeta.tsx";

const CookieConsent = lazy(() => import("@/components/CookieConsent"));
const AccessibilityPanel = lazy(() => import("@/components/AccessibilityPanel"));

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <PageMeta />
        <Routes>
          <Route path="/" element={<Navigate to="/greece-turkey-tour" replace />} />
          <Route path="/greece-turkey-tour" element={<Index />} />
          <Route path="/greece-turkey-tour-thank-you" element={<ThankYou />} />
          <Route path="/five-fold-gift" element={<FiveFoldGift />} />
          <Route path="/pastor-systems-audit" element={<PastorSystemsAudit />} />
          <Route path="/pastor-systems-audit-thank-you" element={<PSAThankYou />} />
          <Route path="/cookie-policy" element={<CookiePolicy />} />
          <Route path="/do-not-sell-my-info" element={<DoNotSell />} />
          <Route path="/ccpa" element={<CCPAInfo />} />
          <Route path="/sitemap" element={<SitemapPage />} />
          <Route path="/trust" element={<Trust />} />
          <Route path="/inherit-your-freedom" element={<InheritYourFreedom />} />
          <Route path="/inherit-your-freedom/shop" element={<InheritYourFreedomShop />} />
          <Route path="/inherit-your-freedom/checkout" element={<InheritYourFreedomCheckout />} />
          {/* Retired with the old create-checkout flow. Kept as a redirect so any
              Stripe session still carrying the old success_url lands somewhere
              sensible instead of a 404. */}
          <Route
            path="/inherit-your-freedom/thank-you"
            element={<Navigate to="/inherit-your-freedom/success" replace />}
          />
          <Route path="/inherit-your-freedom/success" element={<InheritYourFreedomSuccess />} />
          <Route path="/inherit-your-freedom/cancel" element={<InheritYourFreedomCancel />} />
          <Route path="/church-systems-starter-kit" element={<ChurchSystemsStarterKit />} />
          <Route path="/admin" element={<AdminLogin />} />
          <Route path="/admin/dashboard" element={<AdminDashboard />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Suspense fallback={null}>
          <CookieConsent />
          <AccessibilityPanel />
        </Suspense>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
