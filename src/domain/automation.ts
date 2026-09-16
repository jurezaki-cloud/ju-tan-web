export interface Automation {
  id: string;
  name: string;
  status: "Aktivna" | "Osnutek";
  runs: number;
}
