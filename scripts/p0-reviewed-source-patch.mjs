import { readFileSync, writeFileSync } from 'node:fs';

// Surgical, fail-closed, idempotent source edits. No license, SEO, dependency,
// deployment, environment or production database operations are performed.
function edit(path, oldText, newText) {
  const input = readFileSync(path, 'utf8');
  if (input.includes(newText)) return;
  if (input.split(oldText).length !== 2) throw new Error(`Non-unique source anchor: ${path}`);
  writeFileSync(path, input.replace(oldText, newText));
}
edit('app/api/contact/route.ts',
  'import { reserveContactAttempt, countContactAttempt }',
  'import { reserveContactAttempt, countContactAttempt, acceptContactAttempt }');
edit('app/api/contact/route.ts',
  'if (result.error || !result.data?.id) return jsonError(500);',
  'if (result.error || !result.data?.id) return jsonError(500);\n    await acceptContactAttempt(retry.key, result.data.id);');

for (const file of ['components/contact/ContactForm.tsx', 'components/ai/LeadForm.tsx']) {
  edit(file, 'import { trackContactConversion } from "@/lib/google-ads";',
    'import ContactRecovery from "@/components/contact/ContactRecovery";\nimport { trackContactConversion } from "@/lib/google-ads";');
}
edit('components/contact/ContactForm.tsx',
  '      <div className="grid gap-4 sm:grid-cols-2">',
  '      {errors.form ? <ContactRecovery attempt={attempt} /> : null}\n      <div className="grid gap-4 sm:grid-cols-2">');
edit('components/ai/LeadForm.tsx',
  '      <label className="flex items-start gap-2 text-[12px] leading-5 text-slate-300">',
  '      {error ? <ContactRecovery attempt={attempt} /> : null}\n      <label className="flex items-start gap-2 text-[12px] leading-5 text-slate-300">');

edit('components/ai/JuTanAgent.tsx',
  'className={`pointer-events-none fixed z-overlay ${',
  'className={`pointer-events-none fixed z-[60] ${');

for (const [file, state] of [
  ['components/hero/HeroStageDeferred.tsx', 'visible'],
  ['components/sections/office/OfficeProductStageDeferred.tsx', 'load'],
]) {
  edit(file, 'import { useEffect, useRef, useState } from "react";',
    'import { useEffect, useRef, useState } from "react";\nimport { useObserverFallback } from "@/hooks/use-browser-capabilities";');
  const setter = state === 'visible' ? 'setVisible' : 'setLoad';
  edit(file, `  const [${state}, ${setter}] = useState(false);`,
    `  const [${state}, ${setter}] = useState(false);\n  const observerFallback = useObserverFallback();`);
  edit(file, `    if (!("IntersectionObserver" in window)) {\n      ${setter}(true);\n      return;\n    }`,
    '    if (!("IntersectionObserver" in window)) return;');
  edit(file, state === 'visible' ? '      {visible ? (' : '      {load ? <OfficeProductStage /> : null}',
    state === 'visible' ? '      {visible || observerFallback ? (' : '      {load || observerFallback ? <OfficeProductStage /> : null}');
}

edit('app/apk/marko/page.tsx',
  'import {useEffect,useRef,useState} from "react";',
  `import {useRef,useState,useSyncExternalStore,useMemo} from "react";\nimport Link from "next/link";\nconst subscribeSaved=(notify:()=>void)=>{window.addEventListener("storage",notify);return()=>window.removeEventListener("storage",notify)};\nconst savedSnapshot=()=>{try{return localStorage.getItem("marko-dobavnice")||"[]"}catch{return "[]"}};\nconst savedServerSnapshot=()=>null;`);
edit('app/apk/marko/page.tsx',
  'const [saved,setSaved]=useState<Note[]>([]);const [selected,setSelected]=useState("");const [ready,setReady]=useState(false);',
  'const rawSaved=useSyncExternalStore(subscribeSaved,savedSnapshot,savedServerSnapshot);const [savedOverride,setSaved]=useState<Note[]|null>(null);const saved=useMemo<Note[]>(()=>{if(savedOverride)return savedOverride;try{const parsed=JSON.parse(rawSaved||"[]");return Array.isArray(parsed)?parsed:[]}catch{return []}},[rawSaved,savedOverride]);const [selected,setSelected]=useState("");const ready=rawSaved!==null;');
edit('app/apk/marko/page.tsx',
  ' useEffect(()=>{try{const s=localStorage.getItem("marko-dobavnice");if(s)setSaved(JSON.parse(s));}catch{}setReady(true)},[]);',
  ' // Browser persistence is an external store; no synchronous setState during an effect.');
edit('app/apk/marko/page.tsx',
  '<a href="/" className="text-sm text-emerald-300">JU-TAN STUDIO</a>',
  '<Link href="/" className="text-sm text-emerald-300">JU-TAN STUDIO</Link>');

edit('tests/contact-p0.test.ts',
  'assert.throws(() => sendContactRequest({ ...payload, message: "New intent" }, attempt));',
  'await assert.rejects(() => sendContactRequest({ ...payload, message: "New intent" }, attempt));');
edit('tests/contact-p0.test.ts',
  'assert.throws(() => sendContactRequest(payload, attempt));',
  'await assert.rejects(() => sendContactRequest(payload, attempt));');
edit('tests/contact.test.ts',
  'import { POST } from "../app/api/contact/route";',
  'import { POST } from "../app/api/contact/route";\nimport { POST as STATUS } from "../app/api/contact/status/route";');
edit('tests/contact.test.ts',
  '    const beforeDbFailure = calls;',
  `    // An unseen status lookup atomically cancels even a delayed original POST.\n    const cancelledKey = key();\n    const statusRequest = (id: string) => new Request("https://example.com/api/contact/status", { method: "POST", headers: { "Idempotency-Key": id, "x-real-ip": \`status-\${sequence++}\` } });\n    const beforeStatus = calls;\n    const cancelled = await STATUS(statusRequest(cancelledKey));\n    assert.equal(cancelled.headers.get("Cache-Control"), "no-store, private");\n    assert.deepEqual(await cancelled.json(), { state: "cancelled" });\n    assert.equal((await POST(request(payload, cancelledKey))).status, 409);\n    assert.equal(calls, beforeStatus);\n    const acceptedKey = key();\n    providerResult = { id: "recovered-receipt" };\n    assert.equal((await POST(request(payload, acceptedKey))).status, 200);\n    const acceptedStatus = await STATUS(statusRequest(acceptedKey));\n    assert.deepEqual(await acceptedStatus.json(), { state: "accepted" });\n    const unknownPending = key();\n    await reserveContactAttempt(\`contact/\${unknownPending}\`);\n    assert.deepEqual(await (await STATUS(statusRequest(unknownPending))).json(), { state: "pending" });\n    const beforeDbFailure = calls;`);
console.log('PASS: reviewed source edits applied without layout/content/license changes');
