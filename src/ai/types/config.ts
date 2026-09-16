export type ProviderConfig = {
  id: string;
  model: string;
  baseUrl?: string;
  apiKeyRef?: string;
};

export type ModelConfig = {
  id: string;
  providerId: string;
  maxTokens?: number;
  temperature?: number;
};

export type WorkflowConfig = {
  defaultWorkflowId?: string;
};

export type AiEngineConfig = {
  provider: ProviderConfig;
  model: ModelConfig;
  workflow?: WorkflowConfig;
};
