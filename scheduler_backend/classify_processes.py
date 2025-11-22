


import psutil
from get_100_process import get_100_process

# classification.py



def classify_processes(process_list):
    system_processes = []
    interactive_processes = []
    batch_processes = []
    
    for p in process_list:
        username = p.get('username', '').lower()
        status = p.get('status', '').lower()

    
        priority = p.get('nice', psutil.NORMAL_PRIORITY_CLASS)

        # SYSTEM QUEUE 
        if (
            username in ['system', 'root', 'nt authority\\system', 'mr.unknown'] or 
            priority in [psutil.HIGH_PRIORITY_CLASS, psutil.REALTIME_PRIORITY_CLASS]
        ):
            system_processes.append(p)

        # INTERACTIVE QUEUE
        elif (
            status == 'running' and 
            priority in [psutil.NORMAL_PRIORITY_CLASS, psutil.ABOVE_NORMAL_PRIORITY_CLASS]
        ):
            interactive_processes.append(p)

        # BATCH QUEUE → 
        else:
            batch_processes.append(p)
    
    return system_processes, interactive_processes, batch_processes


if __name__ == "__main__":
    process_list = get_100_process()
    system, interactive, batch = classify_processes(process_list)

    print("\n=== SYSTEM PROCESSES ===")
    for p in system:
        print(p)

    print("\n=== INTERACTIVE PROCESSES ===")
    for p in interactive:
        print(p)

    print("\n=== BATCH PROCESSES ===")
    for p in batch:
        print(p)  