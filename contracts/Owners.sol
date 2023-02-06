pragma solidity ^0.8.0;

contract RestrictedOwner {
    address public owner;
    address public manager;
    address unrestrictedOwnerAddress;

    constructor(address _unrestrictedOwnerAddress) {
        unrestrictedOwnerAddress = _unrestrictedOwnerAddress;
        owner = msg.sender;
        manager = msg.sender;
    }

    function updateSettings(address _newOwner, address _newManager) public {
        require(msg.sender == owner, "Not owner!");
        owner = _newOwner;
        manager = _newManager;
    }

    fallback() external {
        (bool result, ) = unrestrictedOwnerAddress.delegatecall(msg.data);
        if (!result) {
            revert("failed");
        }
    }
}

contract UnrestrictedOwner {
    address owner;

    constructor() {
        owner = msg.sender;
    }

    function changeOwner(address _owner) public {
        owner = _owner;
    }
}
