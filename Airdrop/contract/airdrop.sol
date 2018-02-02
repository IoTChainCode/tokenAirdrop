pragma solidity ^0.4.15;

contract ERC20Interface {
  function transferFrom(address _from, address _to, uint _value) public returns (bool){}
  function transfer(address _to, uint _value) public returns (bool){}
  function ERC20Interface() public {}
}
contract Ownable {
  address public owner;

  /**
   * @dev The Ownable constructor sets the original `owner` of the contract to the sender
   * account.
   */
  function Ownable() public {
    owner = msg.sender;
  }


  /**
   * @dev Throws if called by any account other than the owner.
   */
  modifier onlyOwner()  {
    require(msg.sender == owner);
    _;
  }


  /**
   * @dev Allows the current owner to transfer control of the contract to a newOwner.
   * @param newOwner The address to transfer ownership to.
   */
  function transferOwnership(address newOwner) public onlyOwner {

    if (newOwner != address(0)) {
      owner = newOwner;
    }
  }

}


contract TokenAirDrop is Ownable {
  uint public numDrops;
  uint public dropAmount;

  struct airDropInfo {
      address originalAddress;
      address desinationAddress;
      uint256 coinAmount;
  }

  airDropInfo[] public dropperInfo;
  airDropInfo[] public failDropperInfo;

  function TokenAirDrop( address dropper) public {
    transferOwnership(dropper);
  }

  event TokenDrop(address add,address sender , address receiver, uint amount );

  function airDrop ( address contractObj,
                    address   tokenRepo,
                    address[] airDropDesinationAddress,
                    uint[] amounts) public onlyOwner{

    for( uint i = 0 ; i < airDropDesinationAddress.length ; i++ ) {

        bool success = ERC20Interface(contractObj).transferFrom( tokenRepo, airDropDesinationAddress[i],amounts[i]);

        if(success){

            numDrops++;
            dropperInfo[dropperInfo.length ++] = airDropInfo({originalAddress:tokenRepo,coinAmount:amounts[i],desinationAddress:airDropDesinationAddress[i]});

            dropAmount += amounts[i];
        }
        else{
            failDropperInfo[failDropperInfo.length ++] = airDropInfo({originalAddress:tokenRepo,coinAmount:amounts[i],desinationAddress:airDropDesinationAddress[i]});
        }

        TokenDrop(msg.sender,tokenRepo,airDropDesinationAddress[i], amounts[i]);
    }
  }

  function getAirDropInfo(uint dropId) public returns(address originalAddress,
        address desinationAddress,
        uint256 coinAmount){

        require(msg.sender == owner);
        return (dropperInfo[dropId].originalAddress,dropperInfo[dropId].desinationAddress,dropperInfo[dropId].coinAmount);
  }
}

