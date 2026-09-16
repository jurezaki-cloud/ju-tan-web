export interface Invoice {
  id: string;
  clientId: string;
  clientName: string;
  number: string;
  amount: string;
  status: "Osnutek" | "Izdano" | "Plačano";
  issued: string;
}
