#!/bin/bash
cd /root/.openclaw/workspace/Panodi-Cloud-Env/rendinti-factory/genesis-app-v2
export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"
/root/.local/bin/claude -p "Please read audit_fixes.txt in this folder and apply the requested fixes. After you're done, verify." --dangerously-skip-permissions
