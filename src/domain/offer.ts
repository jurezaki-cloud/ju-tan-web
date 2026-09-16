export interface Offer {
  id: string;
  clientId: string;
  clientName: string;
  title: string;
  amount: string;
  status: "Osnutek" | "Poslano" | "Sprejeto";
  updated: string;
}
