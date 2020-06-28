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

    // for EC-recover functionality
    using ECDSA for bytes32;
    // for safe add(), remove() functionality of address sets
    using EnumerableSet for EnumerableSet.AddressSet;
    // possible use of Address extensions like isContract()
    using Address for address;

    // everything about entities
    struct Entity {
        // application id given by Digital Notary/MERSIS
        string id;
        // address of the owner of the entity
        address owner;
        // hash of the Power of Attorney document
        bytes32 PoA;
        // set of delegated proxy addresses verified in PoA
        EnumerableSet.AddressSet proxies;
    }
    // map real-life notary id's to entities
    mapping(string => Entity) private entity_id_map;
    // map addresses to entities
    mapping(address => Entity) private entity_address_map;

    // everything about brokers
    struct Broker {
        // application id given by Digital Notary/MERSIS
        string id;
        // address of the broker
        address owner;
        // hash of the Proof of Competence document
        bytes32 PoC;
    }
    // map real-life notary id's to brokers
    mapping(string => Broker) private broker_id_map;
    // map addresses to brokers
    mapping(address => Broker) private broker_address_map;

    // entity and broker application queues for notaries to approve
    EnumerableSet.AddressSet entity_approval_queue;
    EnumerableSet.AddressSet broker_approval_queue;

    // roles in the system ADMIN > NOTARY > ENTITY & BROKER
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
    /// @dev Add an account to the notary role. Restricted to admins.
    function addNotary(address account) public virtual onlyAdmin {
        grantRole(NOTARY_ROLE, account);
    }
    /// @dev Remove an account from the notary role. Restricted to admins.
    function removeNotary(address account) public virtual onlyAdmin {
        revokeRole(NOTARY_ROLE, account);
    }
    /// @dev Remove oneself from the admin role.
    function renounceAdmin() public virtual {
        renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    // TODO removeAdmin() discussion!


    /// @dev Add an account to the entity role. Restricted to notaries.
    function addEntity(address account) public virtual onlyNotary {
        grantRole(ENTITY_ROLE, account);
    }
    /// @dev Remove an account from the entity role. Restricted to notaries.
    function removeEntity(address account) public virtual onlyNotary {
        revokeRole(ENTITY_ROLE, account);
    }
    /// @dev Add an account to the broker role. Restricted to notaries.
    function addBroker(address account) public virtual onlyNotary {
        grantRole(BROKER_ROLE, account);
    }
    /// @dev Remove an account from the broker role. Restricted to notaries.
    function removeBroker(address account) public virtual onlyNotary {
        revokeRole(BROKER_ROLE, account);
    }
    /// @dev Remove oneself from the notary role.
    function renounceNotary() public virtual {
        renounceRole(NOTARY_ROLE, msg.sender);
    }


    /// @dev Remove oneself from the entity role.
    function renounceEntity() public virtual {
        renounceRole(ENTITY_ROLE, msg.sender);
    }
    /// @dev Remove oneself from the entity role.
    function renounceBroker() public virtual {
        renounceRole(BROKER_ROLE, msg.sender);
    }


    /// @dev Return `true` if the signature of the hash belongs to the specified owner.
    function isSigner(address owner, bytes32 hash, bytes memory signature) public pure returns(bool) {
        // Convert message hash to eth_sign() compatible format
        bytes32 messageHash = hash.toEthSignedMessageHash();
        // Verify that the message's signer is the owner
        address signer = messageHash.recover(signature);
        if (signer != owner) {
            return false;
        }
        return true;
    }
    /// @dev Convert the hash value of a document/message (may be checksum or sha3()) to eth_sign() compatible format
    function hashToSign(bytes32 hash) public pure returns(bytes32) {
        return hash.toEthSignedMessageHash();
    }
    /// @dev To be removed - testing purposes
    function recover(bytes32 hash, bytes memory signature) public pure returns(address) {
        return hash.recover(signature);
    }

}