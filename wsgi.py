import	json
from	flask	import Flask
from	flask	import render_template
from	eltena	import get_eltena








app = Flask(__name__)




@app.route("/get_snmp_eltena")
async def get_snmp_eltena():

	CC = await get_eltena("192.168.160.253")
	Rx = await get_eltena("192.168.160.254")

	return json.dumps({ "CC": CC, "Rx": Rx })




@app.route("/eltena<upd>")
def eltena(upd :str): return render_template("eltena.html", upd=upd)




@app.route("/office")
def office(): return render_template("office.html")




if __name__ == "__main__": app.run(host="192.168.162.111", port="16200")







