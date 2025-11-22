

import asyncio
import threading
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
from final_mlq_threading import mlq_scheduler, set_emitter, set_stop_flag

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

connected_ws = set()
scheduler_thread = None  # reference to current running thread

async def broadcast(message: str):
    ws_list = list(connected_ws)
    for ws in ws_list:
        try:
            await ws.send_text(message)
        except:
            pass

@app.websocket("/ws/scheduler")
async def websocket_endpoint(ws: WebSocket):
    await ws.accept()
    connected_ws.add(ws)
    loop = asyncio.get_running_loop()
    try:
        while True:
            msg = await ws.receive_text()
            msg = msg.lower()
            if msg == "start":
                start_scheduler_in_thread(loop)
            elif msg == "stop":
                stop_scheduler()
    except WebSocketDisconnect:
        connected_ws.remove(ws)

def start_scheduler_in_thread(loop):
    """Start fresh MLQ scheduler in a new background thread."""
    global scheduler_thread

    # Stop old scheduler if any
    stop_scheduler()

    def emitter(message: str):
        asyncio.run_coroutine_threadsafe(broadcast(message), loop)

    set_emitter(emitter)
    set_stop_flag(False)  # reset stop flag

    def target():
        try:
            mlq_scheduler()
            emitter("=== END ===")
        except Exception as e:
            emitter(f"ERROR: {e}")

    scheduler_thread = threading.Thread(target=target, daemon=True)
    scheduler_thread.start()

def stop_scheduler():
    """Stop running scheduler safely."""
    global scheduler_thread
    set_stop_flag(True)
    if scheduler_thread and scheduler_thread.is_alive():
        # Wait a short time for thread to notice stop flag
        scheduler_thread.join(timeout=0.1)
    scheduler_thread = None




if __name__ == "__main__":
    import uvicorn
    asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())  
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)










