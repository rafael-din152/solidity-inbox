const assert = require('assert')
const { Web3 } = require('web3')
const ganache = require('ganache')
const web3 = new Web3(ganache.provider())
const { abi, evm } = require('../compile')
const INITIAL_MESSAGE = 'Hi, there!'

let accounts
let inbox

beforeEach(async () => {
    // Get a list of accounts
    accounts = await web3.eth.getAccounts()
    // Use one of those accounts to deploy a contract
    inbox = await new web3.eth.Contract(abi)
        .deploy({   data: evm.bytecode.object,
                    arguments: [INITIAL_MESSAGE]})
        .send({from: accounts[0], gas: '1000000'})
})

describe('Inbox', () => {
    it('deploys a contract', () => {
        assert.ok(inbox.options.address)    
    })
    it('has a default message', async () => {
        const message = await inbox.methods.message().call()
        assert.equal(message, INITIAL_MESSAGE)
    })
    it('can change the message', async () => {
        await inbox.methods.setMessage('Setting a message').send({ from: accounts[0] })
        const message = await inbox.methods.message().call()
        assert.equal(message, 'Setting a message')
    })
})