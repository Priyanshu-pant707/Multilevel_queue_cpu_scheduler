import React, { useEffect, useState } from "react";

export default function ProcessQueue() {
  const [processes, setProcesses] = useState([]);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("http://localhost:5000/processes");
        const data = await res.json();
        setProcesses(data);
      } catch (err) {
        console.error(err);
      }
    };
    load();
    const interval = setInterval(load, 3000);
    return () => clearInterval(interval);
  }, []);

  // Better MLQ Classification Rules
  const classify = (p) => {
    const name = p.name.toLowerCase();

    // ---- SYSTEM QUEUE ----
    if (
      p.pcpu > 20 ||
      name.includes("system") ||
      name.includes("svchost") ||
      name.includes("service") ||
      name.includes("kernel") ||
      name.includes("init")
    ) {
      return "system";
    }

    // ---- INTERACTIVE QUEUE ----
    if (
      (p.pcpu >= 5 && p.pcpu <= 20) ||
      p.pmem > 5 ||
      name.includes("chrome") ||
      name.includes("edge") ||
      name.includes("code") ||
      name.includes("vscode") ||
      name.includes("explorer") ||
      name.includes("discord")
    ) {
      return "interactive";
    }

    // ---- BATCH QUEUE ----
    return "batch";
  };

  const system = processes.filter((p) => classify(p) === "system");
  const interactive = processes.filter((p) => classify(p) === "interactive");
  const batch = processes.filter((p) => classify(p) === "batch");

  const renderList = (list) =>
    list.length > 0 ? (
      list.map((p) => (
        <div
          key={p.pid}
          className="text-green-400/90 text-sm font-mono border-b border-green-600/20 py-1"
        >
          <strong>{p.name}</strong>  
          <br />
          PID: {p.pid} | CPU: {p.pcpu}% | MEM: {p.pmem}%
        </div>
      ))
    ) : (
      <div className="text-green-700/50 text-sm">No processes...</div>
    );

  return (
    <div className="grid grid-cols-3 gap-6 mt-10">

      {/* SYSTEM QUEUE */}
      <div className="p-4 rounded-xl bg-black/40 border border-green-600/40 shadow-[0_0_20px_rgba(0,255,150,0.2)]">
        <h3 className="text-center text-xl mb-3 text-green-300">🚀 System Queue</h3>
        <div className="h-48 overflow-auto pr-2">{renderList(system)}</div>
      </div>

      {/* INTERACTIVE QUEUE */}
      <div className="p-4 rounded-xl bg-black/40 border border-green-600/40 shadow-[0_0_20px_rgba(0,255,150,0.2)]">
        <h3 className="text-center text-xl mb-3 text-green-300">🧩 Interactive Queue</h3>
        <div className="h-48 overflow-auto pr-2">{renderList(interactive)}</div>
      </div>

      {/* BATCH QUEUE */}
      <div className="p-4 rounded-xl bg-black/40 border border-green-600/40 shadow-[0_0_20px_rgba(0,255,150,0.2)]">
        <h3 className="text-center text-xl mb-3 text-green-300">📦 Batch Queue</h3>
        <div className="h-48 overflow-auto pr-2">{renderList(batch)}</div>
      </div>

    </div>
  );
}
