import json
from web3 import Web3
import os

ETH_NODE_URL = os.getenv('ETH_NODE_URL', 'http://127.0.0.1:7545')  

PRODUCT_ABI_PATH = os.path.join(os.path.dirname(__file__), '../truffle_subproject/build/contracts/ProductManagement.json')
TRANSACTION_ABI_PATH = os.path.join(os.path.dirname(__file__), '../truffle_subproject/build/contracts/TransactionManagement.json')

PRODUCT_CONTRACT_ADDRESS = os.getenv('PRODUCT_CONTRACT_ADDRESS', '0xYourProductContractAddress')
TRANSACTION_CONTRACT_ADDRESS = os.getenv('TRANSACTION_CONTRACT_ADDRESS', '0xYourTransactionContractAddress')

web3 = Web3(Web3.HTTPProvider(ETH_NODE_URL))

with open(PRODUCT_ABI_PATH) as f:
    product_abi = json.load(f)['abi']
with open(TRANSACTION_ABI_PATH) as f:
    transaction_abi = json.load(f)['abi']

product_contract = web3.eth.contract(address=PRODUCT_CONTRACT_ADDRESS, abi=product_abi)
transaction_contract = web3.eth.contract(address=TRANSACTION_CONTRACT_ADDRESS, abi=transaction_abi) 