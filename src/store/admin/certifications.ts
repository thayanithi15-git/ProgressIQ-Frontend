import { create } from "zustand";
import api from "@/utils/api";
import { useNotificationStore } from "@/utils/notification";

export interface CertItem {
  _id: string;
  title: string;
  platform?: string;
  platformLink?: string;
  from?: string;
  to?: string;
  status?: string;
}

interface CertFilters {
  search?: string;
  status?: string;
}

interface CertsState {
  // data
  certs: CertItem[];
  total: number;

  // pagination
  page: number;
  limit: number;

  // ui state
  isLoading: boolean;

  // filters & sort
  filters: CertFilters;
  sort?: string;

  // actions
  setFilters: (filters: Partial<CertFilters>) => void;
  setPage: (page: number) => void;
  setLimit: (limit: number) => void;
  setSort: (sort: string) => void;

  fetchCerts: (opts?: Partial<{
    page: number;
    limit: number;
    filters: CertFilters;
    sort: string;
  }>) => Promise<void>;

  reset: () => void;
}

export const useAdminCertsStore = create<CertsState>((set, get) => ({

  // ───────── STATE ─────────
  certs: [],
  total: 0,

  page: 1,
  limit: 10,

  isLoading: false,

  filters: {},
  sort: "createdAt:desc",

  // ───────── ACTIONS ─────────

  setFilters: (newFilters) => {
    set({
      filters: {
        ...get().filters,
        ...newFilters,
      },
      page: 1, // reset pagination on filter change
    });
  },

  setPage: (page) => set({ page }),

  setLimit: (limit) => set({ limit, page: 1 }),

  setSort: (sort) => set({ sort, page: 1 }),

  // ───────── FETCH ─────────

  fetchCerts: async (opts) => {
    const { showNotification } = useNotificationStore.getState();

    const page = opts?.page ?? get().page;
    const limit = opts?.limit ?? get().limit;
    const sort = opts?.sort ?? get().sort;

    const filters = {
      ...(get().filters || {}),
      ...(opts?.filters || {}),
    };

    try {
      set({ isLoading: true });

      const params: any = {
        page,
        limit,
        sort,
      };

      if (filters.search) params.search = filters.search;
      if (filters.status) params.status = filters.status;

      const res = await api.get("/api/admin/certifications", {
        params,
      });

      set({
        certs: res.data.certs || [],
        total: res.data.total || 0,
        page,
        limit,
        filters,
        sort,
      });

    } catch (err: any) {
      showNotification(
        err.response?.data?.message || "Failed to load certifications",
        "error"
      );
    } finally {
      set({ isLoading: false });
    }
  },

  // ───────── RESET ─────────

  reset: () =>
    set({
      certs: [],
      total: 0,
      page: 1,
      limit: 10,
      filters: {},
      sort: "createdAt:desc",
    }),
}));
