#!/usr/bin/env bash
ip addr show | grep "inet " | grep -v "127\.0\.0\.1\|172\." | awk '{print $NF, $2}' | column -t
