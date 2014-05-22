/* global window, d3, console, gdpGraph */

window.onload=function(){d3.json("data/gdpGraph.json", onData);}; //load gdpGraph.josn when the page has loaded

function onData(error, data){
	if(error){
		console.log("ERROR LOADING GRAPH DATA: " + error.message);
		return;
	}
	
	new gdpGraph("#gdpGraph", data);
}