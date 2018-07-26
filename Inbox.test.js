require('events').EventEmitter.defaultMaxListeners = 0;
const assert = require('assert');
const ganache = require('ganache-cli');
const Web3 = require('web3');

const provider = ganache.provider();
const web3 = new Web3(provider);


const { interface, bytecode } = require('../compile');

let accounts;
let inbox;

beforeEach(async ()=>{
    //Before each test:
    
    //1. Get list of all accounts
    accounts = await web3.eth.getAccounts()
    
    //2. Use an account to deploy contract
    // we are storing this in inbox so we can console log it
    //we are using await bc this is asynchronous 
    inbox = await new web3.eth.Contract(JSON.parse(interface))
        .deploy({data: bytecode, arguments: ['Hello World!']})
        .send({from: accounts[0], gas: '1000000'});

    inbox.setProvider(provider);

});

describe('Inbox', ()=> {
    it('deploys a contract', ()=>{
        assert.ok(inbox.options.address); //.ok method checks the parameter exists.
        //logic is that if inbox contract has an address then it was successfully created
    });

    it('has a default message', async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, 'Hello World!');
    });

    it('can change method', async () => { //We are now modifying data in the contract
        //thus we need to not just call but send, and specifiy who is doing the transaction
        await inbox.methods.setMessage('different message').send({from: accounts[0] })//this is async, hence await
    //we don't need to assign this to a variable bc if the test is successful we will only receive transaction hash
    //if the test is unsuccessful, an error will be thrown automatically
        const message = await inbox.methods.message().call();
        assert.equal(message, 'different message');
    });
});


/* Testing Examples
class Car{
    park(){
        return 'stopped';
    }

    drive(){
        return 'vroom';
    }
}

let car;

beforeEach(()=>{
    car= new Car();
});

describe('Car Test', ()=>{
    it('can park',()=>{
        assert.equal(car.park(), 'stopped');
    });

    it('can drive',()=>{
        assert.equal(car.drive(),'vroom');
    });
});*/