#!/usr/bin/env sh
set -eu

./load-images.sh
docker compose -f docker-compose.datanode.yml up -d --build

echo
echo "DataNode is starting at: http://$(hostname -I 2>/dev/null | awk '{print $1}' || echo localhost):8080"
echo "Default login: admin / ohdsi"
echo
echo "Next, register this node with Central:"
echo "  CENTRAL_URL=https://CENTRAL_VM_IP:8443 CENTRAL_DATANODE_NAME='Site 1 DataNode' ./register-datanode.sh"
