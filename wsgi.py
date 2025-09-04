import	asyncio
import	json
from	os					import getenv
from	threading			import Thread
from	modules.logger		import Logger
from	modules.snmp_poll	import snmp_polling
from	flask				import Flask
from	flask				import render_template
from	dotenv				import load_dotenv








load_dotenv()
app = Flask(

	getenv("APP_NAME"),
	static_folder=getenv("APP_STATIC_FOLDER"),
	template_folder=getenv("APP_TEMPLATES_FOLDER")
)
loggy = Logger(getenv("LOGGY_FILE"), getenv("APP_NAME"), getenv("LOGGY_LEVEL"))
POLL_TIMER = int(getenv("UPS_SNMP_POLL_TIMER"))
CURRENT_POLL = dict()








@app.route("/ups-status")
def get_ups_status() -> str : return json.dumps(CURRENT_POLL)




@app.route("/ups-monitor")
def view_ups_monitor(): return render_template(

	"ups.html",
	names=json.loads(getenv("UPS_NAMES")),
	parameters=json.loads(getenv("UPS_SNMP_POLL_PARAMETERS")),
	description=json.loads(getenv("UPS_SNMP_POLL_NAMES")),
	timer=POLL_TIMER
)








if	__name__ == "__main__":

	Thread(

		target=asyncio.run,
		args=(

			snmp_polling(

				getenv("UPS_ADDRESSES"),
				getenv("UPS_NAMES"),
				getenv("UPS_SNMP_POLL_PARAMETERS"),
				POLL_TIMER /1000,
				CURRENT_POLL,
				loggy
			),
		)
	).start()
	app.run(host=getenv("LISTEN_ADDRESS"), port=getenv("LISTEN_PORT"))







