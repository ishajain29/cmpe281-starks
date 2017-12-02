#!/bin/bash
case $1 in
    start)
        echo "Starting hello web app."
        /root/go/bin/hello &
        ;;
    stop)
        echo "Stopping hello web app."
        sudo kill $(sudo lsof -t -i:8001)
        ;;
    *)
        echo "Hello web app service."
        echo $"Usage $0 {start|stop}"
        exit 1
esac
exit 0