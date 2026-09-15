import { useEffect, useState } from "react";
import { tenantService } from "../services/tenant.service";
import { useAppStore } from "@/stores/app.store";

export function useTenantContext() {
  const currentTenant = useAppStore((state) => state.currentTenant);
  const branches = useAppStore((state) => state.branches);
  const selectedBranchId = useAppStore((state) => state.selectedBranchId);

  const setCurrentTenant = useAppStore((state) => state.setCurrentTenant);

  const setBranches = useAppStore((state) => state.setBranches);

  const setSelectedBranchId = useAppStore((state) => state.setSelectedBranchId);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function loadTenantContext() {
      try {
        setLoading(true);
        setError(null);

        const tenant = await tenantService.getCurrentTenant();
        const tenantBranches = await tenantService.getBranches(tenant.id);

        if (!isMounted) return;

        setCurrentTenant(tenant);
        setBranches(tenantBranches);

        const currentSelectedBranchId = useAppStore.getState().selectedBranchId;

        if (!currentSelectedBranchId && tenantBranches.length > 0) {
          setSelectedBranchId(tenantBranches[0].id);
        }
      } catch (err) {
        if (!isMounted) return;

        setError(
          err instanceof Error ? err.message : "Unable to load gym context.",
        );
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    }

    loadTenantContext();

    return () => {
      isMounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    // selectedBranchId,
    setBranches,
    setCurrentTenant,
    setSelectedBranchId,
  ]);

  return {
    currentTenant,
    branches,
    selectedBranchId,
    loading,
    error,
  };
}
