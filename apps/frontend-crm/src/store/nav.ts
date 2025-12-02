import { create } from "zustand";
import { persist } from "zustand/middleware";
import { MODULES, ModuleId } from "@/lib/modules";

interface NavState {
  activeModule: ModuleId;
  setActiveModule: (module: ModuleId) => void;
}

export const useNavStore = create<NavState>()(
  persist(
    (set) => ({
      activeModule: MODULES.CRM,
      setActiveModule: (module) => set({ activeModule: module }),
    }),
    {
      name: "nav-storage",
    }
  )
);
