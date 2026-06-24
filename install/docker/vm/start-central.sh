#!/usr/bin/env sh
set -eu

./load-images.sh
docker compose -f docker-compose.central.yml up -d

echo
echo "Central is starting at: https://$(hostname -I 2>/dev/null | awk '{print $1}' || echo localhost):8443"
echo "Default login: admin@odysseusinc.com / password"
echo
echo "After each DataNode VM has registered, keep one worker running per node:"
echo "  ./run-worker.sh workers/site1.env"
