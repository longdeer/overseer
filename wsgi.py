import	json
from	flask	import Flask
from	flask	import request
from	flask	import render_template
from	eltena	import get_eltena
from	office	import get_office_tab
from	office	import add_office_content








app = Flask(__name__)








# JSON routes
@app.route("/office-add", methods=[ "POST" ])
async def office_add():

	if	request.method == "POST":
		if await add_office_content(request.get_json()):

			return	json.dumps({ "success": True }), 200, { "ContentType": "application/json" }
		return		json.dumps({ "success": False }), 422, { "ContentType": "application/json" }
	return			json.dumps({ "success": False }), 415, { "ContentType": "application/json" }


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







