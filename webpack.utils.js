const mode = process.env.NODE_ENV;
const emulators = process.env.FIREBASE_EMULATORS === 'true';

console.log(`
====================================

##   ## ####### ######  ######   #####   #####  ##   ##
##   ## ##      ##   ## ##   ## ##   ## ##   ## ##   ##
##   ## ##      ##   ## ##   ## ##   ## ##      ##  ## 
## # ## #####   ######  ######  ####### ##      #####  
## # ## ##      ##   ## ##      ##   ## ##      ##  ## 
## # ## ##      ##   ## ##      ##   ## ##   ## ##   ##
 #####  ####### ######  ##      ##   ##  #####  ##    ##

[NODE_ENV]: ${mode}

====================================

`);