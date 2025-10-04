<img width="100%" src="https://github.com/user-attachments/assets/3f1451a0-3dee-4d53-a450-5e8b446f403b" />

overseer
========
``node`` app for monitoring and controlling. Current version includes:
* UPS parameters monitor:
	- The UPS model name (e.g. 'Intelligent 8000E 900VA');<br>
	- The current AC input phase;<br>
	- The current state of the UPS. If the UPS is unable to determine the state of the UPS this variable is set to unknown(1);<br>
	- The current output phase;<br>
	- The current UPS load expressed in percent of rated capacity;<br>
	- The remaining battery capacity expressed in percent of full capacity;<br>
	- The current battery voltage expressed in 1/10 VDC;<br>
	- The current utility line voltage in 1/10 VACThe fully charged battery voltage of the battery system used in the UPS, expressed in tenths of a volt;<br>
	- The maximum utility line voltage in 1/10 VAC over the previous 1 minute period;<br>
	- The minimum utility line voltage in 1/10 VAC over the previous 1 minute period;<br>
	- The output voltage of the UPS system in 1/10 VAC;<br>
	- The current output frequency of the UPS system in 1/10 Hz;<br>
	- The current input frequency to the UPS system in 1/10 Hz;<br>
	- The current internal UPS temperature expressed in tenths of a Celsius degreeIndicates whether the UPS batteries need replacing;<br>
	- The current battery current expressed in percent of maximum currentThe UPS battery run time remaining before battery exhaustion, in seconds;<br>
	- The elapsed time in seconds since the UPS has switched to battery power;<br>
	- The status of the UPS batteries;<br>
	- The reason for the occurrence of the last transfer to UPS battery pow.<br>
* ``announcer`` layout

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
UPS_ADDRESSES=
UPS_NAMES=
UPS_SNMP_POLL_PARAMETERS=
UPS_SNMP_POLL_NAMES=
UPS_SNMP_POLL_TIMER=
SNMP_COMMUNITY=
SNMP_PORT=
```
