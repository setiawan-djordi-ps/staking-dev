// SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ShillVesting {
    IERC20 public shill;

    address public recipient;

    // vesting details
    uint256 public begin;
    uint256 public cliff;
    uint256 public end;
    uint256 public amount;

    uint256 public lastUpdate;

    event Claim(address recipient, uint256 amount);

    /**
     * @param _shill Shill token address
     * @param _recipient Address of the recipient
     * @param _amount Amount of total vested tokens
     * @param _begin When the vesting should begin
     * @param _cliff Cliff period for the vesting
     */
    constructor(
        address _shill,
        address _recipient,
        uint256 _amount,
        uint256 _begin,
        uint256 _cliff,
        uint256 _end
    ) {
        require(_begin >= block.timestamp, "begin too early");
        require(_end > _cliff, "end is too early");

        shill = IERC20(_shill);
        recipient = _recipient;
        amount = _amount;
        begin = _begin;
        cliff = _cliff;
        end = _end;
        lastUpdate = _begin;
    }

    
    /**
     * @notice Claim the accumulated tokens
     */
    function claim() external {
        require(block.timestamp >= cliff, "not time yet");

        uint256 amountToRelease;

        if (block.timestamp >= end) {
            amountToRelease = shill.balanceOf(address(this));
        } else {
            amountToRelease =
                (amount * (block.timestamp - lastUpdate)) /
                (end - begin) * (1 ether);
            lastUpdate = block.timestamp;
        }
        shill.transfer(recipient, amountToRelease);
        emit Claim(recipient, amountToRelease);
    }

    /**
     * @notice Chain recipient
     */
    function changeRecipient(address _recipient) external {
        require(_recipient != address(0));
        require(msg.sender == recipient, "unauthorized");
        recipient = _recipient;
    }
}


contract ShillVestingFactory {
    address public governance;

    event Add(
        uint256 index,
        address vesting,
        address shill,
        address recipient,
        uint256 amount,
        uint256 begin,
        uint256 cliff,
        uint256 end
    );

    uint256 public totalIndex;
    mapping(uint256 => address) public vestingByIndex;

    // mapping of recipients with  vesting contracts
    mapping(address => address) public recipients;

    modifier onlyGovernance() {
        require(msg.sender == governance, "not authorized");
        _;
    }

    constructor(address _governance) {
        governance = _governance;
    }

    /**
     * @notice Adds vesting
     * @param _shill Shill token address
     * @param _recipient Address of the recipient
     * @param _amount Amount of total vested tokens
     * @param _begin When the vesting should begin
     * @param _cliff Cliff period for the vesting
     */
    function add(
        address _shill,
        address _recipient,
        uint256 _amount,
        uint256 _begin,
        uint256 _cliff,
        uint256 _end
    ) external onlyGovernance {
        address vesting = address(
            new ShillVesting(_shill, _recipient, _amount, _begin, _cliff, _end)
        );
        recipients[_recipient] = vesting ;
        vestingByIndex[totalIndex + 1] = vesting;
        totalIndex += 1;
        emit Add(
            totalIndex + 1,
            vesting,
            _shill,
            _recipient,
            _amount,
            _begin,
            _cliff,
            _end
        );
    }
}
