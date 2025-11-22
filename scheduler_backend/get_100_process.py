# get_100_process.py

import psutil
import time

def get_100_process():
    processes = []

    for p in psutil.process_iter([
        'pid', 'name', 'username', 'status',
        'memory_percent', 'num_threads', 'create_time', 'nice'
    ]):
        try:
            info = p.info

            processes.append({
                "pid": info.get("pid"),
                "name": info.get("name", "unknown"),
                "username": info.get("username", "mr.unknown"),
                "status": info.get("status", "unknown"),
                "memory": info.get("memory_percent", 0),
                "threads": info.get("num_threads", 0),
                "nice": info.get("nice", 0),
            })
        except (psutil.NoSuchProcess, psutil.AccessDenied):
            continue

        if len(processes) >= 100:
            break

    print("\n---FETCHED 100 PROCESSES (CPU REMOVED)----")
    for p in processes:
        print(p)

    return processes  