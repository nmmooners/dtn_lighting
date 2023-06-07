const fs = require('fs');
const QuadKey = require('quadkeytools');

function lightingRead() { 
    fs.readFile('lightning.json', 'utf8', (err, data) => {
        if(err) {
            console.error('Error reading lighting file: ', err);
            return;
        }

        try{
            var ojbectCount = 0;
            var c2g = 0; // 0
            var c2c = 0; // 1
            var hb = 0;  // 9
            var lightErr = 0;
            // Parse the JSON data into an array of objects
            const jsonArray = data.split('\n').filter(line => line.trim() !== '').map(JSON.parse);
            jsonArray.forEach(jsonOjbect => {
                console.log('json object: ', jsonOjbect);
                ojbectCount++;
                switch(jsonOjbect.flashType) {
                    case 0:
                        c2g++;
                        break;
                    case 1:
                        c2c++;
                        break;
                    case 9: 
                        hb++;
                        break;
                    default:
                        lightErr++;
                };
                var qk = require('quadkeytools'), location = {lat: jsonOjbect.latitude, lng: jsonOjbect.longitude}, detail = 12, key = qk.locationToQuadkey(location, detail);
                console.log('###### quadkey: ', key);
            });
            
            console.log("---- total entries: ", ojbectCount);
            console.log("---- c2g: ", c2g);
            console.log("---- c2c: ", c2c);
            console.log("---- hb: ", hb);
            console.log("---- err: ", lightErr);
        } catch (fileReadError) {
            console.log('Error Parsing Json File', fileReadError);
        }
    });
}

function assetsRead() {
    fs.readFile('assets.json', 'utf8', (err, data) => {
        if(err) {
            console.error('Error reading assets file: ', err);
            return;
        }

        try{
            var ojbectCount = 0;
            // var c2g = 0; // 0
            // var c2c = 0; // 1
            // var hb = 0;  // 9
            // var lightErr = 0;
            // Parse the JSON data into an array of objects
            const jsonAssetsArray = data.split('\n').filter(line => line.trim() !== '').map(JSON.parse);
            jsonAssetsArray.forEach(jsonOjbect => {
                console.log('json object: ', jsonOjbect);
                ojbectCount++;
            });
        }catch (fileReadError) {
            console.log('Error Parsing Json File', fileReadError);
        }
    });
}

lightingRead();
// assetsRead();
// lightingAnalysis();