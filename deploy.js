const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');
const {interface, bytecode} = require('./compile');

//we here create a provider object that connects to our account. 
//we enter the mnuemonic and the link/connection to a network as arguments
const provider = new HDWalletProvider('twelve word mnemonic'
,'https://rinkeby.infura.io/eoUgOaR3P3ypH0gE7mCE');

const web3 = new Web3(provider);

//we want to use async, but we can not do this outside of a function, so we create a helper function for this
const deploy = async () => {
    const accounts = await web3.eth.getAccounts(); //this generates many accounts associated with the mnuemonic
    //thus, we will illustrate how we are specifying to use the first account
    console.log('Attempting to deploy from first account: ', accounts[0]);

    const result = await new web3.eth.Contract(JSON.parse(interface))
    .deploy({ data: '0x' + bytecode, arguments: ['Hi there!'] })
    .send({gas: '1000000', from: accounts[0]});

    console.log('Contract deployed to ', results.options.address);
};

deploy();

