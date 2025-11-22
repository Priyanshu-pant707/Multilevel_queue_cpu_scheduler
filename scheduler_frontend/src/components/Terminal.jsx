import React, { useEffect, useRef, useState } from "react";

export default function Terminal() {
  const [logs, setLogs] = useState([]);
  const wsRef = useRef(null);
  const containerRef = useRef(null);

  const startWebSocket = () => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) return;

    const ws = new WebSocket("ws://localhost:8000/ws/scheduler");
    wsRef.current = ws;

    ws.onopen = () => {
      console.log("WS opened");
      ws.send("start");
    };

    ws.onmessage = (evt) => setLogs((prev) => [...prev, evt.data]);

    ws.onclose = () => {
      console.log("WS closed");
    };
  };

  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [logs]);

  return (
    <div className="w-full h-full p-6 flex flex-col bg-[#0a0f0a]">

      {/* Terminal box */}
      <div
        ref={containerRef}
        className="flex-1 overflow-auto bg-black/40 backdrop-blur-md border border-green-500/30 rounded-xl p-4 shadow-[0_0_20px_rgba(0,255,0,0.15)]"
      >
        {logs.map((line, i) => (
          <div
            key={i}
            className="text-green-400/90 font-mono text-sm leading-relaxed whitespace-pre-wrap"
          >
            {"> "}{line}
          </div>
        ))}

        {logs.length === 0 && (
          <div className="text-green-500/70 font-mono">
            Press <span className="text-green-300">Start Scheduler</span> to begin...
          </div>
        )}
      </div>

      {/* Buttons */}
      <div className="mt-4 flex gap-4 justify-center">
        <button
          onClick={startWebSocket}
          className="px-5 py-2 rounded-lg font-semibold text-sm 
                     bg-green-600/20 border border-green-400/40 text-green-300
                     shadow-[0_0_10px_rgba(0,255,0,0.25)]
                     hover:bg-green-600/30 hover:border-green-400 transition-all"
        >
          ▶ Start Scheduler
        </button>

      <button
  onClick={() => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send("stop");  // backend ko stop bol diya
    }
    setLogs([]);
  }}
  className="px-5 py-2 rounded-lg font-semibold text-sm 
             bg-red-600/20 border border-red-400/40 text-red-300
             shadow-[0_0_10px_rgba(255,0,0,0.25)]
             hover:bg-red-600/30 hover:border-red-400 transition-all"
>
  ✖ Clear / Stop
</button>

      </div>
    </div>
  );
}
