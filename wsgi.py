import	json
from	typing	import Dict
from	typing	import Tuple
from	flask	import Flask
from	flask	import request
from	flask	import render_template
from	eltena	import get_eltena
from	office	import get_office_tab
from	office	import add_office_content








app = Flask(__name__)








# JSON routes
@app.route("/office-add", methods=[ "POST" ])
async def office_add() -> Tuple[str,int,Dict[str,str]] :

	if	request.method == "POST":
		match (response := await add_office_content(request.get_json())):

			case None:		return json.dumps({ "success": True }), 200, { "ContentType": "application/json" }
			case str():		return json.dumps({ "success": False, "exception": response }), 500, { "ContentType": "application/json" }
			case dict():	return json.dumps({ "success": False, **response }), 400, { "ContentType": "application/json" }

	return	json.dumps({ "success": False }), 405, { "ContentType": "application/json" }


@app.route("/office-tab-<name>")
async def office_tab(name :str) -> str :

	db_response = await get_office_tab(name, request.args.get("orderBy"), request.args.get("descending") == "true")
	return json.dumps({ "success": True, name: db_response }), 200, { "ContentType": "application/json" }


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







