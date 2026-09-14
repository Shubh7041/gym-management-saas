import type { ReactNode } from "react";

import { DevelopmentOverlay } from "@/components/common/development/DevelopmentOverlay";
// import { developmentConfig } from "@/lib/constants/development";

import { AuthProvider } from "./AuthProvider";
import { developmentConfig } from "@/lib/constant/development";

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({
  children,
}: AppProvidersProps) {
  return (
    <AuthProvider>
      {children}

      <DevelopmentOverlay
        enabled={developmentConfig.enabled}
        developerName={developmentConfig.developerName}
      />
    </AuthProvider>
  );
}