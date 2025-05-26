from flask	import Flask
from flask	import render_template
from eltena	import get_eltena








app = Flask(__name__)




@app.route("/get_snmp_eltena")
async def get_snmp_eltena():

	data = await get_eltena("192.168.160.253")
	return render_template("viewer.html", data=data)




@app.route("/eltena<upd>")
def index(upd): return render_template("index.html", upd=upd)







