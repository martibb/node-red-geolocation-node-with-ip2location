


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

Example of a possible node configuration, with two options selected:

![IPData edit mode with Data type input not clicked.](https://user-images.githubusercontent.com/112756894/190022018-ec8c1895-4acb-42d3-98ef-a3c1491da09d.png)

![IPData edit mode with Data type input clicked and two options selected.](https://user-images.githubusercontent.com/112756894/190022108-b8062d10-c185-4c4d-96b0-4a26e5835105.png)

*IPData edit mode, with *Data type* and *Name* properties. Data type allows to select options with a multiple select box. Name is a property owned by all nodes that allows you to change node name on the workspace.*

## An example of Node-RED flow that uses IPData



This is a Node-RED flow that compares the geographical information of RIPE Atlas probes with the geographical information extracted by IPData. 

In particular: 
 - the flow retrives the list of connected probes belonging to the RIPE Atlas monitoring system;
 - Atlas holds some geographical information about its probes; such information is generally provided by the user hosting the probe at installation time; 
 - the flow downloads the geographical information of every probe as contained in the Atlas DB;

![First part of the flow, with nodes forming a loop and a single function node getting IPv4 and IPv6 addresses.](https://user-images.githubusercontent.com/112756894/190022223-f120a036-89aa-4951-878a-dd7125eca4a5.png)

*The first part of the flow. These nodes retrieve the list of connected probes and download the relative geographical information from Atlas DB.*

 - the flow uses the IP address of each probe to retrieve the geographical information contained in the IP2Location database using the IPData node; 
 - the geographical information in the Atlas DB is compared to the one extracted from IP2Location so to highlight possible inconsistencies (e.g. wrong configuration of a probe during installation time);

![Use of the IPData node to obtain geolocation data from IP2Location. Merging IP2Location and Ripe Atlas data through a join node and then comparison to a function node.](https://user-images.githubusercontent.com/112756894/190022375-185abfe3-37c3-441e-8652-1a618402662d.png)

*This flow part retrieve geographical information contained in the IP2Location DB with IPData node. The IPData output is merged using join node with geolocation data from Ripe Atlas retrieved before. The resulted msg is used to compare data from both services and detect possible inconsistencies.*

 - results are shown on a map; different colors are used depending on if the geolocation information seems to be correct or it is possibly wrong;

![Flow part with nodes for building a world map.](https://user-images.githubusercontent.com/112756894/190023140-5ae5fbe6-99a9-4b6b-b457-76abae642245.png)

*This flow parts creates: IP addresses markers on a worldmap with correct and uncorrect geolocation data with different colors.*

 - the flow finally provides its output also in a file and using some charts. 

![The last part of the flow, with nodes for building an output on two types of file and for building charts.](https://user-images.githubusercontent.com/112756894/190023329-75db7975-76cb-44d4-aefd-5be4572bdc1c.png)

*The last part of the flow with nodes that provide output on txt and json file, Bar/Pie chart and Line chart.* 

The flow is an example of low-code application that uses the location information provided by the DB11 IP2Location database. 



**Flow JSON Code:**

    [{"id":"07a949fc5d3bdff4","type":"loop","z":"2ad2a03052653bab","name":"","kind":"cond","count":"","initial":"1","step":"1","condition":"msg.payload.next != \"stop\"","conditionType":"js","when":"after","enumeration":"enum","enumerationType":"msg","limit":"","loopPayload":"loop-keep","finalPayload":"final-count","x":420,"y":1360,"wires":[["6d196ddd8c58c756"],["e364bf04e186028e"]]},{"id":"d8c4d83192aff20d","type":"inject","z":"2ad2a03052653bab","name":"","props":[{"p":"payload"},{"p":"topic","vt":"str"},{"p":"results","v":"[]","vt":"jsonata"}],"repeat":"","crontab":"","once":false,"onceDelay":0.1,"topic":"","payload":"https://atlas.ripe.net/api/v2/probes?page_size=500&status_name=Connected","payloadType":"str","x":130,"y":1360,"wires":[["07a949fc5d3bdff4"]]},{"id":"7b65bd1fba09f9a4","type":"http request","z":"2ad2a03052653bab","name":"Probe API","method":"GET","ret":"obj","paytoqs":"ignore","url":"","tls":"","persist":false,"proxy":"","authType":"","senderr":false,"headers":[],"x":380,"y":1700,"wires":[["e909dc3aaad43224"]]},{"id":"e364bf04e186028e","type":"change","z":"2ad2a03052653bab","name":"","rules":[{"t":"set","p":"url","pt":"msg","to":"payload","tot":"msg"}],"action":"","property":"","from":"","to":"","reg":false,"x":210,"y":1700,"wires":[["7b65bd1fba09f9a4"]]},{"id":"e909dc3aaad43224","type":"function","z":"2ad2a03052653bab","name":"get embedded pages","func":"for(let i=0; i<msg.payload.results.length; i++)\n    msg.results.push(msg.payload.results[i]);\n\nif(msg.payload.next!=null)\n    msg.payload = msg.payload.next;\nelse \n    msg.payload.next = \"stop\";\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":600,"y":1700,"wires":[["07a949fc5d3bdff4"]]},{"id":"eba887f753073156","type":"join","z":"2ad2a03052653bab","name":"","mode":"custom","build":"object","property":"payload","propertyType":"msg","key":"topic","joiner":"\\n","joinerType":"str","accumulate":false,"timeout":"","count":"2","reduceRight":false,"reduceExp":"","reduceInit":"","reduceInitType":"","reduceFixup":"","x":1330,"y":1380,"wires":[["a74036ca15981990"]]},{"id":"d02834e6838d1ab8","type":"change","z":"2ad2a03052653bab","name":"","rules":[{"t":"set","p":"topic","pt":"msg","to":"Ripe Atlas","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":1050,"y":1440,"wires":[["eba887f753073156"]]},{"id":"0da8bc097f0d5404","type":"ipdata","z":"2ad2a03052653bab","name":"","infotype":"country,region,coordinates","x":1130,"y":1260,"wires":[["eba887f753073156"]]},{"id":"6d196ddd8c58c756","type":"function","z":"2ad2a03052653bab","name":"get IPv4 and IPv6 addresses","func":"msg.payload = msg.results;\n\nmsg.addrMeasured = new Array();\n\nfor (let i = 0; i < msg.payload.length; i++) {\n\n    if (msg.payload[i].address_v6 == null || msg.payload[i].address_v4 == undefined)\n        msg.addrMeasured[i] = msg.payload[i].address_v4;\n    else\n        msg.addrMeasured[i] = msg.payload[i].address_v6;\n\n}\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":680,"y":1360,"wires":[["d02834e6838d1ab8","87bffe46f629677d"]]},{"id":"a74036ca15981990","type":"function","z":"2ad2a03052653bab","name":"compare and get finale lists","func":"let probes = msg.payload[\"Ripe Atlas\"];\nlet stored = msg.payload[\"IP2Location\"];\n\nlet measurements = []; //lista finale delle misurazioni corrette ed errate (con flag opportuno), esclusi gli indirizzi IP le cui informazioni non sono all'interno del database lite di IP2Location\nlet m = 0; //indice lista measurements\n\nlet errorsList = []; //lista che contiene esclusivamente le probe errate\nlet e = 0; //indice lista errorsList\n\nfor(let i=0; i<probes.length; i++) {\n\n    if(stored[i][\"ip\"] == \"?\" || stored[i] == undefined)\n        continue;\n\n    if(probes[i].country_code != stored[i][\"Country code\"]) {\n\n        stored[i][\"Ripe Atlas error\"] = true;\n        stored[i][\"Ripe Atlas CC\"] = probes[i].country_code;\n\n        errorsList[e] = new Object();\n        errorsList[e].ip = stored[i][\"ip\"];\n        errorsList[e].ipNo = stored[i][\"ipNo\"];\n        errorsList[e].RipeAtlasCC = probes[i].country_code;\n        errorsList[e].IP2LocationCC = stored[i][\"Country code\"];\n        errorsList[e].IP2LocationCN = stored[i][\"Country name\"];\n        e++;\n    }\n    else\n        stored[i][\"Ripe Atlas error\"] = false;\n\n    measurements[m] = stored[i];\n    m++;\n}\n\nlet newPayload = [];\nnewPayload[0] = measurements;\nnewPayload[1] = errorsList;\n\nmsg.payload = newPayload;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":1580,"y":1380,"wires":[["2d6d3eb5e0c0b997","34c6587f7fef533d"]]},{"id":"2d6d3eb5e0c0b997","type":"function","z":"2ad2a03052653bab","name":"create formatted output","func":"let measurements = msg.payload[0];\nlet errorsList = msg.payload[1];\n\nlet output = new Object();\n\n//Numero di indirizzi IP misurati\noutput[\"Analyzed\"] = measurements.length;\n\n//% di indirizzi IP errati\noutput[\"Errors\"] = errorsList.length;\n\noutput[\"Probes\"] = new Object();\n//Numero di indirizzi IP per nazione errati\nlet addr = new Object();\nfor (let i = 0; i < measurements.length; i++) {\n\n    let cName = measurements[i][\"Country name\"];\n    if (addr[cName] == null) {\n\n        addr[cName] = new Object();\n        addr[cName][\"tot\"] = 1;\n        addr[cName][\"error\"] = 0;\n    }\n    else\n        addr[cName][\"tot\"]++;\n\n    if (measurements[i][\"Ripe Atlas error\"] == true)\n        addr[cName][\"error\"]++;\n}\n\n//Percentuale di indirizzi IP per nazione errati\nfor (let country in addr) {\n    \n    output[\"Probes\"][country] = ((addr[country][\"error\"] * 100) / addr[country][\"tot\"]).toFixed(2);\n}\n\nmsg.addr = addr;\nmsg.payload = output;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":1870,"y":1580,"wires":[["666e240324020214","95b227316b4e6f14","c2306037ba981c0f","dea3916bf8eef689","d7248b02973ecbf7"]]},{"id":"666e240324020214","type":"json","z":"2ad2a03052653bab","name":"","property":"payload","action":"","pretty":false,"x":2110,"y":1560,"wires":[["83dc9628949ebd35"]]},{"id":"5db4259db466441d","type":"worldmap","z":"2ad2a03052653bab","name":"","lat":"","lon":"","zoom":"5","layer":"OSMG","cluster":"","maxage":"","usermenu":"show","layers":"show","panit":"false","panlock":"false","zoomlock":"false","hiderightclick":"false","coords":"none","showgrid":"false","allowFileDrop":"false","path":"/IPworldmap","overlist":"DR,CO,RA,DN,HM","maplist":"OSMG,OSMC,OSMH,EsriC,EsriS,EsriT,EsriO,EsriDG,NatGeo,UKOS,OS45,OS00,OpTop,HB,AN,ST,SW","mapname":"","mapurl":"","mapopt":"","mapwms":false,"x":2190,"y":1380,"wires":[]},{"id":"34c6587f7fef533d","type":"function","z":"2ad2a03052653bab","name":"make msg for Worldmap","func":"let IPList = new Array();\n//let redPoints = 0;\n\nfor (let i = 0; i < msg.payload[0].length; i++) {\n\n    IPList[i] = new Object();\n    IPList[i].name = msg.payload[0][i].ip;\n    IPList[i].lat = msg.payload[0][i].Latitude;\n    IPList[i].lon = msg.payload[0][i].Longitude;\n\n    if (msg.payload[0][i][\"Ripe Atlas error\"] == true) {\n        IPList[i].iconColor = \"red\";\n\n        /*if(msg.payload[0][i][\"Country code\"]!=\"-\")\n            redPoints++;*/\n    }\n    else\n        IPList[i].iconColor = \"green\";\n}\n\nmsg.payload = IPList;\n//msg.payload[1] = redPoints;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":1930,"y":1380,"wires":[["5db4259db466441d"]]},{"id":"83dc9628949ebd35","type":"file","z":"2ad2a03052653bab","name":"JSON string write file","filename":"C:\\Users\\Martina\\Desktop\\unicorsa\\Tesi\\Flow di prova\\jsonStats.json","filenameType":"str","appendNewline":true,"createDir":false,"overwriteFile":"true","encoding":"none","x":2380,"y":1560,"wires":[[]]},{"id":"10457b3a4748bf65","type":"ui_chart","z":"2ad2a03052653bab","d":true,"name":"Pie chart","group":"39a6bdfd8256dc3e","order":0,"width":"6","height":"8","label":"Pie chart","chartType":"pie","legend":"false","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":"10","useOneColor":false,"useUTC":false,"colors":["#0095ff","#ff0000","#ff7700","#2ca02c","#c2009e","#12e2b9","#eeff00","#9467bd","#0400ff"],"outputs":1,"useDifferentColor":false,"className":"","x":2420,"y":1720,"wires":[["2d256089f1cc19a2"]]},{"id":"25317c503d3b615d","type":"ui_chart","z":"2ad2a03052653bab","name":"Bar chart","group":"56e2cc61cda611e9","order":4,"width":"11","height":"9","label":"Bar chart","chartType":"bar","legend":"false","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":0,"useOneColor":true,"useUTC":false,"colors":["#1f77b4","#aec7e8","#ff7f0e","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5"],"outputs":1,"useDifferentColor":false,"className":"","x":2420,"y":1780,"wires":[[]]},{"id":"95b227316b4e6f14","type":"function","z":"2ad2a03052653bab","name":"create charts input","func":"let m = {};\nm.labels = new Array();\nm.series = [\"% probes with incorrect geolocation\"];\nm.data = new Array();\nm.data[0] = new Array();\n\nlet stats = msg.payload;\n\nlet i=0;\nfor(var key in stats[\"Probes\"]) {\n\n    m.labels[i] = key;\n    let value = stats[\"Probes\"][key];\n    m.data[0][i] = value;\n    i++;\n}\n\nreturn { payload: [m] };","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2150,"y":1720,"wires":[["10457b3a4748bf65","25317c503d3b615d","500f3e4f0c10d97e"]]},{"id":"dea3916bf8eef689","type":"function","z":"2ad2a03052653bab","name":"get tot geolocation errors","func":"msg = { topic: \"Wrong geolocation\", payload: msg.payload.Errors };\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2170,"y":1940,"wires":[["db97e017db999550"]]},{"id":"c2306037ba981c0f","type":"function","z":"2ad2a03052653bab","name":"get tot analyzed IP Address","func":"msg = { topic: \"Analyzed\", payload: msg.payload.Analyzed};\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2180,"y":1840,"wires":[["db97e017db999550"]]},{"id":"500f3e4f0c10d97e","type":"ui_text","z":"2ad2a03052653bab","group":"56e2cc61cda611e9","order":3,"width":0,"height":0,"name":"Pie and Bar Charts description","label":"","format":"Graphs representing the number of IP addresses analyzed by country with wrong geolocation. \"-\" means the IP address is still unallocated to any countries or reserved.","layout":"col-center","className":"","x":2490,"y":1660,"wires":[]},{"id":"2d256089f1cc19a2","type":"ui_chart","z":"2ad2a03052653bab","d":true,"name":"Pie chart legend","group":"39a6bdfd8256dc3e","order":0,"width":"6","height":"8","label":"Legend","chartType":"pie","legend":"true","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"3600","cutout":"","useOneColor":false,"useUTC":false,"colors":["#0095ff","#ff0000","#ff7700","#2ca02c","#c2009e","#12e2b9","#eeff00","#9467bd","#0400ff"],"outputs":1,"useDifferentColor":false,"className":"","x":2600,"y":1720,"wires":[[]]},{"id":"db97e017db999550","type":"ui_chart","z":"2ad2a03052653bab","name":"Line chart","group":"add94089f5ec5919","order":4,"width":"11","height":"9","label":"Line chart","chartType":"line","legend":"true","xformat":"HH:mm:ss","interpolate":"linear","nodata":"","dot":false,"ymin":"","ymax":"","removeOlder":1,"removeOlderPoints":"","removeOlderUnit":"604800","cutout":0,"useOneColor":false,"useUTC":false,"colors":["#1f77b4","#aec7e8","#ff7f0e","#2ca02c","#98df8a","#d62728","#ff9896","#9467bd","#c5b0d5"],"outputs":1,"useDifferentColor":false,"className":"","x":2420,"y":1900,"wires":[["a1d847d3c79d554c"]]},{"id":"a1d847d3c79d554c","type":"ui_text","z":"2ad2a03052653bab","group":"add94089f5ec5919","order":4,"width":0,"height":0,"name":"Line Chart description","label":"","format":"Graph representing the variation in the number of IP addresses measured over time and which of these have incorrect geolocation.","layout":"row-spread","className":"","x":2620,"y":1900,"wires":[]},{"id":"780e8c0d7984b6b0","type":"file","z":"2ad2a03052653bab","name":"plain text write file","filename":"C:\\Users\\Martina\\Desktop\\unicorsa\\Tesi\\Flow di prova\\stats.txt","filenameType":"str","appendNewline":true,"createDir":false,"overwriteFile":"true","encoding":"none","x":2370,"y":1500,"wires":[[]]},{"id":"d7248b02973ecbf7","type":"function","z":"2ad2a03052653bab","name":"build output string","func":"let output = \"\\t\\tSTATISTICS\\n\\n\\n\";\n\noutput = output.concat(\"IP Address analyzed: \" + msg.payload.Analyzed + \";\\n\");\noutput = output.concat(\"IP Address with wrong geolocation: \" + msg.payload.Errors + \";\\n\\n\");\n\noutput = output.concat(\"NUMBER OF PROBES PER COUNTRY:\\n\");\n\nfor(let country in msg.payload.Probes) {\n\n    output = output.concat(country + \": \");\n    output = output.concat(msg.payload.Probes[country] + \"\\n\");\n}\n\nmsg.payload = output;\n\nreturn msg;","outputs":1,"noerr":0,"initialize":"","finalize":"","libs":[],"x":2150,"y":1500,"wires":[["780e8c0d7984b6b0"]]},{"id":"87bffe46f629677d","type":"change","z":"2ad2a03052653bab","name":"","rules":[{"t":"set","p":"payload","pt":"msg","to":"addrMeasured","tot":"msg"},{"t":"set","p":"topic","pt":"msg","to":"IP2Location","tot":"str"}],"action":"","property":"","from":"","to":"","reg":false,"x":960,"y":1260,"wires":[["0da8bc097f0d5404"]]},{"id":"39a6bdfd8256dc3e","type":"ui_group","name":"IP addresses per country","tab":"8a2a5aff8fcce6f7","order":1,"disp":true,"width":"12","collapse":false,"className":""},{"id":"56e2cc61cda611e9","type":"ui_group","name":"Countries and IP Addresses","tab":"31e5bdc115cb7919","order":1,"disp":true,"width":"12","collapse":false,"className":""},{"id":"add94089f5ec5919","type":"ui_group","name":"IP Addresses over time","tab":"31e5bdc115cb7919","order":2,"disp":true,"width":"12","collapse":false,"className":""},{"id":"8a2a5aff8fcce6f7","type":"ui_tab","name":"Statistics","icon":"dashboard","disabled":false,"hidden":false},{"id":"31e5bdc115cb7919","type":"ui_tab","name":"IP Statistics","icon":"dashboard","disabled":false,"hidden":false}]

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

![World map with possible configuration of green and red markers.](https://user-images.githubusercontent.com/112756894/190023538-7410add0-61fc-47cf-b05d-5e951c899bbd.png)

*Possible position of RIPE Atlas probes on world map. The markers correspond to the positions associated with the IP addresses with correct geolocation in the case of green color, probably incorrect in the case of red.*
   
 - *Bar / Pie and Line chart*. If dashboard nodes have an orange/red triangle over them, start the edit mode by double-clicking them and select "Done" (nodes "Pie and Bar Charts description", "Pie chart", "Pie chart legend", "Bar chart", "Line chart", "Line Chart description"). Open the dashboard in http://localhost:1880/ui . If you have used dashboard nodes before in other flows click “IP Statistics” from side menu. When you'll trigger the flow and *msg* will arrive to *chart nodes*, data will start loading.

![Bar chart with possible configuration of bars.](https://user-images.githubusercontent.com/112756894/190845483-325d6500-4ce6-4c84-b6a1-e0e77f315847.png)

 *Possible bar chart output. It's possible to view wrong probes percentage when hovering over a bar.*


**Final steps:**

 - Click the red button *Deploy* in the top right of the page. If everything has been set properly, no error will be shown and no node will have the blue dot or the orange/red triangle.

 - **To run the flow, click on the left side button of the inject node.** You will see the text "looping" under the Condition loop node and "requesting" under the "probes API request" node while running the loop. It may takes a few minutes to get the previously described outputs.
