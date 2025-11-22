

import threading
import time
import psutil
from classify_processes import classify_processes
from get_100_process import get_100_process


priority_ranking = {
    psutil.IDLE_PRIORITY_CLASS: 1,
    psutil.BELOW_NORMAL_PRIORITY_CLASS: 2,
    psutil.NORMAL_PRIORITY_CLASS: 3,
    psutil.ABOVE_NORMAL_PRIORITY_CLASS: 4,
    psutil.HIGH_PRIORITY_CLASS: 5,
    psutil.REALTIME_PRIORITY_CLASS: 6
}

cpu_lock = threading.Lock()      # CPU MUTEX- taki ek hi process ko cpu mile
stop_event = threading.Event()   # SAFE STOP FLAG  taki jb bhi hum frontend mai start stop dbaye toh using flag hum mlq scheuler ko roke sake.
system_done = threading.Event()   # SIGNAL system completed , interactive queeu ko signal krne ke liye taki, jb system process puri trh se execute hojaye to humari intractive process chl ske
interactive_done = threading.Event()       # SIGNAL interactive completed same for the batch process hum signal kr dege  jaise sari interactive process khtm hojayegi to fir uske bad sari batch process chlne lg jayegi.

_emitter = None


def set_emitter(fn):
    global _emitter
    _emitter = fn

def emit(msg: str):
    if _emitter:
        try:
            _emitter(msg)
        except:
            pass
    else:
        print(msg)

# setting up the stop flag control 
def set_stop_flag(value: bool):
    """Thread-safe stop control."""
    if value:
        stop_event.set()
    else:
        stop_event.clear()


# isko hum thread ki trh use kr rhe h , parameter mai hum system_queue and the result araay bej rhe h
def system_thread(system_q, result):
    emit("\n--- SYSTEM QUEUE STARTED\n")

    # Highest priority first
    system_q.sort(key=lambda p: priority_ranking.get(p.get("nice", 0), 0), reverse=True)

    for p in system_q:
        if stop_event.is_set():
            emit("\n-- SYSTEM STOPPED\n")
            break

        with cpu_lock:
            pid = p["pid"]
            name = p["name"]
            prio = priority_ranking.get(p.get("nice", 0), 0)

            emit(f"[SYSTEM] PID={pid}, Name={name}, Priority={prio}")
            time.sleep(0.2)
            result.append({"pid": pid, "name": name, "priority": prio})

    emit("\n--- SYSTEM QUEUE COMPLETED\n")
    system_done.set()     # Allow interactive to start,  hum interactive ko signal dedenge ki  ab tu chalu hoja.


# same for the interactive processes
def interactive_thread(interactive_q, result, time_quantum=0.2):
  
    system_done.wait()  # BLOCK until SYSTEM COMPLETES,,, ye ensure kr rha h ki system process jb tk complete n ho to block hojaye. jb system process khtm hojayegi toh fir interactive run ho.

    emit("\n-- INTERACTIVE QUEUE STARTED\n")
    queue = interactive_q.copy()

    while queue and not stop_event.is_set():
        with cpu_lock:
            p = queue.pop(0)
            pid = p["pid"]
            name = p["name"]

            emit(f"[INTERACTIVE] PID={pid}, Running for {time_quantum}s")
            time.sleep(time_quantum)

        if psutil.pid_exists(pid):
            queue.append(p)
        else:
            result.append({"pid": pid, "name": name})

    emit("\n--- INTERACTIVE QUEUE COMPLETED\n")
    interactive_done.set()  # Allow BATCH to start



def batch_thread(batch_q, result):
  
    interactive_done.wait()   # BLOCK until INTERACTIVE completes

    emit("\n--- BATCH QUEUE STARTED\n")

    for p in batch_q:
        if stop_event.is_set():
            emit("\n--- BATCH STOPPED\n")
            break

        with cpu_lock:
            pid = p["pid"]
            name = p["name"]

            emit(f"[BATCH] PID={pid}, Name={name} (FCFS)")
            time.sleep(0.2)
            result.append({"pid": pid, "name": name})

    emit("\n✔ BATCH QUEUE COMPLETED\n")



def mlq_scheduler():
    stop_event.clear()

    emit("\n========== MULTILEVEL QUEUE SCHEDULER ==========\n")

    process_list = get_100_process()
    system_q, interactive_q, batch_q = classify_processes(process_list)

  #  emit(f"System={len(system_q)} | Interactive={len(interactive_q)} | Batch={len(batch_q)}\n")
    system_result = []
    interactive_result = []
    batch_result = []

    # -------- CORE MLQ SCHEDULER LOOP --------
    while not stop_event.is_set() and (system_q or interactive_q or batch_q):

        # ALWAYS check system queue first
        if system_q:
            p = system_q.pop(0)
            with cpu_lock:
                pid = p["pid"]
                name = p["name"]
                prio = priority_ranking.get(p.get("nice", 0), 0)

                emit(f"[SYSTEM] PID={pid}, Name={name}, Priority={prio}")
                time.sleep(0.2)
                system_result.append({"pid": pid, "name": name, "priority": prio})
            continue

        # RUN INTERACTIVE QUEUE (Round Robin)
        if interactive_q:
            p = interactive_q.pop(0)
            with cpu_lock:
                pid = p["pid"]
                name = p["name"]

                emit(f"[INTERACTIVE] PID={pid}, Running 0.2s")
                time.sleep(0.2)

            # If still alive → requeue
            if psutil.pid_exists(pid):
                interactive_q.append(p)
            else:
                interactive_result.append({"pid": pid, "name": name})
            continue

        # RUN BATCH QUEUE (FCFS)
        if batch_q:
            p = batch_q.pop(0)
            with cpu_lock:
                pid = p["pid"]
                name = p["name"]

                emit(f"[BATCH] PID={pid}, Name={name} (FCFS)")
                time.sleep(0.2)
                batch_result.append({"pid": pid, "name": name})
            continue

    emit("\n-- MLQ SCHEDULING COMPLETED.\n")

    # Print final output
    emit("\----SYSTEM QUEUE OUTPUT ----")
    for p in system_result:
        emit(str(p))

    emit("\n--- INTERACTIVE QUEUE OUTPUT---")
    for p in interactive_result:
        emit(str(p))

    emit("\n---- BATCH QUEUE OUTPUT ---")
    for p in batch_result:
        emit(str(p))

    return system_result, interactive_result, batch_result




if __name__ == "__main__":
    mlq_scheduler()
