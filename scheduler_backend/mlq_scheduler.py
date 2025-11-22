


# import threading
# import time
# import psutil
# from get_100_process import get_100_process
# from classify_processes import classify_processes

# # Priority ranking for system processes
# priority_ranking = {
#     psutil.IDLE_PRIORITY_CLASS: 1,
#     psutil.BELOW_NORMAL_PRIORITY_CLASS: 2,
#     psutil.NORMAL_PRIORITY_CLASS: 3,
#     psutil.ABOVE_NORMAL_PRIORITY_CLASS: 4,
#     psutil.HIGH_PRIORITY_CLASS: 5,
#     psutil.REALTIME_PRIORITY_CLASS: 6
# }


# # Global CPU Lock
# cpu_lock = threading.Lock()


# def run_system_queue(system_queue):
#     ans_system = []
#     system_queue.sort(key=lambda p: priority_ranking.get(p.get('nice', psutil.NORMAL_PRIORITY_CLASS), 0), reverse=True)

#     for p in system_queue:
#         with cpu_lock:
#             pid = p.get('pid')
#             name = p.get('name')
#             prio = priority_ranking.get(p.get('nice', psutil.NORMAL_PRIORITY_CLASS), 0)
#             print(f"[SYSTEM] Executing PID: {pid}, Name: {name}, Priority: {prio}")
#             time.sleep(0.2)
            
#             ans_system.append({'pid': pid, 'name': name, 'priority': prio})
            
#     return ans_system


# def run_interactive_queue(interactive_queue, time_quantum=0.2):
#     ans_interactive = []
#     queue = interactive_queue.copy()

#     while queue:
#         with cpu_lock:
#             p = queue.pop(0)
#             pid = p.get('pid')
#             name = p.get('name')
#             print(f"[INTERACTIVE] Running PID: {pid}, Name: {name} for {time_quantum}s")
#             time.sleep(time_quantum)

#         # Re-queue logic
#         if psutil.pid_exists(pid):
#             print(f"[INTERACTIVE] PID {pid} still running, re-queueing")
#             queue.append(p)
#         else:
#             print(f"[INTERACTIVE] PID {pid} completed")
#             ans_interactive.append({'pid': pid, 'name': name})
#     return ans_interactive


# def run_batch_queue(batch_queue):
#     ans_batch = []
#     for p in batch_queue:
#         with cpu_lock:
#             pid = p.get('pid')
#             name = p.get('name')
#             print(f"[BATCH] Executing PID: {pid}, Name: {name} (FCFS)")
#             time.sleep(0.2)
#             ans_batch.append({'pid': pid, 'name': name})
#     return ans_batch


# def mlq_scheduler():
#     process_list = get_100_process()
#     system, interactive, batch = classify_processes(process_list)

#     print("==== Working of MLQ Scheduler (Sequential + Synchronized) ====")

#     # Queue priority: system > interactive > batch
#     if system:
#         print("\n Running System Queue...")
#         ans_system = run_system_queue(system)
#     else:
#         ans_system = []

#     if interactive:
#         print("\n Running Interactive Queue...")
#         ans_interactive = run_interactive_queue(interactive)
#     else:
#         ans_interactive = []

#     if batch:
#         print("\n Running Batch Queue...")
#         ans_batch = run_batch_queue(batch)
#     else:
#         ans_batch = []

#     print("\n All queues executed in proper MLQ order.")
#     return ans_system, ans_interactive, ans_batch


# mlq_scheduler()






import threading
import time
import psutil
from get_100_process import get_100_process
from classify_processes import classify_processes

# Priority ranking
priority_ranking = {
    psutil.IDLE_PRIORITY_CLASS: 1,
    psutil.BELOW_NORMAL_PRIORITY_CLASS: 2,
    psutil.NORMAL_PRIORITY_CLASS: 3,
    psutil.ABOVE_NORMAL_PRIORITY_CLASS: 4,
    psutil.HIGH_PRIORITY_CLASS: 5,
    psutil.REALTIME_PRIORITY_CLASS: 6
}

# Global lock and events
cpu_lock = threading.Lock()
system_done = threading.Event()
interactive_done = threading.Event()


def run_system_queue(system_queue):
    
    system_queue.sort(
        key=lambda p: priority_ranking.get(p.get("nice", psutil.NORMAL_PRIORITY_CLASS), 0),
        reverse=True
    )

    for p in system_queue:
        with cpu_lock:
            pid = p["pid"]
            name = p["name"]
            prio = priority_ranking.get(p.get("nice", psutil.NORMAL_PRIORITY_CLASS), 0)
            print(f"[SYSTEM] Executing PID={pid}, Name={name}, Priority={prio}")
            time.sleep(0.2)

    print("[SYSTEM] Completed All Processes")
    system_done.set()  # notify interactive
    return


def run_interactive_queue(interactive_queue, time_quantum=0.25):
   
    system_done.wait()  # wait for system to finish

    print("[INTERACTIVE] Started After System Queue")

    queue = interactive_queue.copy()

    while queue:
        with cpu_lock:
            p = queue.pop(0)
            pid = p["pid"]
            name = p["name"]
            print(f"[INTERACTIVE] Running PID={pid}, Name={name} for {time_quantum}s")
            time.sleep(time_quantum)

        # Requeue logic if process still exists
        if psutil.pid_exists(pid):
            queue.append(p)
        else:
            print(f"[INTERACTIVE] PID {pid} completed")

    print("[INTERACTIVE] Completed All Processes")
    interactive_done.set()  # notify batch
    return


def run_batch_queue(batch_queue):
    

    interactive_done.wait()  # wait for interactive to finish

    print("[BATCH] Started After Interactive Queue")

    for p in batch_queue:
        with cpu_lock:
            pid = p["pid"]
            name = p["name"]
            print(f"[BATCH] Executing PID={pid}, Name={name} (FCFS)")
            time.sleep(0.2)

    print("[BATCH] Completed All Processes")
    return


def mlq_scheduler():
    process_list = get_100_process()
    system, interactive, batch = classify_processes(process_list)

    print("\n========== Synchronized MLQ Scheduler ==========")

    # Create threads for each queue
    t1 = threading.Thread(target=run_system_queue, args=(system,))
    t2 = threading.Thread(target=run_interactive_queue, args=(interactive,))
    t3 = threading.Thread(target=run_batch_queue, args=(batch,))

    # Start threads
    t1.start()
    t2.start()
    t3.start()

    # Wait for all to finish
    t1.join()
    t2.join()
    t3.join()

    print("\nAll queues executed sequentially in strict MLQ order.")


mlq_scheduler()
