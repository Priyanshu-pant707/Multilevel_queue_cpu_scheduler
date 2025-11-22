// // src/App.jsx
// import React from "react";
// import Terminal from "./components/Terminal";
// import ProcessList from "./components/ProcessList";
// import SystemInfo from "./components/SystemInfo";
// import './index.css'
// export default function App() {
//   return (
//     <div className="min-h-screen bg-black text-green-300 relative overflow-hidden font-mono">

//       {/* 💚 MATRIX BACKGROUND ANIMATION */}
//       <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-25">
//         <div className="animate-matrixFall absolute top-0 left-1/4 text-green-500 text-[8rem]">
//           0 1 0 1 0 1 0 1
//         </div>
//         <div className="animate-matrixFallSlow absolute top-20 left-2/3 text-green-500 text-[9rem]">
//           1 0 1 0 1 0 1 0
//         </div>
//       </div>

//       {/* MAIN CONTENT */}
//       <div className="relative z-10 p-10">

//         {/* 🔥 Title */}
//         <h1 className="text-6xl text-center mb-10 tracking-widest drop-shadow-[0_0_20px_#00ff99]">
//           ⚡ MLQ SCHEDULER DASHBOARD
//         </h1>

//         {/* GRID LAYOUT FIXED HEIGHT */}
//         <div className="grid grid-cols-3 gap-8">

//           {/* LEFT SIDE: Terminal (2/3) FIXED HEIGHT */}
//           <div className="col-span-2 h-[450px] rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/40 
//             shadow-[0_0_35px_rgba(0,255,150,0.25)] hover:border-green-400 transition-all duration-200 
//             hover:shadow-[0_0_45px_rgba(0,255,150,0.4)] overflow-hidden">
            
//             <div className="p-4 text-green-400 border-b border-green-700/30 uppercase tracking-wide text-lg">
//               ▶ Terminal Console
//             </div>
//             <div className="h-[380px] overflow-auto">
//               <Terminal />
//             </div>
//           </div>

//           {/* RIGHT SIDE: Process List FIXED HEIGHT */}
//           <div className="h-[450px] rounded-2xl bg-black/60 backdrop-blur-xl border border-green-500/40 
//             shadow-[0_0_35px_rgba(0,255,150,0.25)] hover:border-green-400 transition-all duration-200 
//             hover:shadow-[0_0_45px_rgba(0,255,150,0.4)] overflow-hidden">
            
//             <div className="p-4 text-green-400 border-b border-green-700/30 uppercase tracking-wide text-lg">
//               🧩 Processes
//             </div>
//             <div className="h-[380px] overflow-auto">
//               <ProcessList />
//             </div>
//           </div>

//         </div>

//         {/* MLQ ANIMATION PANEL */}
//         <div className="mt-10 h-[150px] rounded-2xl bg-black/40 border border-green-500/40 backdrop-blur-xl 
//           shadow-[0_0_25px_rgba(0,255,150,0.3)] p-6 flex items-center justify-center relative overflow-hidden">

        

//           <div className="relative z-10 text-center space-y-2">
//             <h2 className="text-2xl tracking-widest text-green-300">MLQ LEVELS</h2>

//             <div className="flex gap-6 justify-center mt-3">
//               <div className="px-6 py-2 bg-green-500/10 border border-green-400/40 rounded-lg animate-bounce-slow">
//                 Queue 1 — High Priority
//               </div>
//               <div className="px-6 py-2 bg-green-500/10 border border-green-400/40 rounded-lg animate-bounce-slower">
//                 Queue 2 — Medium
//               </div>
//               <div className="px-6 py-2 bg-green-500/10 border border-green-400/40 rounded-lg animate-bounce-slowest">
//                 Queue 3 — Low
//               </div>
//             </div>
//           </div>

//         </div>

//         {/* SYSTEM INFO PANEL FIXED HEIGHT */}
//         <div className="mt-10 h-[250px] rounded-2xl bg-black/50 backdrop-blur-xl border border-green-500/50 
//           shadow-[0_0_35px_rgba(0,255,150,0.3)] hover:border-green-400 transition-all duration-200 
//           hover:shadow-[0_0_45px_rgba(0,255,150,0.5)] p-6 overflow-auto">

//           <SystemInfo />
//         </div>

//       </div>

//       {/* Extra Glow Effect */}
//       <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-green-500/10 to-transparent pointer-events-none" />
//     </div>
//   );
// }











// src/App.jsx
import React from "react";
import Terminal from "./components/Terminal";
import ProcessList from "./components/ProcessList";
import SystemInfo from "./components/SystemInfo";
import ProcessQueue from "./components/ProcessQueue";
import './index.css';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-green-300 relative overflow-hidden font-mono">

      {/* 💚 MATRIX BACKGROUND ANIMATION */}
      <div className="absolute inset-0 pointer-events-none select-none overflow-hidden opacity-25">
        <div className="animate-matrixFall absolute top-0 left-1/4 text-green-500 text-[8rem]">
          0 1 0 1 0 1 0 1
        </div>
        <div className="animate-matrixFallSlow absolute top-20 left-2/3 text-green-500 text-[9rem]">
          1 0 1 0 1 0 1 0
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="relative z-10 p-10">

        {/* 🔥 Title */}
        <h1 className="text-6xl text-center mb-10 tracking-widest drop-shadow-[0_0_20px_#00ff99]">
           MLQ SCHEDULER DASHBOARD
        </h1>

        {/* GRID LAYOUT FIXED HEIGHT */}
        <div className="grid grid-cols-3 gap-8">

          {/* LEFT SIDE: Terminal */}
          <div className="col-span-2 h-[450px] rounded-2xl bg-black/60 backdrop-blur-xl 
            border border-green-500/40 shadow-[0_0_35px_rgba(0,255,150,0.25)]
            hover:border-green-400 transition-all duration-200 
            hover:shadow-[0_0_45px_rgba(0,255,150,0.4)] overflow-hidden">
            
            <div className="p-4 text-green-400 border-b border-green-700/30 uppercase tracking-wide text-lg">
              ▶ Terminal Console
            </div>

            <div className="h-[380px] overflow-auto">
              <Terminal />
            </div>
          </div>

          {/* RIGHT SIDE: Process List */}
          <div className="h-[450px] rounded-2xl bg-black/60 backdrop-blur-xl 
            border border-green-500/40 shadow-[0_0_35px_rgba(0,255,150,0.25)]
            hover:border-green-400 transition-all duration-200 
            hover:shadow-[0_0_45px_rgba(0,255,150,0.4)] overflow-hidden">
            
            <div className="p-4 text-green-400 border-b border-green-700/30 uppercase tracking-wide text-lg">
              🧩 Processes
            </div>

            <div className="h-[380px] overflow-auto">
              <ProcessList />
            </div>
          </div>
        </div>

        {/* MLQ ANIMATION PANEL */}
        <div className="mt-10 h-[150px] rounded-2xl bg-black/40 border border-green-500/40 
          backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,150,0.3)] p-6 flex items-center 
          justify-center relative overflow-hidden">

          <div className="relative z-10 text-center space-y-2">
            <h2 className="text-2xl tracking-widest text-green-300">MLQ LEVELS</h2>

            <div className="flex gap-6 justify-center mt-3">
              <div className="px-6 py-2 bg-green-500/10 border border-green-400/40 
                rounded-lg animate-bounce-slow">
                Queue 1 — High Priority
              </div>

              <div className="px-6 py-2 bg-green-500/10 border border-green-400/40 
                rounded-lg animate-bounce-slower">
                Queue 2 — Medium
              </div>

              <div className="px-6 py-2 bg-green-500/10 border border-green-400/40 
                rounded-lg animate-bounce-slowest">
                Queue 3 — Low
              </div>
            </div>
          </div>
        </div>

        {/* ⚡ MLQ PROCESS QUEUES PANEL (NEW) */}
        <div className="mt-10 rounded-2xl bg-black/40 border border-green-500/40 
          backdrop-blur-xl shadow-[0_0_25px_rgba(0,255,150,0.3)] p-6">
          <ProcessQueue />
        </div>

        {/* SYSTEM INFO PANEL */}
        <div className="mt-10 h-[250px] rounded-2xl bg-black/50 backdrop-blur-xl 
          border border-green-500/50 shadow-[0_0_35px_rgba(0,255,150,0.3)]
          hover:border-green-400 transition-all duration-200 
          hover:shadow-[0_0_45px_rgba(0,255,150,0.5)] p-6 overflow-auto">

          <SystemInfo />
        </div>
      </div>

      {/* Extra Glow Effect */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t 
        from-green-500/10 to-transparent pointer-events-none" />
    </div>
  );
}
