import type { Branch, Tenant } from "@/features/tenanats/types/tenant.types";
import { create } from "zustand";

interface AppState {
  sidebarCollapsed: boolean;

  currentTenant: Tenant | null;
  branches: Branch[];
  selectedBranchId: string | null;

  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;

  setCurrentTenant: (tenant: Tenant | null) => void;
  setBranches: (branches: Branch[]) => void;
  setSelectedBranchId: (branchId: string | null) => void;

  resetAppState: () => void;
}

const initialState = {
  sidebarCollapsed: false,
  currentTenant: null,
  branches: [],
  selectedBranchId: null,
};

export const useAppStore = create<AppState>((set) => ({
  ...initialState,

  setSidebarCollapsed: (collapsed) =>
    set({
      sidebarCollapsed: collapsed,
    }),

  toggleSidebar: () =>
    set((state) => ({
      sidebarCollapsed: !state.sidebarCollapsed,
    })),

  setCurrentTenant: (tenant) =>
    set({
      currentTenant: tenant,
    }),

  setBranches: (branches) =>
    set({
      branches,
    }),

  setSelectedBranchId: (branchId) =>
    set({
      selectedBranchId: branchId,
    }),

  resetAppState: () =>
    set({
      ...initialState,
    }),
}));