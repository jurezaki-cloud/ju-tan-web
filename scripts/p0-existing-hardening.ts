import { assertIdentityLoginHardening } from "../src/identity/login.hardening.test";
import { assertProxyIpHardening } from "../src/security/network/proxy.hardening.test";

async function main() {
  assertProxyIpHardening();
  await assertIdentityLoginHardening();
  console.log("PASS: explicitly invoked existing proxy and identity hardening assertions (local fixtures only)");
}
void main().catch((error) => { console.error(error); process.exitCode = 1; });
