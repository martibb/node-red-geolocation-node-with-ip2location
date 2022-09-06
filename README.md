

# Node-RED geolocation node with IP2Location module

This Node-RED node called **IPData** provides geolocation data from a single IP address or a list of IP addresses in input, with the usage of IP2Location Node.js Geolocation module. The goal is to use **low-code techniques** to build a mechanism capable of obtaining geolocation information from IP addresses.

IP2Location Geolocation module is based on **IP2Location database** binary file from which IPData can retrieves country, region, city, geographic coordinates, ZIP code and timezone. It supports both IPv4 and IPv6 addresses.

This node can be used in many ways. I created a **Node-RED flow** to compare IP Addresses from **Ripe Atlas probes** information and IP2Location Geolocation data (description below).

## Prerequisites
Install Node-RED from [here](https://nodered.org/docs/getting-started/local).

**Quick useful notes about Node-RED:**

 - Always run Node-RED in your User directory (in Windows *C:\Users\my_name*);
 - Every node in Node-RED can have one or more input and one or more output. The arriving/sending object is called *msg*, with the main property named as *payload*.
 - To start program with Node-RED open http://localhost:1880/ . The nodes palette is the list of nodes on the left of the page.
 - Notice that: 
***Node-RED user directory*** -> typically    *~/.node-red* in Mac OS or Linux, and *C:\Users\my_name\\.node_red* in Windows;
***User directory*** -> your system user directory, for example *C:\Users\my_name* in Windows.

## Installation

 - Clone the repository. Rename main folder as "IPData";
 - Get [IPv6 database file](https://lite.ip2location.com/database/db11-ip-country-region-city-latitude-longitude-zipcode-timezone), version DB11, BIN format, from IP2Location. Save file in the same directory downloaded before (named IPData);
 - Install [IP2Location Node.js module](https://github.com/ip2location/ip2location-nodejs) running the following command in your user directory:

`npm install ip2location-nodejs`
 - Run the following command **in your Node-RED user directory**:
 
`npm install <absolute path to IPData folder>`

**example:** 
`npm install C:\Users\my_name\example\IPData`
 - If Node-RED is running, stop it by closing terminal or use *Ctrl-C* and then start it again with `node-red` command in your **user directory**. You should now see IPData in your node palette.

**If the new node is installed properly**, Node-RED has created a new link directory to IPData. For examples, in Windows the command creates a directory in *C:\Users\my_name\\.node-red\node_modules* called *node-red-contrib-ipdata*.

## Usage

To make IPData node compare IP Addresses in input, they must be stored as single elements of an array in incoming msg.payload.

**Example input**

    msg.payload = [ 2a10:3781:e22:1:220:4aff:fec8:23d7, 2a02:a467:f500:fd:220:4aff:fec8:2532, 94.214.123.162 ];

**Specific property in edit mode: *Data type***

*Data type* property allows you to select a list of possible types of output data. Options:

 - Country (code and name)
 - Region
 - City
 - Geographic coordinates (latitude and longitude)
 - Zipcode
 - Timezone

## Example flow

I created a Node-RED flow that can compare **[Ripe Atlas](https://atlas.ripe.net/)** connected probes IP Addresses with IP2Location data using IPData node. The flow has the purpose to find Ripe Atlas probes with **wrong geolocation** according to IP2Location database.

**Flow JSON Code:**

    [{"id":"f6d6fbb4adba7535","type":"loop","z":"62f51db28f12ad82","name":"","kind":"cond","count":"","initial":"1","step":"1","condition":"msg.payload.next != \"stop\"","conditionType":"js","when":"after","enumeration":"enum","enumerationType":"msg","limit":"","loopPayload":"loop-keep","finalPayload":"final-count","x":500,"y":220,"wires":[["59650c31914d70a5"],["67827b4620c9be69"]]},{"id":"af9e91697a6f8f01","type":"inject","z":"62f51db28f12ad82","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"},{"p":"results","v":"[]","vt":"jsonata"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"https://atlas.ripe.net/api/v2/probes?page_size=500&status_name=Connected","payloadType":"str","x":210,"y":220,"wires":[["f6d6fbb4adba7535"]]},{"id":"f50ba4f449a6728c","type":"http request","z":"62f51db28f12ad82","name":"probes API request","method":"GET","ret":"obj","paytoqs":"ignore","url":"","tls":"","persist":false,"proxy":"","authType":"","senderr":false,"headers":[],"x":470,"y":400,"wires":[["bbef10002908aae0"]]},{"id":"67827b4620c9be69","type":"change","z":"62f51db28f12ad82","name":"","rules":[{"t":"set","p":"url","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":270,"y":400,"wires":[["f50ba4f449a6728c"]]},{"id":"bbef10002908aae0","type":"function","z":"62f51db28f12ad82","name":"get embedded pages","func":"for(let i=0; i<msg.payload.results.length; i++)\n    msg.results.push(msg.payload.results[i]);\n\nif(msg.payload.next!=null)\n    msg.payload = msg.payload.next;\nelse \n    msg.payload.next = \"stop\";\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":700,"y":400,"wires":[["f6d6fbb4adba7535"]]},{"id":"e5e97b3ac842e9a9","type":"join","z":"62f51db28f12ad82","name":"","mode":"custom","build":"object","property":"payload","propertyType":"msg","key":"topic","joiner":"\\n","joinerType":"str","accumulate":false,"timeout":"","count":"2","reduceRight":false,"reduceExp":"","reduceInit":"","reduceInitType":"","reduceFixup":"","x":1410,"y":240,"wires":[["d2e62e9eb15cad5b"]]},{"id":"bd8e0e5cde7b2d67","type":"change","z":"62f51db28f12ad82","name":"","rules":[{"t":"set","p":"topic","pt":"msg","to":"Ripe Atlas","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":1130,"y":300,"wires":[["e5e97b3ac842e9a9"]]},{"id":"d999b07b0e15c475","type":"ipdata","z":"62f51db28f12ad82","name":"","infotype":"country,region,coordinates","x":1210,"y":120,"wires":[["e5e97b3ac842e9a9"]]},{"id":"59650c31914d70a5","type":"function","z":"62f51db28f12ad82","name":"get IPv4 and IPv6 addresses","func":"msg.payload = msg.results;\n\nmsg.addrMeasured = new Array();\n\nfor (let i = 0; i < msg.payload.length; i++) {\n\n    if (msg.payload[i].address_v6 == null || msg.payload[i].address_v4 == undefined)\n        msg.addrMeasured[i] = msg.payload[i].address_v4;\n    else\n        msg.addrMeasured[i] = msg.payload[i].address_v6;\n\n}\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":760,"y":220,"wires":[["bd8e0e5cde7b2d67","8c966d2c0cb8493e"]]},{"id":"d2e62e9eb15cad5b","type":"function","z":"62f51db28f12ad82","name":"compare and get finale lists","func":"let probes = msg.payload[\"Ripe Atlas\"];\nlet stored = msg.payload[\"IP2Location\"];\n\nlet measurements = []; //final list of correct and incorrect measurements (with appropriate flag), excluding IP addresses whose information is not in the IP2Location lite database.\nlet m = 0; //index measurements list\n\nlet errorsList = []; //list that contains only the probes with wrong geolocation\nlet e = 0; //index errorsList list\n\nfor(let i=0; i<probes.length; i++) {\n\n    if(stored[i][\"ip\"] == \"?\" || stored[i] == undefined)\n        continue;\n\n    if(probes[i].country_code != stored[i][\"Country code\"]) {\n\n        stored[i][\"Ripe Atlas error\"] = true;\n        stored[i][\"Ripe Atlas CC\"] = probes[i].country_code;\n\n        errorsList[e] = new Object();\n        errorsList[e].ip = stored[i][\"ip\"];\n        errorsList[e].ipNo = stored[i][\"ipNo\"];\n        errorsList[e].RipeAtlasCC = probes[i].country_code;\n        errorsList[e].IP2LocationCC = stored[i][\"Country code\"];\n        errorsList[e].IP2LocationCN = stored[i][\"Country name\"];\n        e++;\n    }\n    else\n        stored[i][\"Ripe Atlas error\"] = false;\n\n    measurements[m] = stored[i];\n    m++;\n}\n\nlet newPayload = [];\nnewPayload[0] = measurements;\nnewPayload[1] = errorsList;\n\nmsg.payload = newPayload;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":1660,"y":240,"wires":[["b8cdeb8220527bf3","0e8e815e7975c01a"]]},{"id":"b8cdeb8220527bf3","type":"function","z":"62f51db28f12ad82","name":"create formatted output","func":"let measurements = msg.payload[0];\nlet errorsList = msg.payload[1];\n\nlet output = new Object();\n\n//Number of measured IP addresses\noutput[\"Analyzed\"] = measurements.length;\n\n//Percentage of incorrect IP addresses\noutput[\"Errors\"] = errorsList.length;\n\n//Total and incorrect number of IP addresses per country\noutput[\"Probes\"] = new Object();\nlet addr = new Object();\nfor (let i = 0; i < measurements.length; i++) {\n\n    let cName = measurements[i][\"Country name\"];\n    if (addr[cName] == null) {\n\n        addr[cName] = new Object();\n        addr[cName][\"tot\"] = 1;\n        addr[cName][\"error\"] = 0;\n    }\n    else\n        addr[cName][\"tot\"]++;\n\n    if (measurements[i][\"Ripe Atlas error\"] == true)\n        addr[cName][\"error\"]++;\n}\n\nfor (let country in addr)\n    output[\"Probes\"][country] = ((addr[country][\"error\"] * 100) / addr[country][\"tot\"]).toFixed(2);\n\n\nmsg.addr = addr;\nmsg.payload = output;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":1930,"y":480,"wires":[["1cba0ba22f9a37fd","22dfb29165c47394","df33db44e51450b1","652eef5f51b7c788","cfa54e541eb5fe86"]]},{"id":"1cba0ba22f9a37fd","type":"json","z":"62f51db28f12ad82","name":"","property":"payload","action":"","pretty":false,"x":2230,"y":480,"wires":[["aea9630f3960cb98"]]},{"id":"7cc7260bab698558","type":"worldmap","z":"62f51db28f12ad82","name":"","lat":"","lon":"","zoom":"5","layer":"OSMG","cluster":"","maxage":"","usermenu":"show","layers":"show","panit":"false","panlock":"false","zoomlock":"false","hiderightclick":"false","coords":"none","showgrid":"false","allowFileDrop":"false","path":"/IPworldmap","overlist":"DR,CO,RA,DN,HM","maplist":"OSMG,OSMC,OSMH,EsriC,EsriS,EsriT,EsriO,EsriDG,NatGeo,UKOS,OS45,OS00,OpTop,HB,AN,ST,SW","mapname":"","mapurl":"","mapopt":"","mapwms":false,"x":2270,"y":240,"wires":[]},{"id":"0e8e815e7975c01a","type":"function","z":"62f51db28f12ad82","name":"make msg for Worldmap","func":"let IPList = new Array();\n\nfor (let i = 0; i < msg.payload[0].length; i++) {\n\n    IPList[i] = new Object();\n    IPList[i].name = msg.payload[0][i].ip;\n    IPList[i].lat = msg.payload[0][i].Latitude;\n    IPList[i].lon = msg.payload[0][i].Longitude;\n\n    if (msg.payload[0][i][\"Ripe Atlas error\"] == true)\n        IPList[i].iconColor = \"red\";\n    else\n        IPList[i].iconColor = \"green\";\n}\n\nmsg.payload = IPList;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2010,"y":240,"wires":[["7cc7260bab698558"]]},{"id":"aea9630f3960cb98","type":"file","z":"62f51db28f12ad82","name":"JSON string write file","filename":"","filenameType":"str","appendNewline":true,"createDir":false,"overwriteFile":"true","encoding":"none","x":2440,"y":480,"wires":[[]]},{"id":"ba10d1b2116760da","type":"ui_chart","z":"62f51db28f12ad82","d":true,"name":"Pie chart","group":"39a6bdfd8256dc3e","order":0,"width":"6","height":"8","label":"Pie chart","chartType":"pie","legend":"false","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":"10","useOneColor":false,"useUTC":false,"colors":["#0095ff","#ff0000","#ff7700","#2ca02c","#c2009e","#12e2b9","#eeff00","#9467bd","#0400ff"],"outputs":1,"useDifferentColor":false,"className":"","x":2420,"y":720,"wires":[["59bf068735bd3328"]]},{"id":"fb00ae37a47ccc29","type":"ui_chart","z":"62f51db28f12ad82","name":"Bar chart","group":"39a6bdfd8256dc3e","order":4,"width":"11","height":"9","label":"Bar chart","chartType":"bar","legend":"false","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":0,"useOneColor":true,"useUTC":false,"colors":["#1f77b4","#aec7e8","#ff7f0e","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5"],"outputs":1,"useDifferentColor":false,"className":"","x":2420,"y":780,"wires":[[]]},{"id":"22dfb29165c47394","type":"function","z":"62f51db28f12ad82","name":"create charts input","func":"let m = {};\nm.labels = new Array();\nm.series = [\"% wrong probes\"];\nm.data = new Array();\nm.data[0] = new Array();\n\nlet stats = msg.payload;\n\nlet i=0;\nfor(var key in stats[\"Probes\"]) {\n\n    m.labels[i] = key;\n    let value = stats[\"Probes\"][key];\n    m.data[0][i] = value;\n    i++;\n}\n\nreturn { payload: [m] };","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2190,"y":720,"wires":[["ba10d1b2116760da","fb00ae37a47ccc29","f0878308a31b5a73"]]},{"id":"652eef5f51b7c788","type":"function","z":"62f51db28f12ad82","name":"get tot geolocation errors","func":"msg = { topic: \"Wrong geolocation\", payload: msg.payload.Errors };\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2210,"y":940,"wires":[["dd39e6860101e324"]]},{"id":"df33db44e51450b1","type":"function","z":"62f51db28f12ad82","name":"get tot analyzed IP Address","func":"msg = { topic: \"Analyzed\", payload: msg.payload.Analyzed};\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2200,"y":840,"wires":[["dd39e6860101e324"]]},{"id":"f0878308a31b5a73","type":"ui_text","z":"62f51db28f12ad82","group":"39a6bdfd8256dc3e","order":3,"width":0,"height":0,"name":"Pie and Bar Charts description","label":"","format":"Graphs representing the number of IP addresses analyzed by country with wrong geolocation. \"-\" means the IP address is still unallocated to any countries or reserved.","layout":"col-center","className":"","x":2490,"y":660,"wires":[]},{"id":"59bf068735bd3328","type":"ui_chart","z":"62f51db28f12ad82","d":true,"name":"Pie chart legend","group":"39a6bdfd8256dc3e","order":0,"width":"6","height":"8","label":"Legend","chartType":"pie","legend":"true","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":"","useOneColor":false,"useUTC":false,"colors":["#0095ff","#ff0000","#ff7700","#2ca02c","#c2009e","#12e2b9","#eeff00","#9467bd","#0400ff"],"outputs":1,"useDifferentColor":false,"className":"","x":2600,"y":720,"wires":[[]]},{"id":"dd39e6860101e324","type":"ui_chart","z":"62f51db28f12ad82","name":"Line chart","group":"979abbd9df715833","order":4,"width":"11","height":"9","label":"Line chart","chartType":"line","legend":"true","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"604800","cutout":0,"useOneColor":false,"useUTC":false,"colors":["#1f77b4","#aec7e8","#ff7f0e","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5"],"outputs":1,"useDifferentColor":false,"className":"","x":2440,"y":900,"wires":[["263ff23604780451"]]},{"id":"263ff23604780451","type":"ui_text","z":"62f51db28f12ad82","group":"979abbd9df715833","order":4,"width":0,"height":0,"name":"Line Chart description","label":"","format":"Graph representing the variation in the number of IP addresses measured over time and which of these have incorrect geolocation.","layout":"row-spread","className":"","x":2640,"y":900,"wires":[]},{"id":"121ab356c0f510e1","type":"file","z":"62f51db28f12ad82","name":"plain text write file","filename":"","filenameType":"str","appendNewline":true,"createDir":false,"overwriteFile":"true","encoding":"none","x":2430,"y":420,"wires":[[]]},{"id":"cfa54e541eb5fe86","type":"function","z":"62f51db28f12ad82","name":"build output string","func":"let output = \"\\t\\tSTATISTICS\\n\\n\\n\";\n\noutput = output.concat(\"IP Address analyzed: \" + msg.payload.Analyzed + \";\\n\");\noutput = output.concat(\"IP Address with wrong geolocation: \" + msg.payload.Errors + \";\\n\\n\");\n\noutput = output.concat(\"PERCENTAGE OF WRONG PROBES PER COUNTRY:\\n\");\n\nfor(let country in msg.payload.Probes) {\n\n    output = output.concat(country + \": \");\n    output = output.concat(msg.payload.Probes[country] + \"%\\n\");\n}\n\nmsg.payload = output;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2230,"y":420,"wires":[["121ab356c0f510e1"]]},{"id":"8c966d2c0cb8493e","type":"change","z":"62f51db28f12ad82","name":"","rules":[{"t":"set","p":"payload","pt":"msg","to":"addrMeasured","tot":"msg"},{"t":"set","p":"topic","pt":"msg","to":"IP2Location","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":1040,"y":120,"wires":[["d999b07b0e15c475"]]},{"id":"39a6bdfd8256dc3e","type":"ui_group","name":"IP addresses per country","tab":"bffbac72d5fb3229","order":1,"disp":true,"width":"12","collapse":false,"className":""},{"id":"979abbd9df715833","type":"ui_group","name":"IP addresses over time","tab":"bffbac72d5fb3229","order":4,"disp":true,"width":"12","collapse":false,"className":""},{"id":"bffbac72d5fb3229","type":"ui_tab","name":"IP Statistics","icon":"dashboard","disabled":false,"hidden":false}]

**How to get the flow:**

 - Install [*loop node*](https://flows.nodered.org/node/node-red-contrib-loop):
Run `npm install node-red-contrib-loop` in your Node-RED user directory;

 - Install [*worldmap node*](https://flows.nodered.org/node/node-red-contrib-web-worldmap):
Run `npm install node-red-contrib-web-worldmap` in your Node-RED user directory;

 - Install [*dashboard nodes*](https://github.com/node-red/node-red-dashboard):
Run `npm install node-red-dashboard` in your Node-RED user directory;

 - Restart your Node-RED instance in your user directory and you should have these new nodes available in the palette;

 - Copy JSON flow code from paragraph above;
 
 - In the GUI, *Menu* -> *Import* -> Paste JSON code and click *Import* button. 

 - Handle various types of output before trigger the flow as in the paragraph below.

**Output types:**
 - *Plain text / JSON string on file*. Set the absolute path of the files in edit mode of *write file nodes* (named *"plain text write file"* and *"JSON string write file"*) to write a text file and a JSON file. The write nodes will create new files if they don't exist. To open edit mode click twice on these nodes; to save select the red button "*Done*".
  
 - *World map with markers*. Open http://localhost:1880/IPworldmap and make sure that under the worldmap node in the imported flow there is the text "connected 1" with green dot. When you'll trigger the flow and *msg* arrives to *worldmap node*, markers will start loading. If the number of IP Addresses is very large you will see markers after few minutes.
   
 - *Bar / Pie and Line chart*. If dashboard nodes have an orange/red triangle over them, open edit mode by clicking twice over every single node of this category in the workspace and select "Done" (nodes "Pie and Bar Charts description", "Pie chart", "Pie chart legend", "Bar chart", "Line chart", "Line Chart description"). Open the dashboard in http://localhost:1880/ui . If you have used dashboard nodes before in other flows click “IP Statistics” from side menu. When you'll trigger the flow and *msg* will arrive to *chart nodes*, data will start loading.
 "Pie chart" node and "Pie chart legend" node are disabled because they   
represent the same information as the bar chart, so you won't see them in the dashboard. To enable these nodes, open edit mode for both and click on "Disabled" in the lower left. The procedure to enable is the same as for disabling.

**Final steps:**

 - Click red button *Deploy* in the top right of the page. If everything has been set properly, no error will be shown and no node will have the blue dot or the orange/red triangle.

 - **To run the flow, click on the left side button of inject node.** You will see the text "looping" under the Condition loop node and "requesting" under the "probes API request" node while running the loop. It may takes a few minutes to get the previously described outputs.
