import { useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

export default function ConsentSection({ voiceId, onConsent }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [agree, setAgree] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    if (!agree) return setError("Please confirm consent to proceed.");
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/voices/consent`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          voice_id: voiceId,
          attested_by: name,
          attested_email: email,
          attestation_text: "I confirm this is my voice and I authorize cloning for my use.",
          granted: true,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Consent failed");
      onConsent && onConsent(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold text-lg mb-2">2) Consent</h3>
      <p className="text-slate-300 text-sm mb-4">Aap confirm karte hain ke yeh aapki awaaz hai aur aap cloning ke liye ijazat dete/ deti hain.</p>
      <form onSubmit={submit} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Full Name" value={name} onChange={(e)=>setName(e.target.value)} required />
          <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <label className="flex items-center gap-2 text-slate-200 text-sm">
          <input type="checkbox" checked={agree} onChange={(e)=>setAgree(e.target.checked)} />
          I confirm I own the right to this voice and provide written consent.
        </label>
        <button disabled={loading || !agree} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded">{loading? 'Submitting…':'Grant Consent'}</button>
      </form>
      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
    </div>
  );
}
