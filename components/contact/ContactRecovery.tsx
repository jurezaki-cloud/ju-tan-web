"use client";
import { useState } from "react";
import { CONTACT_PENDING_KEY, recoverContactRequest, type ContactAttempt } from "@/lib/contact-client";

export default function ContactRecovery({ attempt }: { attempt: { current: ContactAttempt } }) {
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [accepted, setAccepted] = useState(false);
  return <div className="space-y-2 text-sm" aria-live="polite">
    <button type="button" className="underline" disabled={busy || accepted} onClick={async () => {
      setBusy(true);
      try {
        const state = await recoverContactRequest();
        if (state === "accepted") {
          setAccepted(true);
          setMessage("Prejšnje povpraševanje je sprejeto. Ne pošiljajte ga ponovno.");
        } else if (state === "cancelled" || state === "none") {
          attempt.current = {};
          setMessage("Prejšnji poskus ni bil poslan. Če želite, ponovno pritisnite Pošlji povpraševanje.");
        } else setMessage("Izid oddaje še ni potrjen. Ne pošiljajte je znova; za preverjanje pišite na info@ju-tan.com.");
      } catch { setMessage("Stanje trenutno ni dosegljivo. Vaše povpraševanje ni ponovno poslano. Pišite na info@ju-tan.com."); }
      finally { setBusy(false); }
    }}>{busy ? "Preverjam ..." : "Preveri stanje prejšnje oddaje"}</button>
    {message ? <p>{message}</p> : null}
    {accepted ? <button type="button" className="underline" onClick={() => {
      // Explicit NEW intent only, never an automatic ambiguous resend.
      try { window.localStorage.removeItem(CONTACT_PENDING_KEY); }
      catch { setMessage("Shramba ni dosegljiva. Za novo povpraševanje pišite na info@ju-tan.com."); return; }
      attempt.current = {};
      setAccepted(false);
      setMessage("Za drug projekt preverite in spremenite vsebino ter izrecno pritisnite Pošlji povpraševanje.");
    }}>Začni drugo povpraševanje</button> : null}
  </div>;
}
