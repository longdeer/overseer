overseer
========
``flask`` based app for monitoring and controlling ups parameters

requirements
------------
* ``flask[async]``
* ``pysnmp`` (with compiled MIB in ~/pysnmp_mibs or site-packages/pysnmp/smi/mibs)

installation
------------
``git clone https://github.com/longdeer/overseer.git``

configuration
-------------
.env
```
APP_NAME=
LISTEN_ADDRESS=
LISTEN_PORT=
LOGGY_FILE=
LOGGY_LEVEL=
UPS_ADDRESSES=
UPS_NAMES=
UPS_SNMP_POLL_PARAMETERS=
UPS_SNMP_POLL_NAMES=
UPS_SNMP_POLL_TIMER=
SNMP_COMMUNITY=
SNMP_PORT=
DB_ACCESS_LIST=
DB_NAME=
DB_ADDRESS=
DB_USER_NAME=
DB_USER_PASSWORD=
```
