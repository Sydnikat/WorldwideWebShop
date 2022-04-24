#!/bin/sh

CONFFILE="/usr/share/nginx/html/config.js"
DISCLAIMER=""

if [ -f package.json ]; then
  CONFFILE="config.js"

  DISCLAIMER="// WARNING:
// This file is auto-generated by config.js-generator.sh and will be regenerated in the container.
"

  echo "Running in user mode, putting config in $CONFFILE"
fi

echo "\
$DISCLAIMER
window.config = {
    inventoryServiceUrl: \"${REACT_APP_INVENTORY_SERVICE:-"http://localhost:5080/api/inventory"}\",
    orderServiceUrl: \"${REACT_APP_ORDER_SERVICE:-"http://localhost:5080/api/order"}\",
    invoiceServiceUrl: \"${REACT_APP_INVOICE_SERVICE:-"http://localhost:5080/api/invoice"}\",
    userServiceUrl: \"${REACT_APP_USER_SERVICE:-"http://localhost:5080/api/users"}\",
    authServiceUrl: \"${REACT_APP_AUTH_SERVICE:-"http://localhost:5080/auth"}\",
    baseUrl: \"${REACT_APP_FRONTEND_BASE:-"http://localhost:5080"}\",
}
" > ${CONFFILE}

echo "Generated config file $CONFFILE"
