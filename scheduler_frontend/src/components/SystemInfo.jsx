import React, { useState } from "react";

export default function SystemInfo() {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  const fetchInfo = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/sysinfo");
      const data = await res.json();
      setInfo(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full p-6 bg-black/40 rounded-xl border border-green-500/30 shadow-[0_0_20px_rgba(0,255,0,0.15)] mt-6">

      <h2 className="text-xl font-mono text-green-300 mb-3">⚙ System Stats</h2>

      {!info && !loading && (
        <p className="text-green-400 font-mono">Press <b>Load Stats</b> to begin...</p>
      )}

      {loading && (
        <p className="text-green-400 font-mono">Fetching system stats...</p>
      )}

      {info && (
        <div className="text-green-300 font-mono space-y-2">
          <div>🔥 CPU Load: <span className="text-green-400">{info.cpu}%</span></div>

          <div>
            💾 RAM: 
            <span className="text-green-400"> {info.memory.used}GB</span> / 
            <span className="text-green-400"> {info.memory.total}GB</span>
          </div>

          <div>
            📂 Disk: 
            <span className="text-green-400"> {info.disk.used}GB</span> /
            <span className="text-green-400"> {info.disk.total}GB</span>
          </div>

        
        </div>
      )}

      <button
        onClick={fetchInfo}
        className="mt-4 px-5 py-2 rounded-lg font-semibold text-sm 
        bg-green-600/20 border border-green-400/40 text-green-300
        shadow-[0_0_10px_rgba(0,255,0,0.25)]
        hover:bg-green-600/30 hover:border-green-400 transition-all"
      >
        ⚡ Load Stats
      </button>
    </div>
  );
}
