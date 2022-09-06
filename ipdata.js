module.exports = function(RED) {

    const {IP2Location} = require("ip2location-nodejs");
    let ip2location = new IP2Location();

    function getData(msg, infotypeString) {

        ip2location.open(".\\.node-red\\node_modules\\node-red-contrib-ipdata\\IP2LOCATION-LITE-DB11.IPV6.BIN");

        testip = msg.payload;

        let result = new Array();
        for (let x = 0; x < testip.length; x++) {
            result[x] = ip2location.getAll(testip[x]);
        }

        let infotype = new Array();
        infotype = infotypeString.split(",");

        let output = buildOutputPayload(testip, infotype, result);

        ip2location.close();

        return output;
    }

    function buildOutputPayload(testip, infotype, result) {

        let output = new Array();

        for(let i=0; i<testip.length; i++) {

            output[i] = new Object();
            output[i]["ip"] = result[i]["ip"];
            output[i]["ipNo"] = result[i]["ipNo"];

            for(let j=0; j<infotype.length; j++) {

                if(result[i]["countryShort"]=="INVALID_IP_ADDRESS" || !testip[i])
                    break;

                if(infotype[j]=="country") {

                    output[i]["Country code"] = result[i]["countryShort"];
                    output[i]["Country name"] = result[i]["countryLong"];
                }
                    
                else if(infotype[j]=="region")
                    output[i]["Region"] = result[i]["region"];
                
                else if(infotype[j]=="city")
                    output[i]["City"] = result[i]["city"];
                
                else if(infotype[j]=="zipcode")
                    output[i]["Zip code"] = result[i]["zipCode"];
                
                else if(infotype[j]=="coordinates") {

                    output[i]["Latitude"] = result[i]["latitude"];
                    output[i]["Longitude"] = result[i]["longitude"];
                }

                else
                    output[i]["Time zone"] = result[i]["timeZone"];
            }
        }

        return output;
    }

    function ipDataNode(config) {

        RED.nodes.createNode(this,config);

        this.infotype = config.infotype || "country";
        let node = this;

        node.on('input', function(msg) {

            msg.payload = getData(msg, node.infotype);
            node.send(msg);
        });
    }
    RED.nodes.registerType("ipdata",ipDataNode);
}