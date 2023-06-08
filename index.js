const fs = require('fs');


function getQuadkey(inLong, inLat) {
    var qk = require('quadkeytools'), location = {lat: inLat, lng: inLong}, detail = 12, key = qk.locationToQuadkey(location, detail);
    // console.log('###### quadkey: ', key);
    return key;
}

function getQuadAsset(inQuadKey) {
    fs.readFile('assets.json', 'utf8', (err, data) => {
        if(err) {
            console.error('Error reading assets file: ', err);
            return;
        }

        try{
            var objectCount = 0;
            const jsonAssetsArray = data.split('\n').filter(line => line.trim() !== '').map(JSON.parse);

            jsonAssetsArray.forEach(jsonObject => {
                jsonObject.forEach(jsonObject2 => {
                    console.log('jsonObject2: ', jsonObject2.quadKey);
                    objectCount++;
                })
                
            })
        }catch (fileReadError) {
            console.log('Error Parsing Json File', fileReadError);
        }
    });
}

function readAssets() {
    return new Promise((resolve, reject) => {
        var binTree = require('bintrees').BinTree;
        var tree = new binTree(function(a,b) {a.quadKey - b.quadKey;});

        fs.readFile('assets.json', 'utf8', (err, data) => {
            if(err) {
                console.error('Error reading assets file: ', err);
                return;
            }
            try{
                const jsonAssetsArray = data.split('\n').filter(line => line.trim() !== '').map(JSON.parse);

                jsonAssetsArray.forEach(assets => {
                    assets.forEach(asset => {
                        tree.insert(asset);
                    });
                });

                console.log('tree was made: ', tree.size);
                resolve(tree);
            } catch (fileReadError) {
                console.log('Error Parsing Json File', fileReadError);
                reject(fileReadError);
            };                
        });
    });
}

function lightingRead() { 

    readAssets().then(assetTree => {
        console.log('tree is here: ', assetTree.size);
        
        const alreadyAlertArray = [];
        fs.readFile('lightning.json', 'utf8', (err, data) => {
            if(err) {
                console.error('Error reading lighting file: ', err);
                return;
            }
            try{
                // Parse the JSON data into an array of objects
                const jsonArray = data.split('\n').filter(line => line.trim() !== '').map(JSON.parse);
                jsonArray.forEach(jsonOjbect => {
                    qk = getQuadkey(jsonOjbect.longitude, jsonOjbect.latitude);
                    if(!alreadyAlertArray.includes(qk)){
                        assetTree.each(ea => {
                            if(ea.quadKey === qk) {
                                console.log('Lightning strike for ' + ea.assetOwner + ":" + ea.assetName);
                                return;
                            }                                              
                        })
                        alreadyAlertArray.push(qk);
                    }
                });
            } catch (fileReadError) {
                console.log('Error Parsing Json File', fileReadError);
            }
        })
    })
    .catch(err => {
        console.error('tree did not work', err);
    });
}


// readAssets();
lightingRead();
// assetsRead();
// lightingAnalysis();