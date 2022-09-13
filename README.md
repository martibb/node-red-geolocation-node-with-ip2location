

# IPData: a Node-RED geolocation node based on the IP2Location database

This is a node for the Node-RED platform that allows to retrive geographical information about an IP address or a set of IP addresses. 

The node, called **IPData**,  relies on the IP2Location Geolocation module for Node.js as a source of information. 

The goal is to make possible the use of IP Geolocation data in the Node-RED **low-code** platform.

The IP2Location Geolocation module, in turn, makes use of the **IP2Location database binary file**. In this way, IPData can retrieve country, region, city, geographic coordinates, ZIP code and timezone concerning both IPv4 and IPv6 addresses.

IPData can be useful in all the Node-RED flows where geographycal information about IP addresses is needed.

The repository contains, as an example application, a Node-RED flow that uses IPData to retrieve the country code and the coordinates of [RIPE Atlas probes](https://atlas.ripe.net).

## Prerequisites
Install Node-RED as specified [here](https://nodered.org/docs/getting-started/local).

**Some quick notes about Node-RED:**

 - Always run Node-RED in your User directory (in Windows *C:\Users\my_name*);
 - Every node in Node-RED can have one or more input and one or more output. The arriving/sending object is called *msg*. The *msg* main property is called *payload*.
 - To start program with Node-RED open http://localhost:1880/ . The node palette is the list of nodes on the left of the page. You can use them to build an application.
 - Note that: 
   - ***Node-RED user directory*** -> typically *~/.node-red* in Mac OS or Linux, and *C:\Users\my_name\\.node_red* in Windows;
   - ***User directory*** -> your system user directory, for example *C:\Users\my_name* in Windows.

## Installation

 - Clone the repository. Rename the main folder as "IPData";
 - Get the [IPv6 database file](https://lite.ip2location.com/database/db11-ip-country-region-city-latitude-longitude-zipcode-timezone), version DB11, BIN format, from IP2Location. Save the file in the IPData directory;
 - Install the [IP2Location Node.js module](https://github.com/ip2location/ip2location-nodejs) running the following command in your user directory:

`npm install ip2location-nodejs`
 - Run the following command **in your Node-RED user directory**:
 
`npm install <absolute path to IPData folder>`

**example:** 
`npm install C:\Users\my_name\example\IPData`
 - If Node-RED is running, stop it and then start it again with the `node-red` command in your **user directory**. You should now see IPData in your node palette.

If the IPData node is installed properly, Node-RED holds a link directory to IPData. For examples, in Windows the previous command creates a directory in *.node-red\node_modules* called *node-red-contrib-ipdata*.

## Usage

IPData takes as input an array of IP addresses. 
Both IPv4 and IPv6 addresses are accepted. 
The input is provided using the *msg.payload* property. 

An example:

    msg.payload = [ 2a10:3781:e22:1:220:4aff:fec8:23d7, 2a02:a467:f500:fd:220:4aff:fec8:2532, 94.214.123.162 ];

**Output**

The *Data type* property allows you to select a list of possible types of output data. The possible options are:

 - Country (code and name)
 - Region
 - City
 - Geographic coordinates (latitude and longitude)
 - Zipcode
 - Timezone

## An example of Node-RED flow that uses IPData

This is a Node-RED flow that compares the geographical information of RIPE Atlas probes with the geographical information extracted by IPData. 

In particular: 
 - the flow retrives the list of connected probes belonging to the RIPE Atlas monitoring system;
 - Atlas holds some geographical information about its probes; such information is generally provided by the user hosting the probe at installation time; 
 - the flow downloads the geographical information of every probe as contained in the Atlas DB;
 - the flow uses the IP address of each probe to retrieve the geographical information contained in the IP2Location database using the IPData node; 
 - the geographical information in the Atlas DB is compared to the one extracted from IP2Location so to highlight possible inconsistencies (e.g. wrong configuration of a probe during installation time);
 - results are shown on a map; different colors are used depending on if the geolocation information seems to be correct or it is possibly wrong;
 - the flow finally provides its output also in a file and using some charts. 

The flow is an example of low-code application that uses the location information provided by the DB11 IP2Location database. 



**Flow JSON Code:**

    [{"id":"f6d6fbb4adba7535","type":"loop","z":"62f51db28f12ad82","name":"","kind":"cond","count":"","initial":"1","step":"1","condition":"msg.payload.next != \"stop\"","conditionType":"js","when":"after","enumeration":"enum","enumerationType":"msg","limit":"","loopPayload":"loop-keep","finalPayload":"final-count","x":500,"y":220,"wires":[["59650c31914d70a5"],["67827b4620c9be69"]]},{"id":"af9e91697a6f8f01","type":"inject","z":"62f51db28f12ad82","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"},{"p":"results","v":"[]","vt":"jsonata"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"https://atlas.ripe.net/api/v2/probes?page_size=500&status_name=Connected","payloadType":"str","x":210,"y":220,"wires":[["f6d6fbb4adba7535"]]},{"id":"f50ba4f449a6728c","type":"http request","z":"62f51db28f12ad82","name":"probes API request","method":"GET","ret":"obj","paytoqs":"ignore","url":"","tls":"","persist":false,"proxy":"","authType":"","senderr":false,"headers":[],"x":470,"y":400,"wires":[["bbef10002908aae0"]]},{"id":"67827b4620c9be69","type":"change","z":"62f51db28f12ad82","name":"","rules":[{"t":"set","p":"url","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":270,"y":400,"wires":[["f50ba4f449a6728c"]]},{"id":"bbef10002908aae0","type":"function","z":"62f51db28f12ad82","name":"get embedded pages","func":"for(let i=0; i<msg.payload.results.length; i++)\n    msg.results.push(msg.payload.results[i]);\n\nif(msg.payload.next!=null)\n    msg.payload = msg.payload.next;\nelse \n    msg.payload.next = \"stop\";\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":700,"y":400,"wires":[["f6d6fbb4adba7535"]]},{"id":"e5e97b3ac842e9a9","type":"join","z":"62f51db28f12ad82","name":"","mode":"custom","build":"object","property":"payload","propertyType":"msg","key":"topic","joiner":"\\n","joinerType":"str","accumulate":false,"timeout":"","count":"2","reduceRight":false,"reduceExp":"","reduceInit":"","reduceInitType":"","reduceFixup":"","x":1410,"y":240,"wires":[["d2e62e9eb15cad5b"]]},{"id":"bd8e0e5cde7b2d67","type":"change","z":"62f51db28f12ad82","name":"","rules":[{"t":"set","p":"topic","pt":"msg","to":"Ripe Atlas","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":1130,"y":300,"wires":[["e5e97b3ac842e9a9"]]},{"id":"d999b07b0e15c475","type":"ipdata","z":"62f51db28f12ad82","name":"","infotype":"country,region,coordinates","x":1210,"y":120,"wires":[["e5e97b3ac842e9a9"]]},{"id":"59650c31914d70a5","type":"function","z":"62f51db28f12ad82","name":"get IPv4 and IPv6 addresses","func":"msg.payload = msg.results;\n\nmsg.measuredAddr = new Array();\n\nfor (let i = 0; i < msg.payload.length; i++) {\n\n    if (msg.payload[i].address_v6 == null || msg.payload[i].address_v4 == undefined)\n        msg.measuredAddr[i] = msg.payload[i].address_v4;\n    else\n        msg.measuredAddr[i] = msg.payload[i].address_v6;\n\n}\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":760,"y":220,"wires":[["bd8e0e5cde7b2d67","8c966d2c0cb8493e"]]},{"id":"d2e62e9eb15cad5b","type":"function","z":"62f51db28f12ad82","name":"compare and get finale lists","func":"let probes = msg.payload[\"Ripe Atlas\"];\nlet stored = msg.payload[\"IP2Location\"];\n\nlet measurements = []; //final list of correct and incorrect measurements (with appropriate flag), excluding IP addresses whose information is not in the IP2Location lite database.\nlet m = 0; //index measurements list\n\nlet errorsList = []; //list that contains only the probes with wrong geolocation\nlet e = 0; //index errorsList list\n\nfor(let i=0; i<probes.length; i++) {\n\n    if(stored[i][\"ip\"] == \"?\" || stored[i] == undefined)\n        continue;\n\n    if(probes[i].country_code != stored[i][\"Country code\"]) {\n\n        stored[i][\"Ripe Atlas error\"] = true;\n        stored[i][\"Ripe Atlas CC\"] = probes[i].country_code;\n\n        errorsList[e] = new Object();\n        errorsList[e].ip = stored[i][\"ip\"];\n        errorsList[e].ipNo = stored[i][\"ipNo\"];\n        errorsList[e].RipeAtlasCC = probes[i].country_code;\n        errorsList[e].IP2LocationCC = stored[i][\"Country code\"];\n        errorsList[e].IP2LocationCN = stored[i][\"Country name\"];\n        e++;\n    }\n    else\n        stored[i][\"Ripe Atlas error\"] = false;\n\n    measurements[m] = stored[i];\n    m++;\n}\n\nlet newPayload = [];\nnewPayload[0] = measurements;\nnewPayload[1] = errorsList;\n\nmsg.payload = newPayload;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":1660,"y":240,"wires":[["b8cdeb8220527bf3","0e8e815e7975c01a"]]},{"id":"b8cdeb8220527bf3","type":"function","z":"62f51db28f12ad82","name":"create formatted output","func":"let measurements = msg.payload[0];\nlet errorsList = msg.payload[1];\n\nlet output = new Object();\n\n//Number of measured IP addresses\noutput[\"Analyzed\"] = measurements.length;\n\n//Percentage of incorrect IP addresses\noutput[\"Errors\"] = errorsList.length;\n\n//Total and incorrect number of IP addresses per country\noutput[\"Probes\"] = new Object();\nlet addr = new Object();\nfor (let i = 0; i < measurements.length; i++) {\n\n    let cName = measurements[i][\"Country name\"];\n    if (addr[cName] == null) {\n\n        addr[cName] = new Object();\n        addr[cName][\"tot\"] = 1;\n        addr[cName][\"error\"] = 0;\n    }\n    else\n        addr[cName][\"tot\"]++;\n\n    if (measurements[i][\"Ripe Atlas error\"] == true)\n        addr[cName][\"error\"]++;\n}\n\nfor (let country in addr)\n    output[\"Probes\"][country] = ((addr[country][\"error\"] * 100) / addr[country][\"tot\"]).toFixed(2);\n\n\nmsg.addr = addr;\nmsg.payload = output;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":1930,"y":480,"wires":[["1cba0ba22f9a37fd","22dfb29165c47394","df33db44e51450b1","652eef5f51b7c788","cfa54e541eb5fe86"]]},{"id":"1cba0ba22f9a37fd","type":"json","z":"62f51db28f12ad82","name":"","property":"payload","action":"","pretty":false,"x":2230,"y":480,"wires":[["aea9630f3960cb98"]]},{"id":"7cc7260bab698558","type":"worldmap","z":"62f51db28f12ad82","name":"","lat":"","lon":"","zoom":"5","layer":"OSMG","cluster":"","maxage":"","usermenu":"show","layers":"show","panit":"false","panlock":"false","zoomlock":"false","hiderightclick":"false","coords":"none","showgrid":"false","allowFileDrop":"false","path":"/IPworldmap","overlist":"DR,CO,RA,DN,HM","maplist":"OSMG,OSMC,OSMH,EsriC,EsriS,EsriT,EsriO,EsriDG,NatGeo,UKOS,OS45,OS00,OpTop,HB,AN,ST,SW","mapname":"","mapurl":"","mapopt":"","mapwms":false,"x":2270,"y":240,"wires":[]},{"id":"0e8e815e7975c01a","type":"function","z":"62f51db28f12ad82","name":"make msg for Worldmap","func":"let IPList = new Array();\n\nfor (let i = 0; i < msg.payload[0].length; i++) {\n\n    IPList[i] = new Object();\n    IPList[i].name = msg.payload[0][i].ip;\n    IPList[i].lat = msg.payload[0][i].Latitude;\n    IPList[i].lon = msg.payload[0][i].Longitude;\n\n    if (msg.payload[0][i][\"Ripe Atlas error\"] == true)\n        IPList[i].iconColor = \"red\";\n    else\n        IPList[i].iconColor = \"green\";\n}\n\nmsg.payload = IPList;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2010,"y":240,"wires":[["7cc7260bab698558"]]},{"id":"aea9630f3960cb98","type":"file","z":"62f51db28f12ad82","name":"JSON string write file","filename":"","filenameType":"str","appendNewline":true,"createDir":false,"overwriteFile":"true","encoding":"none","x":2440,"y":480,"wires":[[]]},{"id":"ba10d1b2116760da","type":"ui_chart","z":"62f51db28f12ad82","d":true,"name":"Pie chart","group":"39a6bdfd8256dc3e","order":0,"width":"6","height":"8","label":"Pie chart","chartType":"pie","legend":"false","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":"10","useOneColor":false,"useUTC":false,"colors":["#0095ff","#ff0000","#ff7700","#2ca02c","#c2009e","#12e2b9","#eeff00","#9467bd","#0400ff"],"outputs":1,"useDifferentColor":false,"className":"","x":2420,"y":720,"wires":[["59bf068735bd3328"]]},{"id":"fb00ae37a47ccc29","type":"ui_chart","z":"62f51db28f12ad82","name":"Bar chart","group":"56e2cc61cda611e9","order":4,"width":"11","height":"9","label":"Bar chart","chartType":"bar","legend":"false","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":0,"useOneColor":true,"useUTC":false,"colors":["#1f77b4","#aec7e8","#ff7f0e","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5"],"outputs":1,"useDifferentColor":false,"className":"","x":2420,"y":780,"wires":[[]]},{"id":"22dfb29165c47394","type":"function","z":"62f51db28f12ad82","name":"create charts input","func":"var m = {};\nm.labels = new Array();\nm.series = [\"% wrong probes\"];\nm.data = new Array();\nm.data[0] = new Array();\n\nlet stats = msg.payload;\n\nlet i=0;\nfor(var key in stats[\"Probes\"]) {\n\n    m.labels[i] = key;\n    let value = stats[\"Probes\"][key];\n    m.data[0][i] = value;\n    i++;\n}\n\n\n\nreturn { payload: [m] };","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2190,"y":720,"wires":[["ba10d1b2116760da","fb00ae37a47ccc29","f0878308a31b5a73"]]},{"id":"652eef5f51b7c788","type":"function","z":"62f51db28f12ad82","name":"get tot geolocation errors","func":"msg = { topic: \"Wrong geolocation\", payload: msg.payload.Errors };\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2210,"y":940,"wires":[["dd39e6860101e324"]]},{"id":"df33db44e51450b1","type":"function","z":"62f51db28f12ad82","name":"get tot analyzed IP Address","func":"msg = { topic: \"Analyzed\", payload: msg.payload.Analyzed};\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2200,"y":840,"wires":[["dd39e6860101e324"]]},{"id":"f0878308a31b5a73","type":"ui_text","z":"62f51db28f12ad82","group":"56e2cc61cda611e9","order":3,"width":"0","height":"0","name":"Pie and Bar Charts description","label":"","format":"Graphs representing the percentage of IP addresses analyzed by country with wrong geolocation. \"-\" means the IP address is still unallocated to any countries or reserved.","layout":"col-center","className":"","x":2490,"y":660,"wires":[]},{"id":"59bf068735bd3328","type":"ui_chart","z":"62f51db28f12ad82","d":true,"name":"Pie chart legend","group":"39a6bdfd8256dc3e","order":0,"width":"6","height":"8","label":"Legend","chartType":"pie","legend":"true","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":"","useOneColor":false,"useUTC":false,"colors":["#0095ff","#ff0000","#ff7700","#2ca02c","#c2009e","#12e2b9","#eeff00","#9467bd","#0400ff"],"outputs":1,"useDifferentColor":false,"className":"","x":2600,"y":720,"wires":[[]]},{"id":"dd39e6860101e324","type":"ui_chart","z":"62f51db28f12ad82","name":"Line chart","group":"add94089f5ec5919","order":4,"width":"11","height":"9","label":"Line chart","chartType":"line","legend":"true","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"604800","cutout":0,"useOneColor":false,"useUTC":false,"colors":["#1f77b4","#aec7e8","#ff7f0e","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5"],"outputs":1,"useDifferentColor":false,"className":"","x":2440,"y":900,"wires":[["263ff23604780451"]]},{"id":"263ff23604780451","type":"ui_text","z":"62f51db28f12ad82","group":"add94089f5ec5919","order":4,"width":0,"height":0,"name":"Line Chart description","label":"","format":"Graph representing the variation in the number of IP addresses measured over time and which of these have incorrect geolocation.","layout":"row-spread","className":"","x":2640,"y":900,"wires":[]},{"id":"121ab356c0f510e1","type":"file","z":"62f51db28f12ad82","name":"plain text write file","filename":"","filenameType":"str","appendNewline":true,"createDir":false,"overwriteFile":"true","encoding":"none","x":2430,"y":420,"wires":[[]]},{"id":"cfa54e541eb5fe86","type":"function","z":"62f51db28f12ad82","name":"build output string","func":"let output = \"\\t\\tSTATISTICS\\n\\n\\n\";\n\noutput = output.concat(\"IP Address analyzed: \" + msg.payload.Analyzed + \";\\n\");\noutput = output.concat(\"IP Address with wrong geolocation: \" + msg.payload.Errors + \";\\n\\n\");\n\noutput = output.concat(\"PERCENTAGE OF WRONG PROBES PER COUNTRY:\\n\");\n\nfor(let country in msg.payload.Probes) {\n\n    output = output.concat(country + \": \");\n    output = output.concat(msg.payload.Probes[country] + \"%\\n\");\n}\n\nmsg.payload = output;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2230,"y":420,"wires":[["121ab356c0f510e1"]]},{"id":"8c966d2c0cb8493e","type":"change","z":"62f51db28f12ad82","name":"","rules":[{"t":"set","p":"payload","pt":"msg","to":"measuredAddr","tot":"msg"},{"t":"set","p":"topic","pt":"msg","to":"IP2Location","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":1040,"y":120,"wires":[["d999b07b0e15c475"]]},{"id":"39a6bdfd8256dc3e","type":"ui_group","name":"IP addresses per country","tab":"8a2a5aff8fcce6f7","order":1,"disp":true,"width":"12","collapse":false,"className":""},{"id":"56e2cc61cda611e9","type":"ui_group","name":"Countries and IP Addresses","tab":"31e5bdc115cb7919","order":1,"disp":true,"width":"12","collapse":false,"className":""},{"id":"add94089f5ec5919","type":"ui_group","name":"IP Addresses over time","tab":"31e5bdc115cb7919","order":2,"disp":true,"width":"12","collapse":false,"className":""},{"id":"8a2a5aff8fcce6f7","type":"ui_tab","name":"Statistics","icon":"dashboard","disabled":false,"hidden":false},{"id":"31e5bdc115cb7919","type":"ui_tab","name":"IP Statistics","icon":"dashboard","disabled":false,"hidden":false}]

**How to run the flow:**

 - Install [*loop node*](https://flows.nodered.org/node/node-red-contrib-loop):
Run `npm install node-red-contrib-loop` in your Node-RED user directory;

 - Install [*worldmap node*](https://flows.nodered.org/node/node-red-contrib-web-worldmap):
Run `npm install node-red-contrib-web-worldmap` in your Node-RED user directory;

 - Install [*dashboard nodes*](https://github.com/node-red/node-red-dashboard):
Run `npm install node-red-dashboard` in your Node-RED user directory;

 - Restart your Node-RED instance; the above new nodes should now be available in your palette;

 - Copy the JSON flow code from paragraph above;
 
 - In the GUI, *Menu* -> *Import* -> Paste JSON code and click *Import* button. 

 - Select the possible types of output before starting the flow, as explained in the paragraph below.

**Output types:**
 - *Plain text / JSON string on file*. Set the absolute path of the files in edit mode of *write file nodes* (named *"plain text write file"* and *"JSON string write file"*) to write a text file and a JSON file. The write nodes will create new files if they don't exist. To open edit mode click twice on these nodes; to save select the red button "*Done*".
  
 - *World map with markers*. Open http://localhost:1880/IPworldmap and make sure that under the worldmap node in the imported flow there is the text "connected 1" with green dot. When you'll trigger the flow and *msg* arrives to *worldmap node*, markers will start loading. If the number of IP Addresses is very large, it will take some minutes for them to appear on the map.
   
 - *Bar / Pie and Line chart*. If dashboard nodes have an orange/red triangle over them, start the edit mode by double-clicking them and select "Done" (nodes "Pie and Bar Charts description", "Pie chart", "Pie chart legend", "Bar chart", "Line chart", "Line Chart description"). Open the dashboard in http://localhost:1880/ui . If you have used dashboard nodes before in other flows click “IP Statistics” from side menu. When you'll trigger the flow and *msg* will arrive to *chart nodes*, data will start loading.
 

**Final steps:**

 - Click the red button *Deploy* in the top right of the page. If everything has been set properly, no error will be shown and no node will have the blue dot or the orange/red triangle.

 - **To run the flow, click on the left side button of the inject node.** You will see the text "looping" under the Condition loop node and "requesting" under the "probes API request" node while running the loop. It may takes a few minutes to get the previously described outputs.
