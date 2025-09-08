import	asyncio
import	json
from	os							import getenv
from	typing						import List
from	typing						import Dict
from	modules.ops					import Normalizer
from	pysnmp.hlapi.v3arch.asyncio	import SnmpEngine
from	pysnmp.hlapi.v3arch.asyncio	import get_cmd
from	pysnmp.hlapi.v3arch.asyncio	import CommunityData
from	pysnmp.hlapi.v3arch.asyncio	import UdpTransportTarget
from	pysnmp.hlapi.v3arch.asyncio	import ContextData
from	pysnmp.hlapi.v3arch.asyncio	import ObjectType
from	pysnmp.hlapi.v3arch.asyncio	import ObjectIdentity








async def snmp_polling(
						target_addresses:str,
						target_names	:str,
						parameters		:str,
						polling_timer	:int,
						poll_cache		:Dict[str,Dict[str,str]],
						loggy
					):

	target_addresses = json.loads(target_addresses)
	target_names = json.loads(target_names)
	parameters = json.loads(parameters)

	while True:

		loggy.debug(f"Polling {target_addresses} with {parameters}")
		current_poll = {

			target_names[i]: await poll_target(address, parameters, loggy)
			for i,address in enumerate(target_addresses)
		}
		poll_cache.clear()
		for name, data in current_poll.items(): poll_cache[name] = data

		await asyncio.sleep(polling_timer)








async def poll_target(addr :str, parameters :List[str], loggy) -> Dict[str,str] :

	loggy.debug(f"Starting {addr} polling")
	engine = SnmpEngine()
	data = dict()

	errorIndication, errorStatus, errorIndex, varBinds = await get_cmd(

		engine,
		CommunityData(getenv("SNMP_COMMUNITY"), mpModel=0),
		await UdpTransportTarget.create((addr, int(getenv("SNMP_PORT"))), timeout=0, retries=0),
		ContextData(),
		*map(lambda para : ObjectType(ObjectIdentity("XPPC-MIB", para, 0)), parameters)
	)

	if errorIndication:	loggy.error(f"{addr} error: {errorIndication}")
	elif(errorStatus):	loggy.error(

		"{} error: {} at {}".format(

			addr,
			errorStatus.prettyPrint(),
			errorIndex and varBinds[int(errorIndex) - 1][0] or "?"
		)
	)
	else:

		data = {

			para: getattr(Normalizer, para, lambda V : V)(value.prettyPrint())
			for para,( _,value ) in zip(parameters,varBinds)
		}
		loggy.info(f"{addr} poll: {data}")

	engine.close_dispatcher()

	return data







