import { err, ok, type Result } from "@/src/types/platform";
import { defaultPasswordPolicy, type PasswordPolicy } from "@/src/types/identity";

export class PasswordPolicyService {
  constructor(private readonly policy: PasswordPolicy = defaultPasswordPolicy) {}

  validate(password: string, confirm?: string): Result<true> {
    if (!password || password.length < this.policy.minLength) {
      return err(`Geslo mora imeti vsaj ${this.policy.minLength} znakov.`);
    }
    if (this.policy.requireUppercase && !/[A-Z]/.test(password)) {
      return err("Geslo potrebuje veliko črko.");
    }
    if (this.policy.requireLowercase && !/[a-z]/.test(password)) {
      return err("Geslo potrebuje malo črko.");
    }
    if (this.policy.requireDigit && !/\d/.test(password)) {
      return err("Geslo potrebuje številko.");
    }
    if (confirm !== undefined && password !== confirm) {
      return err("Gesli se ne ujemata.");
    }
    return ok(true);
  }

  strength(password: string): "weak" | "medium" | "strong" {
    let score = 0;
    if (password.length >= this.policy.minLength) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    if (score <= 1) return "weak";
    if (score === 2) return "medium";
    return "strong";
  }
}

export const passwordPolicyService = new PasswordPolicyService();
