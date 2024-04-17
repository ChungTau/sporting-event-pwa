#!/bin/bash

# Path to the expected certificate
CERT_FILE="/etc/letsencrypt/live/auth.chungtau.com/fullchain.pem"

# Wait for the certificate to be present
while [ ! -f "$CERT_FILE" ]
do
  echo "Waiting for SSL certificates to be generated..."
  sleep 10
done

# Now proceed to start Keycloak
/opt/keycloak/bin/kc.sh start --import-realm
