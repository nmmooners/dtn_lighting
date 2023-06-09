const fs = require('fs');
const QKey = require('quadkeytools');
const binTree = require('bintrees').BinTree;


// function to get quadKey using the quadkeytools library
// parameters:
// inLong: longitude in degrees
// inLat: latitude in degrees
// return: quadKey value determined by long and lat variables
function getQuadkey(inLong, inLat) {
    var location = {lat: inLat, lng: inLong}
    var detail = 12
    var key = QKey.locationToQuadkey(location, detail);
    return key;
}

// function to read in assets.json file and store the assets in 
// a binary tree. 
// returns a promise for the completed tree variable to be filled populated
// if an issue happens with reading in the json object and error is returned in the promise. 
function readAssets() {
    return new Promise((resolve, reject) => {
        var tree = new binTree(function(a,b) {a.quadKey - b.quadKey;});
        var jsonAssetsArray = [{}];
        fs.readFile('assets.json', 'utf8', (err, data) => {
            if(err) {
                console.error('Error reading assets file: ', err);
                return;
            }
            try{
                jsonAssetsArray = data.split('\n').filter(line => line.trim() !== '').map(JSON.parse);
            } catch (fileReadError) {
                console.log('Error Parsing Json File', fileReadError);
                reject(fileReadError);
            }
            jsonAssetsArray.forEach(assets => {
                    assets.forEach(asset => {
                        tree.insert(asset);
                    });
                });
            resolve(tree);               
        });
    });
}

// main starting function to calculate and find the correct assets for a givin cooridinate
// function calls readAssets() function and when a successful object is returned 
// the lighting.json file is read in as well. 
// the assets are then searched for a matching quadKey and 
// prints to console "lightning alert for 6720:Dante Street"
function lightingRead() { 
    readAssets().then(assetTree => {
        console.log('tree is here: ', assetTree.size);
        var jsonArray = [];
        fs.readFile('lightning.json', 'utf8', (err, data) => {
            if(err) {
                console.error('Error reading lighting file: ', err);
                return;
            }
            try{
                // Parse the JSON data into an array of objects
                jsonArray = data.split('\n').filter(line => line.trim() !== '').map(JSON.parse);
                
            } catch (fileReadError) {
                console.log('Error Parsing Json File', fileReadError);
            }
            const alreadyAlertArray = [];
            jsonArray.forEach(jsonOjbect => {
                var qk = getQuadkey(jsonOjbect.longitude, jsonOjbect.latitude);
                if(!alreadyAlertArray.includes(qk)){
                    assetTree.each(ea => {
                        if(ea.quadKey === qk) {
                            console.log('lightning alert for ' + ea.assetOwner + ":" + ea.assetName);
                            alreadyAlertArray.push(qk);
                            return;
                        }                                   
                    })                       
                }               
            });
            console.log("------- alertAlready: ", alreadyAlertArray.length);
        })
    })
    .catch(err => {
        console.error('tree did not work', err);
    });
}


lightingRead();