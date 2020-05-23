const paymasterABI = [{
    'inputs': [{ 'internalType': 'uint256', 'name': '_fee', 'type': 'uint256' }, {
        'internalType': 'address',
        'name': 'tokenAddress',
        'type': 'address'
    }], 'stateMutability': 'nonpayable', 'type': 'constructor'
}, {
    'anonymous': false,
    'inputs': [{
        'indexed': true,
        'internalType': 'address',
        'name': 'previousOwner',
        'type': 'address'
    }, { 'indexed': true, 'internalType': 'address', 'name': 'newOwner', 'type': 'address' }],
    'name': 'OwnershipTransferred',
    'type': 'event'
}, {
    'inputs': [{
        'components': [{
            'internalType': 'address',
            'name': 'target',
            'type': 'address'
        }, {
            'internalType': 'bytes',
            'name': 'encodedFunction',
            'type': 'bytes'
        }, {
            'components': [{
                'internalType': 'uint256',
                'name': 'gasLimit',
                'type': 'uint256'
            }, { 'internalType': 'uint256', 'name': 'gasPrice', 'type': 'uint256' }, {
                'internalType': 'uint256',
                'name': 'pctRelayFee',
                'type': 'uint256'
            }, { 'internalType': 'uint256', 'name': 'baseRelayFee', 'type': 'uint256' }],
            'internalType': 'struct GSNTypes.GasData',
            'name': 'gasData',
            'type': 'tuple'
        }, {
            'components': [{
                'internalType': 'address',
                'name': 'senderAddress',
                'type': 'address'
            }, { 'internalType': 'uint256', 'name': 'senderNonce', 'type': 'uint256' }, {
                'internalType': 'address',
                'name': 'relayWorker',
                'type': 'address'
            }, { 'internalType': 'address', 'name': 'paymaster', 'type': 'address' }],
            'internalType': 'struct GSNTypes.RelayData',
            'name': 'relayData',
            'type': 'tuple'
        }], 'internalType': 'struct GSNTypes.RelayRequest', 'name': 'relayRequest', 'type': 'tuple'
    }, { 'internalType': 'bytes', 'name': 'approvalData', 'type': 'bytes' }, {
        'internalType': 'uint256',
        'name': 'maxPossibleGas',
        'type': 'uint256'
    }],
    'name': 'acceptRelayedCall',
    'outputs': [{ 'internalType': 'bytes', 'name': '', 'type': 'bytes' }],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [{ 'internalType': 'address', 'name': 'newTarget', 'type': 'address' }],
    'name': 'addTarget',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'fee',
    'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'getGasLimits',
    'outputs': [{
        'components': [{
            'internalType': 'uint256',
            'name': 'acceptRelayedCallGasLimit',
            'type': 'uint256'
        }, {
            'internalType': 'uint256',
            'name': 'preRelayedCallGasLimit',
            'type': 'uint256'
        }, { 'internalType': 'uint256', 'name': 'postRelayedCallGasLimit', 'type': 'uint256' }],
        'internalType': 'struct GSNTypes.GasLimits',
        'name': 'limits',
        'type': 'tuple'
    }],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'getHubAddr',
    'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'getRelayHubDeposit',
    'outputs': [{ 'internalType': 'uint256', 'name': '', 'type': 'uint256' }],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'owner',
    'outputs': [{ 'internalType': 'address', 'name': '', 'type': 'address' }],
    'stateMutability': 'view',
    'type': 'function'
}, {
    'inputs': [{ 'internalType': 'bytes', 'name': 'context', 'type': 'bytes' }, {
        'internalType': 'bool',
        'name': 'success',
        'type': 'bool'
    }, { 'internalType': 'bytes32', 'name': 'preRetVal', 'type': 'bytes32' }, {
        'internalType': 'uint256',
        'name': 'gasUseWithoutPost',
        'type': 'uint256'
    }, {
        'components': [{
            'internalType': 'uint256',
            'name': 'gasLimit',
            'type': 'uint256'
        }, { 'internalType': 'uint256', 'name': 'gasPrice', 'type': 'uint256' }, {
            'internalType': 'uint256',
            'name': 'pctRelayFee',
            'type': 'uint256'
        }, { 'internalType': 'uint256', 'name': 'baseRelayFee', 'type': 'uint256' }],
        'internalType': 'struct GSNTypes.GasData',
        'name': 'gasData',
        'type': 'tuple'
    }], 'name': 'postRelayedCall', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, {
    'inputs': [{ 'internalType': 'bytes', 'name': 'context', 'type': 'bytes' }],
    'name': 'preRelayedCall',
    'outputs': [{ 'internalType': 'bytes32', 'name': '', 'type': 'bytes32' }],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{ 'internalType': 'address', 'name': 'target', 'type': 'address' }],
    'name': 'removeTarget',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [],
    'name': 'renounceOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{ 'internalType': 'uint256', 'name': '_fee', 'type': 'uint256' }],
    'name': 'setFee',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{ 'internalType': 'contract IRelayHub', 'name': 'hub', 'type': 'address' }],
    'name': 'setRelayHub',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{ 'internalType': 'address', 'name': 'newOwner', 'type': 'address' }],
    'name': 'transferOwnership',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{ 'internalType': 'address', 'name': 'withdrawAddress', 'type': 'address' }],
    'name': 'withdraw',
    'outputs': [],
    'stateMutability': 'nonpayable',
    'type': 'function'
}, {
    'inputs': [{ 'internalType': 'uint256', 'name': 'amount', 'type': 'uint256' }, {
        'internalType': 'address payable',
        'name': 'target',
        'type': 'address'
    }], 'name': 'withdrawRelayHubDepositTo', 'outputs': [], 'stateMutability': 'nonpayable', 'type': 'function'
}, { 'stateMutability': 'payable', 'type': 'receive' }]

export { paymasterABI };
