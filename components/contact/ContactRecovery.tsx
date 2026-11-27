"use client";
import { useState } from "react";
import { recoverContactRequest, type ContactAttempt } from "@/lib/contact-client";

/** Only rendered alongside a delivery error; no form contents are persisted. */
export default function ContactRecovery({ attempt }: { attempt: { current: ContactAttempt } }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  return <div className="space-y-2 text-sm" aria-live="polite">
    <button type="button" className="underline" disabled={busy} onClick={async () => {
      setBusy(true);
      try {
        const state = await recoverContactRequest();
        if (state === "accepted") {
          attempt.current = {};
          setMessage("Prejšnje povpraševanje je sprejeto. Ne pošiljajte ga ponovno. Za drug projekt lahko oddate novo povpraševanje.");
        } else if (state === "cancelled" || state === "none") {
          attempt.current = {};
          setMessage("Prejšnji poskus ni bil poslan. Če želite, ponovno pritisnite Pošlji povpraševanje.");
        } else setMessage("Izid oddaje še ni potrjen. Ne pošiljajte je znova; za preverjanje pišite na info@ju-tan.com.");
      } catch { setMessage("Stanje trenutno ni dosegljivo. Vaše povpraševanje ni ponovno poslano. Pišite na info@ju-tan.com."); }
      finally { setBusy(false); }
    }}>{busy ? "Preverjam ..." : "Preveri stanje prejšnje oddaje"}</button>
    {message ? <p>{message}</p> : null}
  </div>;
}
