import { useState, useEffect } from "react";
import { Download, X, Wifi, WifiOff, RefreshCw, Share } from "lucide-react";
import { Button } from "@/components/ui/button";
import { usePWA } from "@/hooks/usePWA";
import { toast } from "@/hooks/use-toast";

export function PWAInstallPrompt() {
  const { canInstall, isOnline, needsUpdate, installApp, updateApp, showIOSInstall, isInstalled } = usePWA();
  const [showBanner, setShowBanner] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show banner after 3 seconds if can install
    const timer = setTimeout(() => {
      if ((canInstall || showIOSInstall) && !dismissed) {
        setShowBanner(true);
      }
    }, 3000);

    return () => clearTimeout(timer);
  }, [canInstall, showIOSInstall, dismissed]);

  const handleInstall = async () => {
    const success = await installApp();
    if (success) {
      toast({
        title: "App Installed!",
        description: "MoneyTracker is now on your home screen",
      });
      setShowBanner(false);
    }
  };

  const handleDismiss = () => {
    setDismissed(true);
    setShowBanner(false);
  };

  // Offline indicator
  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 z-50 bg-destructive text-destructive-foreground py-2 px-4 flex items-center justify-center gap-2 text-sm">
        <WifiOff className="h-4 w-4" />
        <span>You're offline. Some features may be limited.</span>
      </div>
    );
  }

  // Update prompt
  if (needsUpdate) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 bg-primary text-primary-foreground rounded-xl p-4 shadow-lg animate-slide-up">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <RefreshCw className="h-5 w-5" />
            <div>
              <p className="font-semibold">Update Available</p>
              <p className="text-sm opacity-90">Tap to get the latest features</p>
            </div>
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={updateApp}
            className="shrink-0"
          >
            Update
          </Button>
        </div>
      </div>
    );
  }

  // Install banner
  if (!showBanner) return null;

  // iOS specific instructions
  if (showIOSInstall) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 glass-card rounded-xl p-4 shadow-lg animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-start gap-3 pr-6">
          <div className="p-2 rounded-lg bg-primary/10">
            <Share className="h-6 w-6 text-primary" />
          </div>
          <div>
            <p className="font-semibold text-foreground">Install MoneyTracker</p>
            <p className="text-sm text-muted-foreground mt-1">
              Tap <Share className="h-3 w-3 inline" /> then "Add to Home Screen"
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Android/Desktop install banner
  if (canInstall) {
    return (
      <div className="fixed bottom-20 left-4 right-4 z-50 glass-card rounded-xl p-4 shadow-lg animate-slide-up">
        <button
          onClick={handleDismiss}
          className="absolute top-2 right-2 p-1 rounded-full hover:bg-muted"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="flex items-center justify-between gap-3 pr-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Download className="h-6 w-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">Install App</p>
              <p className="text-sm text-muted-foreground">Add to home screen for quick access</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={handleInstall}
            className="shrink-0"
          >
            Install
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

export function PWAStatus() {
  const { isInstalled, isOnline } = usePWA();

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      {isOnline ? (
        <Wifi className="h-4 w-4 text-primary" />
      ) : (
        <WifiOff className="h-4 w-4 text-destructive" />
      )}
      <span>{isInstalled ? "Installed" : "Web App"}</span>
    </div>
  );
}
