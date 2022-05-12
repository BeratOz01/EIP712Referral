// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title EIP712Referral
 * @author @0x2404
 * @notice Gas free referral system created with EIP712 struct
 *         hashing and ECDSA signature verification.
 * @notice This is a proof of concept and is not intended to be used in production. It is not secure and not audited.
 * @dev    For more information on EIP-712, see:
 *          https://eips.ethereum.org/EIPS/eip-712
*/

contract EIP712Referral is Ownable {
    using ECDSA for bytes32;
    // Amount of valid addresses
    uint256 internal totalValidAddresses;
    // Max amount of referral that can be generated per account
    uint256 internal maxReferralAmount;
    // Time it takes to create a reference (in seconds)
    uint256 internal referralExpiration;
    // @notice Struct for users to create a referral
    // @dev Referral struct
    struct Referral {
        address referrer; // Address of creating sign Referral struct
        address referree; // Address of receiving sign Referral struct
        uint256 timestamp; // Timestamp of signing
    }
    // @dev Mapping for check if user is valid referrer
    mapping (address => bool) internal _isValidReferrer;
    // @dev Mapping for referral data
    mapping (address => Referral[]) internal _referrals;
    /**
    *    @notice EIP-712 Domain Separator
    */
    bytes32 public DOMAIN_SEPARATOR;

    /**
    *    @notice Events
    */
    event ReferralSubmited(address creator , address indexed referrer, uint256 timestamp);
    /**
    *    @notice EIP-712 Types
    */
    bytes32 public constant REFERRAL_TYPEHASH = keccak256("Referral(address referrer,address referree,uint256 timestamp)");
    constructor(uint256 _maxReferralAmount , uint256 _referralExpiration) {
        // Set msg.sender to valid referrer
        _isValidReferrer[msg.sender] = true;

        // Set max amount of referral that can be generated per account
        maxReferralAmount = _maxReferralAmount;

        // Set time it takes to create a reference (in seconds)
        referralExpiration = _referralExpiration;

         DOMAIN_SEPARATOR = keccak256(
            abi.encode(
                keccak256(
                    "EIP712Domain(string name,string version,uint256 chainId,address verifyingContract)"
                ),
                keccak256(bytes("Referral")), // @dev Name of the domain - Should match domain set in client side.
                keccak256(bytes("1")), // @dev Version of the domain
                block.chainid,  // @dev Chain id of the domain
                address(this)   // @dev Address of the domain
            )
        );
    }

    /**
    *    @notice Getter function for check if user is valid referrer
    *    @dev Checks boths mappings for validness of user depending on referral amount and boolean mapping.
    *    @dev Returns true if user is valid referrer
    */
    function isValidReferrer(address _address) public view returns (bool) {
        return _isValidReferrer[_address] && _referrals[_address].length < maxReferralAmount;
    }

    /**
    *    @notice Referree function for submiting a referral
    */
    function submitReferral(Referral calldata _referral, bytes calldata _signature) public returns (bool) {
        // @dev Check if user is valid referrer
        require(_isValidReferrer[_referral.referrer], "Referrer is not valid");
        // @dev Check if msg.sender is already a referree
        require(!_isValidReferrer[msg.sender], "You are already a referree");
        // @dev Check if user has reached max referral amount
        require(_referrals[_referral.referrer].length < maxReferralAmount, "Referrer has reached max referral amount");

        // Verify EIP-712 signature by recreating the struct
        // and hashing it with the domain separator
        bytes32 digest = keccak256(
            abi.encodePacked(
                "\x19\x01",
                DOMAIN_SEPARATOR,
                keccak256(abi.encode(REFERRAL_TYPEHASH, _referral.referrer, _referral.referree, _referral.timestamp))
            )
        );

        // Using recover funcition to verify signature of the referral
        address _recoveredAddress = digest.recover(_signature);
        require(_recoveredAddress == _referral.referrer, "Signature is not valid");

        // @dev Chech validness of the referral
        require(_referral.timestamp > block.timestamp - referralExpiration, "Referral is not valid");
        _updateReferrer(msg.sender, _referral);

        // @dev Emit event
        emit ReferralSubmited(msg.sender, _referral.referrer, _referral.timestamp);

        // returns true
        return true;
    }

    /**
    *    @notice Internal function for update referral data
    */
    function _updateReferrer(address _referrer, Referral memory _referral) internal {
        // @dev Add referral to mapping
        _isValidReferrer[_referrer] = true;

        // @dev Push referral to mapping
        _referrals[_referral.referrer].push(_referral);

        // Increment total valid addresses
        totalValidAddresses = unsafeIncrement(totalValidAddresses);

    }


    /**
    *    @notice Modifier for checking if user is valid referrer
    *    @dev Checks if user is valid referrer
    *    @dev Returns true if user is valid referrer
    */
    modifier requiresReferral() {
        require(_isValidReferrer[msg.sender], "Need referral for this action");
        _;
    }

    /**
     *   @dev Function for setting a user as valid referrer
     */
    function setReferrerValid(address[] calldata  _addresses) public onlyOwner {
        uint256 index;
        for (index = 0; index < _addresses.length; index = unsafeIncrement(index)) {
            _isValidReferrer[_addresses[index]] = true;
        }
    }

    /**
    *    @notice Unchecked increment for gas optimization
    */
    function unsafeIncrement(uint x) private pure returns (uint) {
        unchecked { return x + 1; }
    }

    /**
    *    @notice Function for getting block.timestamp data
    */
    function getTimestamp() public view returns (uint) {
        return block.timestamp;
    }

    /**
    *    @notice Function for getting total valid addresses
    */
    function getTotalValidAddresses() public view returns (uint) {
        return totalValidAddresses;
    }

    /**
    *    @notice Function for getting max amount of referral that can be generated per account
    */
    function getMaxReferralAmount() public view returns (uint) {
        return maxReferralAmount;
    }

    /**
    *    @notice Function for getting time it takes to create a reference (in seconds)
    */
    function getReferralExpiration() public view returns (uint) {
        return referralExpiration;
    }

    /**
    *    @notice Function for getting amount of referrals that are valid
    */
    function getValidReferrals(address _address) public view returns (uint) {
        require(_getReferrer(_address), "Address is not a referrer");
        return _referrals[_address].length;
    }


    /**
    *   @dev Internal function for check address of referrer
    */
    function _getReferrer(address _address) internal view returns (bool) {
        return _isValidReferrer[_address];
    }
}
