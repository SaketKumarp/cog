"use client";
import { useAuth, RedirectToSignIn } from "@clerk/nextjs";
import { useEffect, useState } from "react";

export function ClientWatcher() {
  const { isLoaded, isSignedIn } = useAuth();
  const [shouldRedirect, setShouldRedirect] = useState(false);

  useEffect(() => {
    if (isLoaded && !isSignedIn) {
      setShouldRedirect(true);
    }
  }, [isLoaded, isSignedIn]);

  if (shouldRedirect) {
    return <RedirectToSignIn />;
  }

  return null;
}
