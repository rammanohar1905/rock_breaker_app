import React, { createContext, useContext, useMemo, useState, ReactNode } from "react";

export interface GeologicalInput {
  rockType: string;
  ucs: number;
  mohsHardness: number;
  density: number;
  rqd: number;
  weatheringDegree: string;
  customParams: { name: string; value: string }[];
}

export interface MachineSpec {
  id: string;
  name: string;
  carrierWeight: number;
  serviceWeight: number;
  toolDiameter: number;
  totalLength: number;
  impactRate: number;
  hydraulicOilFlow: number;
  hydraulicPressure: number;
  hydraulicInputPower: number;
  impactEnergy: number;
  inputPower: number;
  efficiencyFactor: number;
  customParams: { name: string; value: string }[];
}

export interface PerformanceEntry {
  id: string;
  breakerId: string;
  week: string;
  totalShiftTime: number;
  idleTime: number;
  breakdownTime: number;
  breakingTime: number;
  productionPerHour: number;
  productionPerShift: number;
  productionPerDay: number;
  fuelConsumption: number;
  customFields: { name: string; value: string }[];
}

export interface ChecklistItem {
  id: string;
  category: string;
  parameter: string;
  checked: boolean;
  notes: string;
}

interface MiningDataContextType {
  geological: GeologicalInput;
  setGeological: React.Dispatch<React.SetStateAction<GeologicalInput>>;
  machines: MachineSpec[];
  setMachines: React.Dispatch<React.SetStateAction<MachineSpec[]>>;
  performance: PerformanceEntry[];
  setPerformance: React.Dispatch<React.SetStateAction<PerformanceEntry[]>>;
  checklist: ChecklistItem[];
  setChecklist: React.Dispatch<React.SetStateAction<ChecklistItem[]>>;
}

const defaultGeological: GeologicalInput = {
  rockType: "Limestone",
  ucs: 80,
  mohsHardness: 3.5,
  density: 2.65,
  rqd: 70,
  weatheringDegree: "Slightly Weathered",
  customParams: [],
};

// Empty array - only machines added by users will be shown
const defaultMachines: MachineSpec[] = [];

// Empty array - only performance data for user-added machines
const defaultPerformance: PerformanceEntry[] = [];

const defaultChecklist: ChecklistItem[] = [
  { id: "cl-1", category: "Geological", parameter: "UCS value verified against lab test", checked: false, notes: "" },
  { id: "cl-2", category: "Geological", parameter: "Rock type classification confirmed", checked: false, notes: "" },
  { id: "cl-3", category: "Geological", parameter: "RQD measurement validated", checked: false, notes: "" },
  { id: "cl-4", category: "Geological", parameter: "Mohs hardness cross-checked", checked: false, notes: "" },
  { id: "cl-5", category: "Geological", parameter: "Weathering degree assessed on-site", checked: false, notes: "" },
  { id: "cl-6", category: "Geological", parameter: "Rock density lab-tested", checked: false, notes: "" },
  { id: "cl-7", category: "Machine", parameter: "Carrier weight matches excavator class", checked: false, notes: "" },
  { id: "cl-8", category: "Machine", parameter: "Hydraulic flow within spec range", checked: false, notes: "" },
  { id: "cl-9", category: "Machine", parameter: "Impact energy sufficient for UCS", checked: false, notes: "" },
  { id: "cl-10", category: "Machine", parameter: "Tool diameter appropriate for rock type", checked: false, notes: "" },
  { id: "cl-11", category: "Machine", parameter: "Efficiency factor calibrated", checked: false, notes: "" },
  { id: "cl-12", category: "Machine", parameter: "Hydraulic pressure within operating range", checked: false, notes: "" },
  { id: "cl-13", category: "Performance", parameter: "Shift time data recorded accurately", checked: false, notes: "" },
  { id: "cl-14", category: "Performance", parameter: "Idle time causes documented", checked: false, notes: "" },
  { id: "cl-15", category: "Performance", parameter: "Breakdown time root causes identified", checked: false, notes: "" },
  { id: "cl-16", category: "Performance", parameter: "Production rate validated with survey data", checked: false, notes: "" },
  { id: "cl-17", category: "Performance", parameter: "Fuel consumption measurement calibrated", checked: false, notes: "" },
  { id: "cl-18", category: "Performance", parameter: "Weekly data covers minimum 2 weeks", checked: false, notes: "" },
  { id: "cl-19", category: "Safety", parameter: "Operator training records verified", checked: false, notes: "" },
  { id: "cl-20", category: "Safety", parameter: "Equipment inspection completed", checked: false, notes: "" },
];

const MiningDataContext = createContext<MiningDataContextType | undefined>(undefined);

const loadFromStorage = <T,>(key: string, fallback: T): T => {
  if (typeof window === "undefined") return fallback;

  try {
    const stored = window.localStorage.getItem(key);
    return stored ? JSON.parse(stored) : fallback;
  } catch {
    return fallback;
  }
};

const usePersistentState = <T,>(key: string, fallback: T) => {
  const [value, setValue] = useState<T>(() => loadFromStorage(key, fallback));

  const setPersistentValue: React.Dispatch<React.SetStateAction<T>> = React.useCallback((nextValue) => {
    setValue((previousValue) => {
      const resolvedValue =
        typeof nextValue === "function"
          ? (nextValue as (prevState: T) => T)(previousValue)
          : nextValue;

      if (typeof window !== "undefined") {
        try {
          window.localStorage.setItem(key, JSON.stringify(resolvedValue));
        } catch {
          // Ignore storage failures and keep app state usable.
        }
      }

      return resolvedValue;
    });
  }, [key]);

  return [value, setPersistentValue] as const;
};

// No default machines - only return user-added machines
const mergeMachinesWithDefaults = (storedMachines: MachineSpec[]) => {
  return storedMachines;
};

export const MiningDataProvider = ({ children }: { children: ReactNode }) => {
  const [geological, setGeological] = usePersistentState<GeologicalInput>("rb_geological", defaultGeological);
  const [storedMachines, setStoredMachines] = usePersistentState<MachineSpec[]>("rb_machines", defaultMachines);
  const [performance, setPerformance] = usePersistentState<PerformanceEntry[]>("rb_performance", defaultPerformance);
  const [checklist, setChecklist] = usePersistentState<ChecklistItem[]>("rb_checklist", defaultChecklist);

  const machines = useMemo(() => mergeMachinesWithDefaults(storedMachines), [storedMachines]);

  return (
    <MiningDataContext.Provider value={{ geological, setGeological, machines, setMachines: setStoredMachines, performance, setPerformance, checklist, setChecklist }}>
      {children}
    </MiningDataContext.Provider>
  );
};

export const useMiningData = () => {
  const ctx = useContext(MiningDataContext);
  if (!ctx) throw new Error("useMiningData must be inside MiningDataProvider");
  return ctx;
};
