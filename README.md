# 🌐 Multi-Level Queue (MLQ) Process Scheduler Visualization
- works on your real time system processes.

## Setup and Run the Project
Follow these steps to get the project running on your local machine.

1. Backend Setup (scheduler_backend)
Navigate to the backend directory:
```
cd scheduler_backend
```

- Create and activate a virtual environment (optional but recommended):
```
python -m venv venv
source venv/bin/activate  # On Linux/macOS
.\venv\Scripts\activate   # On Windows
```

```
pip install  fastapi uvicorn
```

2. Frontend Setup (scheduler_frontend)

Navigate to the frontend directory:
```
cd ../scheduler_frontend
```


Install Node dependencies:
```
npm install
```

3. Running the Application
This project requires three separate processes to run simultaneously: the Python Backend, the Node.js Server, and the React Frontend.
Start the Python MLQ Scheduler (Backend):
# From scheduler_backend directory
```
python main.py
```

Start the Node.js API Server:
# From the root (Node/) directory
```
node server.js
```


Start the React Visualization (Frontend):
# From scheduler_frontend directory
```
npm run dev
```

## How it Works: MLQ Scheduling
- The Multi-Level Queue (MLQ) scheduling algorithm partitions the ready queue into several separate queues, each with its own scheduling algorithm. Processes are permanently assigned to a queue based on their properties (e.g., I/O bound, CPU bound, interactive, batch).

- Key Principles in this Implementation:
  -Queue Partitioning: Processes are classified by classify_processes.py and placed into queues (e.g.,   High Priority (Interactive), Medium Priority (System), Low Priority (Batch)).
  -Inter-Queue Scheduling: A fixed-priority preemptive scheduling is used between the queues. For example, processes in the High Priority queue are always executed before those in the Medium Priority queue.
  - Intra-Queue Scheduling: Each queue runs a specific algorithm:
      High Priority: Typically uses Round Robin (RR) or Priority based scheduling with ageing for fast response time.
      Low Priority: Typically uses First-Come, First-Served (FCFS) or Shortest-Job-First (SJF).
- No Process Movement between the queue, it is possible in the MLFQ(multilevel feedback queue ) cpu scheduling.



- Future Enhancements:
  - Algorithm Switching: Implement support for switching between queues in real time as mlfq.
  - Performance Metrics: Calculate and display key metrics like Turnaround Time, Waiting Time, and CPU Utilization.
  - User Configuration: Allow users to dynamically change queue sizes, time slice (for RR queues), and process generation parameters.
