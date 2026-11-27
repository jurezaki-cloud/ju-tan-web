import { test } from "node:test";
import assert from "node:assert/strict";
import { contactCron } from "../lib/contact-cron";
const env = { CRON_SECRET: "c".repeat(40), CONTACT_WORKER_SECRET: "w".repeat(40), VERCEL_ENV: "production", CONTACT_DURABLE_INBOX: "1", CONTACT_HEARTBEAT_URL: "https://hc-ping.com/00000000-0000-4000-8000-000000000000" };
const request = () => new Request("https://ju-tan.com/api/cron/contact-worker", { headers: { Authorization: `Bearer ${env.CRON_SECRET}` } });
test("cron rejects unauthenticated, Preview, reused keys and arbitrary ping destinations before side effects", async () => {
  const never = async () => { assert.fail("must not call network or worker"); };
  assert.equal((await contactCron(new Request("https://ju-tan.com"), never, env, never)).status, 401);
  for (const patch of [{VERCEL_ENV:"preview"}, {CONTACT_DURABLE_INBOX:"0"}, {CONTACT_WORKER_SECRET:env.CRON_SECRET}, {CONTACT_HEARTBEAT_URL:"https://evil.test/uuid"}, {CONTACT_HEARTBEAT_URL:env.CONTACT_HEARTBEAT_URL+"?secret=1"}, {CONTACT_HEARTBEAT_URL:""}]) {
    assert.equal((await contactCron(request(), never, {...env,...patch}, never)).status,503);
  }
});
test("only a healthy complete drain sends success heartbeat; failures signal /fail without contact data", async () => {
  for (const outcome of ["healthy","unhealthy","throw","invalid"]) {
    let calls=0;
    const response = await contactCron(request(), async req => {
      assert.equal(req.method,"POST");
      assert.equal(req.headers.get("authorization"), `Bearer ${env.CONTACT_WORKER_SECRET}`);
      if(outcome==="throw") throw new Error("private");
      if(outcome==="invalid") return new Response("private");
      return Response.json({healthy:outcome==="healthy"});
    }, env, async (url, options) => {
      calls++;
      assert.equal(String(url),env.CONTACT_HEARTBEAT_URL+(outcome==="healthy"?"":"/fail"));
      assert.equal(options?.redirect,"error");
      assert.equal(options?.body,undefined);
      return new Response("OK");
    });
    assert.equal(calls,1);
    assert.equal(response.status,outcome==="healthy"?204:503);
    assert.equal(await response.text(),"");
  }
});
test("unreachable heartbeat cannot report cron success", async () => {
  for(const throws of [true,false]) {
    const response=await contactCron(request(),async()=>Response.json({healthy:true}),env,async()=>{
      if(throws)throw new Error("private");
      return new Response("private",{status:503});
    });
    assert.equal(response.status,503);
  }
});
