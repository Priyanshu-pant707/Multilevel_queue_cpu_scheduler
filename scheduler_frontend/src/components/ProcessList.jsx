import React, { useRef, useState } from "react";

export default function ProcessList() {
  const [processes, setProcesses] = useState([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef(null);

  const fetchProcesses = async () => {
    try {
      setLoading(true);
      const res = await fetch("http://localhost:5000/processes");
      const data = await res.json();
      setProcesses(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
      if (containerRef.current) {
        setTimeout(() => {
          containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }, 100);
      }
    }
  };

  return (
    <div className="w-full h-full p-6 flex flex-col bg-[#0a0f0a]">

      {/* List Container */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-black/40 backdrop-blur-md border border-green-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(0,255,0,0.15)]"
      >
        {loading && (
          <div className="text-green-400 font-mono mb-2">
            Fetching process list...
          </div>
        )}

        {processes.length > 0 &&
          processes.map((p, i) => (
            <div
              key={i}
              className="text-green-400/90 font-mono text-sm whitespace-pre-wrap mb-1"
            >
              {`> PID: ${p.pid} | CPU: ${p.pcpu}% | MEM: ${p.pmem}% | Name: ${p.name}`}
            </div>
          ))}

        {processes.length === 0 && !loading && (
          <div className="text-green-500/70 font-mono">
            Press <span className="text-green-300">Load Processes</span> to begin...
          </div>
        )}
      </div>

      {/* Button */}
      <div className="mt-4 flex gap-4 justify-center">
        <button
          onClick={fetchProcesses}
          className="px-5 py-2 rounded-lg font-semibold text-sm 
                     bg-green-600/20 border border-green-400/40 text-green-300
                     shadow-[0_0_10px_rgba(0,255,0,0.25)]
                     hover:bg-green-600/30 hover:border-green-400 transition-all"
        >
          ⚡ Load Processes
        </button>
      </div>
    </div>
  );
}
