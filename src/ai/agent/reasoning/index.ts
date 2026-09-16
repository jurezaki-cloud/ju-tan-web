import type { ReasoningTrace } from "../types";

export class ReasoningEngine {
  explain(stepTitle: string, skillName: string): ReasoningTrace {
    return {
      reason: `Korak »${stepTitle}« je potreben za spretnost ${skillName}.`,
      confidence: 0.72,
      alternatives: ["Ročni vnos", "Drugo orodje iz registra"],
      risks: ["Podatki so mock", "Zunanji klic ni priklopljen"],
      estimatedTime: "3–8 min",
      dependencies: ["kontekst stranke", "dovoljenje AI"],
    };
  }
}
