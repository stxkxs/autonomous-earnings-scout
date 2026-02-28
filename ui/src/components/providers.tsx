"use client";

import { UserDataProvider } from "@/contexts/user-data-context";
import { ReactNode } from "react";

export function Providers({ children }: { children: ReactNode }) {
  return <UserDataProvider>{children}</UserDataProvider>;
}
