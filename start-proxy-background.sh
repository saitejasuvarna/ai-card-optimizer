#!/bin/bash

# Pointwise Card Optimizer Background Proxy Server
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PID_FILE="$SCRIPT_DIR/proxy.pid"
LOG_FILE="$SCRIPT_DIR/proxy.log"

case "$1" in
  start)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "🔄 Proxy server is already running (PID: $(cat $PID_FILE))"
      exit 1
    fi
    
    echo "🚀 Starting proxy server in background..."
    cd "$SCRIPT_DIR"
    nohup npm start > "$LOG_FILE" 2>&1 &
    echo $! > "$PID_FILE"
    echo "✅ Proxy server started (PID: $(cat $PID_FILE))"
    echo "📝 Logs: $LOG_FILE"
    ;;
    
  stop)
    if [ ! -f "$PID_FILE" ]; then
      echo "❌ Proxy server is not running"
      exit 1
    fi
    
    PID=$(cat "$PID_FILE")
    if kill -0 "$PID" 2>/dev/null; then
      kill "$PID"
      rm "$PID_FILE"
      echo "🛑 Proxy server stopped"
    else
      echo "❌ Process not found, removing stale PID file"
      rm "$PID_FILE"
    fi
    ;;
    
  status)
    if [ -f "$PID_FILE" ] && kill -0 $(cat "$PID_FILE") 2>/dev/null; then
      echo "✅ Proxy server is running (PID: $(cat $PID_FILE))"
      echo "📝 Logs: $LOG_FILE"
    else
      echo "❌ Proxy server is not running"
    fi
    ;;
    
  logs)
    if [ -f "$LOG_FILE" ]; then
      tail -f "$LOG_FILE"
    else
      echo "❌ Log file not found"
    fi
    ;;
    
  *)
    echo "Usage: $0 {start|stop|status|logs}"
    echo ""
    echo "Commands:"
    echo "  start   - Start proxy server in background"
    echo "  stop    - Stop proxy server"
    echo "  status  - Check if proxy server is running"
    echo "  logs    - View proxy server logs"
    exit 1
    ;;
esac