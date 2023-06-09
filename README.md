# Nathan Moore DTN Lighting take home
 
### [Bitbucket Source](https://bitbucket.org/dtnse/lightning-alert/src/master/)

### Files used as-is from Bitbucket source
    * assets.json
    * lightning.json

All commands are run from the root directory
```
# install all dependancies
npm install

# lint
npm run lint

# run script
npm run start
```

### Additional Questions
    ###### "What is the time complexity for determining if a strike has occurred for a particular asset?"
        1. O(n) (implented with in order search)
    ###### "If we put this code into production, but found it too slow, or it needed to scale to many more users or more frequent strikes, what are the first things you would think of to speed it up?"
        1. First off I would add a function to better compare the objects for matching quadKey value. 
        The current set up has the whole json object in the tree and searching for the whole object using .find() is not usable as I am currently only looking for the quadKey and do not have the assetName or the assethOwner. 
        This would require a new function to only compare the quadKey property. 
        This would allow for the BST to be used more effectively. 
        2. I would also want the to set the information that is in the asset.json file to be in a database that would allow for a larger data set to be used when searching. 
        The larger the assets.json file becomes, the longer it would take to read the data in as well as searching it. 
        3. For dealing with more frequent strikes, I would want to have a time frame as to when strikes would still count as "alerted".
        Having that would allow the system to have a new notification built into it by default. 
        4. I would also like to have the "already alerted" infomation stored in redis in order to have faster look up as well as be able to keep the "last strike time" in order to have the new notification discussed above quickly accessable. 
        