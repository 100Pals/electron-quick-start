const https = require('https');

class SteamAPI{
    constructor(api_key){
        this.api_key = api_key;
        this.options = {
            hostname: 'api.steampowered.com',
            port: 443
        }
    }

    User_GetPlayerSummaries(steamids){
        // TODO: Logic to allow steamids to be an array
        var path = '/ISteamUser/GetPlayerSummaries/v2/?format=json&'
        path += "key=" + this.api_key + "&steamids=" + steamids
        var options = this.options
        options.path = path
        options.method = 'GET'

        var data;
        //making the https get call
        var getReq = https.request(options, function(res) {
            console.log("\nstatus code: ", res.statusCode);
            res.on('data', function(data) {
                console.log( JSON.parse(data)['response']['players'][0] );
                return JSON.parse(data);
            });
        });
    
        //end the request
        getReq.end();
        getReq.on('error', function(err){
            console.log("Error: ", err);
        }); 
    }
}

module.exports = SteamAPI