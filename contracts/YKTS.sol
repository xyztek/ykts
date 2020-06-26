// SPDX-License-Identifier: MIT

pragma solidity ^0.6.0;

import "../node_modules/openzeppelin-solidity/contracts/cryptography/ECDSA.sol";
import "../node_modules/openzeppelin-solidity/contracts/access/AccessControl.sol";

/**
 * @title YKTS
 * @author Kazım Rıfat Özyılmaz
 * @notice Implements YKTS with access control
 */
contract YKTS is AccessControl {

    using ECDSA for bytes32;

    bytes32 public constant NOTARY_ROLE = keccak256("NOTARY_ROLE");
    bytes32 public constant ENTITY_ROLE = keccak256("ENTITY_ROLE");
    bytes32 public constant BROKER_ROLE = keccak256("BROKER_ROLE");

    /// @dev Add contract creator to the admin role as a member.
    constructor() public {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @dev Restricted to members of the admin role.
    modifier onlyAdmin() {
        require(isAdmin(msg.sender), "Restricted to admins.");
        _;
    }
    /// @dev Restricted to members of the notary role.
    modifier onlyNotary() {
        require(isNotary(msg.sender), "Restricted to notaries.");
        _;
    }
    /// @dev Restricted to members of the entity role.
    modifier onlyEntity() {
        require(isEntity(msg.sender), "Restricted to entities.");
        _;
    }
    /// @dev Restricted to members of the broker role.
    modifier onlyBroker() {
        require(isBroker(msg.sender), "Restricted to brokers.");
        _;
    }

    /// @dev Return `true` if the account belongs to the admin role.
    function isAdmin(address account) public virtual view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }
    /// @dev Return `true` if the account belongs to the notary role.
    function isNotary(address account) public virtual view returns (bool) {
        return hasRole(NOTARY_ROLE, account);
    }
    /// @dev Return `true` if the account belongs to the entity role.
    function isEntity(address account) public virtual view returns (bool) {
        return hasRole(ENTITY_ROLE, account);
    }
    /// @dev Return `true` if the account belongs to the broker role.
    function isBroker(address account) public virtual view returns (bool) {
        return hasRole(BROKER_ROLE, account);
    }


    /// @dev Add an account to the admin role. Restricted to admins.
    function addAdmin(address account) public virtual onlyAdmin {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }
    /// @dev Remove oneself from the admin role.
    function renounceAdmin() public virtual {
        renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }

    /// @dev Add an account to the notary role. Restricted to admins.
    function addNotary(address account) public virtual onlyAdmin {
        grantRole(NOTARY_ROLE, account);
    }
    /// @dev Remove an account from the notary role. Restricted to admins.
    function removeNotary(address account) public virtual onlyAdmin {
        revokeRole(NOTARY_ROLE, account);
    }


    /// @dev Recover address of the signer
    function recover(bytes32 hash, bytes memory signature) public pure returns(address) {
        return hash.recover(signature);
    }
    /// @dev Convert message hash to eth_sign() compatible format
    function ethSignedHash(bytes32 messageHash) public pure returns(bytes32) {
        return messageHash.toEthSignedMessageHash();
    }



}