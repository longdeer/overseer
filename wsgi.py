import	json
from	flask	import Flask
from	flask	import request
from	flask	import render_template
from	eltena	import get_eltena
from	office	import get_office_tab








app = Flask(__name__)








# JSON routes
@app.route("/office-tab-<name>")
async def office_tab(name :str) -> str :
	return json.dumps({ name: await get_office_tab(name, request.args.get("order")) })


@app.route("/get_snmp_eltena")
async def get_snmp_eltena() -> str : return json.dumps(
	{
		"CC": await get_eltena("192.168.160.253"),
		"Rx": await get_eltena("192.168.160.254"),
	}
)








# render routes
@app.route("/eltena<upd>")
def eltena(upd :str): return render_template("eltena.html", upd=upd)


@app.route("/office")
def office(): return render_template("office.html")







