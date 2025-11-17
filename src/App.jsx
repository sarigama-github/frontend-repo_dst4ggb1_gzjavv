import { useState } from "react";
import UploadSection from "./components/UploadSection";
import ConsentSection from "./components/ConsentSection";
import GenerateSection from "./components/GenerateSection";

function App() {
  const [voiceId, setVoiceId] = useState("");
  const [ready, setReady] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="absolute inset-0 pointer-events-none bg-[radial-gradient(600px_200px_at_50%_0%,rgba(99,102,241,0.15),transparent)]" />

      <header className="relative z-10 max-w-5xl mx-auto px-6 pt-12 text-center">
        <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Aapka AI Voice Studio</h1>
        <p className="text-slate-300 mt-3">Voice Clone & Unlimited TTS</p>
      </header>

      <main className="relative z-10 max-w-5xl mx-auto px-6 py-10 space-y-6">
        <UploadSection onReady={({voiceId})=>{ setVoiceId(voiceId); }} />
        {voiceId && <ConsentSection voiceId={voiceId} onConsent={()=>setReady(true)} />}
        <GenerateSection voiceId={ready ? voiceId : ""} />
      </main>

      <footer className="relative z-10 max-w-5xl mx-auto px-6 pb-10 text-center text-slate-400 text-sm">
        Sirf consent ke saath: kisi doosre ki awaaz use karne ke liye explicit written + recorded permission zaroori hai.
      </footer>
    </div>
  )
}

export default App
