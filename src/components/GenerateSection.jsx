import { useEffect, useMemo, useState } from "react";

const BACKEND = import.meta.env.VITE_BACKEND_URL || "";

export default function GenerateSection({ voiceId }) {
  const [templates, setTemplates] = useState([]);
  const [text, setText] = useState("");
  const [mode, setMode] = useState("cloned");
  const [templateId, setTemplateId] = useState("");
  const [format, setFormat] = useState("wav");
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(()=>{
    fetch(`${BACKEND}/voices/templates`).then(r=>r.json()).then(setTemplates).catch(()=>{});
  },[]);

  const canGenerate = useMemo(()=>{
    if (mode === 'cloned') return !!voiceId && text.trim().length>0;
    return !!templateId && text.trim().length>0;
  },[mode, voiceId, templateId, text]);

  const generate = async () => {
    setError("");
    setLoading(true);
    setAudioUrl("");
    try {
      const res = await fetch(`${BACKEND}/tts/generate`, {
        method: "POST",
        headers: {"Content-Type":"application/json"},
        body: JSON.stringify({
          text,
          voice_mode: mode,
          voice_id: mode==='cloned' ? voiceId : null,
          template_id: mode==='template' ? templateId : null,
          requested_format: format,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.detail || "Generation failed");
      setAudioUrl(BACKEND + data.audio_url);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-slate-800/60 rounded-xl p-6 border border-slate-700">
      <h3 className="text-white font-semibold text-lg mb-2">3) Generate karna</h3>
      <p className="text-slate-300 text-sm mb-4">Text likhiye, cloned voice ya voice template select kijiye. Output format choose karein.</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
        <select value={mode} onChange={(e)=>setMode(e.target.value)} className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white">
          <option value="cloned">Cloned voice</option>
          <option value="template">Voice template</option>
        </select>
        {mode === 'template' ? (
          <select value={templateId} onChange={(e)=>setTemplateId(e.target.value)} className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white">
            <option value="">Select template</option>
            {templates.map(t=> <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
        ) : (
          <input disabled value={voiceId||''} className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" placeholder="Voice ID" />
        )}
        <select value={format} onChange={(e)=>setFormat(e.target.value)} className="bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white">
          <option value="wav">WAV</option>
          <option value="mp3">MP3</option>
          <option value="wav-192">WAV / 192kbps</option>
        </select>
      </div>

      <textarea rows={4} value={text} onChange={(e)=>setText(e.target.value)} placeholder="Yahan text likhiye..." className="w-full bg-slate-900/60 border border-slate-700 rounded px-3 py-2 text-white" />

      <div className="mt-3 flex items-center gap-3">
        <button disabled={!canGenerate || loading} onClick={generate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white rounded">{loading? 'Generating…' : 'Generate'}</button>
        <span className="text-slate-400 text-sm">Unlimited generation — plan ke mutabiq quality/latency.</span>
      </div>

      {error && <p className="text-red-400 text-sm mt-3">{error}</p>}
      {audioUrl && (
        <audio controls src={audioUrl} className="mt-4 w-full" />
      )}

      <p className="text-[11px] text-slate-400 mt-4">By using this service you agree to our Terms & confirm you have right to use any uploaded voice. AI-generated audio may carry a digital watermark/metadata for traceability.</p>
    </div>
  )
}
