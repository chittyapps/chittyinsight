#!/bin/bash
set -euo pipefail
echo "=== chittyinsight Onboarding ==="
curl -s -X POST "${GETCHITTY_ENDPOINT:-https://get.chitty.cc/api/onboard}" \
  -H "Content-Type: application/json" \
  -d '{"service_name":"chittyinsight","organization":"CHITTYOS","type":"service","tier":4,"domains":["insight.chitty.cc"]}' | jq .
