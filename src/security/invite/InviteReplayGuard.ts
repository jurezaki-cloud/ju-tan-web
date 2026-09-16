import { hashToken } from "@/src/services/identity/shared";

export class InviteReplayGuard {
  used(status: string) {
    return status === "used" || status === "accepted" || status === "revoked";
  }

  tokenKey(token: string) {
    return hashToken(token);
  }
}

export const inviteReplayGuard = new InviteReplayGuard();
