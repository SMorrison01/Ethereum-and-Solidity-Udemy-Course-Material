const path = require('path');
const fs = require('fs');
const solc = require('solc');

const inboxPath = path.resolve(__dirname, 'contracts','Inbox.sol');
const source = fs.readFileSync(inboxPath, 'utf8');

//exported contracts have 2 properties: byte code and interface (ABI) 
module.exports = solc.compile(source, 1).contracts[':Inbox'];