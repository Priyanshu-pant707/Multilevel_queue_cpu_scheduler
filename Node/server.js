const si = require("systeminformation");
const express = require("express");
const cors = require("cors");
const os = require("os-utils");

const app = express();
app.use(cors());

app.get("/processes", async (req, res) => {
  try {
    const data = await si.processes();
    const list = data.list.map((p) => ({
      pid: p.pid,
      name: p.name,
      pcpu: p.cpu,
      pmem: p.mem,
    }));
    res.json(list);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


let NET_INT = null;

async function detectInterface() {
  const interfaces = await si.networkInterfaces();
  const active = interfaces.find(i => i.operstate === "up");
  NET_INT = active ? active.iface : interfaces[0]?.iface;
}
detectInterface();

let CPU_LOAD = 0;
setInterval(() => {
  os.cpuUsage(v => {
    CPU_LOAD = (v * 100).toFixed(2);
  });
}, 1000);

// ----------------------
// Network stats (cached)
// ----------------------
let NET_STATS = { rx: 0, tx: 0 };
setInterval(async () => {
  if (!NET_INT) return;
  const stats = await si.networkStats(NET_INT);
  NET_STATS = {
    rx: Math.round((stats[0].rx_sec || 0) / 1024),
    tx: Math.round((stats[0].tx_sec || 0) / 1024),
  };
}, 1000);

// ----------------------
// Sysinfo Route
// ----------------------
app.get("/sysinfo", async (req, res) => {
  try {
    const mem = await si.mem();
    const disks = await si.fsSize();
    const disk = disks.find(d => d.mount === "C:" || d.mount === "/") || disks[0];

    res.json({
      cpu: CPU_LOAD,

      memory: {
        total: (mem.total / 1024 ** 3).toFixed(2),
        used: (mem.active / 1024 ** 3).toFixed(2),
        free: (mem.available / 1024 ** 3).toFixed(2),
      },

      disk: {
        total: (disk.size / 1024 ** 3).toFixed(2),
        used: (disk.used / 1024 ** 3).toFixed(2),
      },

      network: {
        download: NET_STATS.rx,
        upload: NET_STATS.tx,
        iface: NET_INT
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Process server running on 5000"));
