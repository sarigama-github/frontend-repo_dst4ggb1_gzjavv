import { useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

export default function UploadSection({ onReady }) {
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sampleUrl, setSampleUrl] = useState("");

  const handleUpload = async (e) => {
    e.preventDefault();
    setError("");
    if (!file) return setError("Please select a 30–60s audio sample.");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("user_name", userName);
      fd.append("user_email", email);
      fd.append("file", file);

      const res = await fetch(`${BACKEND}/voices/sample-upload`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Upload failed");
      setSampleUrl(BACKEND + data.sample_url);
      onReady && onReady({ voiceId: data.voice_id, sampleUrl: data.sample_url });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold text-lg mb-2">1) Apni awaaz clone karna</h3>
      <p className="text-slate-300 text-sm mb-4">30–60 seconds ka clear sample upload karein. Quiet room, one continuous reading.</p>

      <form onSubmit={handleUpload} className="space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Your Name" value={userName} onChange={(e)=>setUserName(e.target.value)} required />
          <input className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Email" type="email" value={email} onChange={(e)=>setEmail(e.target.value)} required />
        </div>
        <input type="file" accept="audio/*" onChange={(e)=>setFile(e.target.files?.[0]||null)} className="text-slate-200" />
        <button disabled={loading} className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white rounded">{loading? 'Uploading…':'Upload Sample'}</button>
      </form>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      {sampleUrl && (
        <audio controls src={sampleUrl} className="mt-3 w-full" />
      )}
    </div>
  );
}
