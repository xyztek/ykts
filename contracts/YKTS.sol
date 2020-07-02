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
        // array of delegated proxy addresses verified in PoA
        address[] proxies;
    }
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
    // map addresses to brokers
    mapping(address => Broker) private broker_address_map;

    // entity and broker application queues for notaries to approve
    EnumerableSet.AddressSet entity_approval_queue;
    EnumerableSet.AddressSet broker_approval_queue;

    // roles in the system ADMIN > NOTARY > ENTITY & BROKER
    bytes32 private constant NOTARY_ROLE = keccak256("NOTARY_ROLE");
    bytes32 private constant ENTITY_ROLE = keccak256("ENTITY_ROLE");
    bytes32 private constant BROKER_ROLE = keccak256("BROKER_ROLE");

    // broker is invalid
    event BrokerInvalid(address indexed account);
    // entity is invalid
    event EntityInvalid(address indexed account);
    // entity/broker approval queue operation failed
    event QueueOpFailed(address indexed account);
    // signature verification or EC-recover operation failed
    event RecoverFailed(address indexed account, bytes32 indexed hash, bytes indexed signature);

    // fired after a successfull Broker approval request
    event BrokerRequest(address indexed account);
    // fired after a successfull Entity approval request
    event EntityRequest(address indexed account);
    // fired after an Broker is successfully approved
    event BrokerApprove(address indexed account);
    // fired after an Entity is successfully approved
    event EntityApprove(address indexed account);


    /// @dev Add contract creator to the admin role as a member.
    constructor() public {
        // Grant the contract deployer the default admin role: it will be able
        // to grant and revoke any roles
        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setRoleAdmin(NOTARY_ROLE, DEFAULT_ADMIN_ROLE);
        _setRoleAdmin(ENTITY_ROLE, NOTARY_ROLE);
        _setRoleAdmin(BROKER_ROLE, NOTARY_ROLE);
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
    function isAdmin(address account) public view returns (bool) {
        return hasRole(DEFAULT_ADMIN_ROLE, account);
    }
    /// @dev Return `true` if the account belongs to the notary role.
    function isNotary(address account) public view returns (bool) {
        return hasRole(NOTARY_ROLE, account);
    }
    /// @dev Return `true` if the account belongs to the entity role.
    function isEntity(address account) public view returns (bool) {
        return hasRole(ENTITY_ROLE, account);
    }
    /// @dev Return `true` if the account belongs to the broker role.
    function isBroker(address account) public view returns (bool) {
        return hasRole(BROKER_ROLE, account);
    }

    /// @dev Add an account to the admin role. Restricted to admins.
    function addAdmin(address account) public onlyAdmin {
        grantRole(DEFAULT_ADMIN_ROLE, account);
    }
    /// @dev Remove oneself from the admin role.
    function renounceAdmin() public {
        renounceRole(DEFAULT_ADMIN_ROLE, msg.sender);
    }
    /// @dev Get the total number of admins.
    function getAdminCount() public view returns (uint256) {
        return getRoleMemberCount(DEFAULT_ADMIN_ROLE);
    }
    /// @dev Get the total number of admins.
    function getAdmin(uint256 index) public view returns (address) {
        return getRoleMember(DEFAULT_ADMIN_ROLE, index);
    }
    /// @dev Add an account to the notary role. Restricted to admins.
    function addNotary(address account) public onlyAdmin {
        grantRole(NOTARY_ROLE, account);
    }
    /// @dev Remove an account from the notary role. Restricted to admins.
    function removeNotary(address account) public onlyAdmin {
        revokeRole(NOTARY_ROLE, account);
    }
    // TODO removeAdmin() discussion!



    /// @dev Remove oneself from the notary role.
    function renounceNotary() public virtual {
        renounceRole(NOTARY_ROLE, msg.sender);
    }
    /// @dev Get the total number of notaries.
    function getNotaryCount() public view returns (uint256) {
        return getRoleMemberCount(NOTARY_ROLE);
    }
    /// @dev Get the total number of notaries.
    function getNotary(uint256 index) public view returns (address) {
        return getRoleMember(NOTARY_ROLE, index);
    }
    /// @dev Add an account to the broker role. Restricted to notaries.
    function addBroker(address account) public onlyNotary returns(bool) {
        require(broker_approval_queue.contains(account), "Broker queue should contain the address!");
        require(bytes(broker_address_map[account].id).length > 0, "Broker should have applied before!");
        if (broker_approval_queue.remove(account) != true) {
            emit QueueOpFailed(account);
            return false;
        }
        grantRole(BROKER_ROLE, account);
        emit BrokerApprove(account);
        return true;
    }
    /// @dev Remove an account from the broker role. Restricted to notaries.
    function removeBroker(address account) public onlyNotary {
        revokeRole(BROKER_ROLE, account);
    }
    /// @dev Add an account to the entity role. Restricted to notaries.
    function addEntity(address account) public onlyNotary returns(bool) {
        require(entity_approval_queue.contains(account), "Entity queue should contain the address!");
        require(bytes(entity_address_map[account].id).length > 0, "Entity should have applied before!");
        require(entity_address_map[account].proxies.length > 0, "Entity should have at least one proxy!");
        // check if proxy Brokers are still valid
        for (uint256 i = 0; i < entity_address_map[account].proxies.length; i++) {
            if (isBroker(entity_address_map[account].proxies[i]) != true) {
                emit BrokerInvalid(entity_address_map[account].proxies[i]);
                return false;
            }
        }
        if (entity_approval_queue.remove(account) != true) {
            emit QueueOpFailed(account);
            return false;
        }
        grantRole(ENTITY_ROLE, account);
        emit EntityApprove(account);
        return true;
    }
    /// @dev Remove an account from the entity role. Restricted to notaries.
    function removeEntity(address account) public virtual onlyNotary {
        revokeRole(ENTITY_ROLE, account);
    }



    /// @dev Return `true` if the broker approval request is valid and queued for notary
    function requestBrokerApproval(string memory id, bytes32 PoC_hash, bytes memory signature) public returns(bool) {
        // check if id is empty
        require(bytes(id).length > 0, "Broker application id can not be empty!");
        // check address mapping, if present
        require(bytes(broker_address_map[msg.sender].id).length == 0, "Broker already approved, address present!");
        // check Proof of Competence document hash signature
        if (isSigner(msg.sender, PoC_hash, signature) != true) {
            emit RecoverFailed(msg.sender, PoC_hash, signature);
            return false;
        }
        // fill the mapping
        broker_address_map[msg.sender].id = id;
        broker_address_map[msg.sender].owner = msg.sender;
        broker_address_map[msg.sender].PoC = PoC_hash;
        // add to notary approval queue
        if (broker_approval_queue.add(msg.sender) != true) {
            emit QueueOpFailed(msg.sender);
            return false;
        }
        emit BrokerRequest(msg.sender);
        return true;
    }
    /// @dev Return the count of the broker approval requests queued for notarization
    function getBrokerInQueueCount() public view returns(uint256) {
        return broker_approval_queue.length();
    }
    /// @dev Return info on the broker in queue by index
    function getBrokerInQueueByIndex(uint256 index) public view returns(address, string memory, bytes32) {
        require(broker_approval_queue.length() > index, "Broker queue length should be greater than index!");
        return getBrokerInQueueByAddress(broker_approval_queue.at(index));
    }
    /// @dev Return info on the broker in queue by address
    function getBrokerInQueueByAddress(address account) public view returns(address, string memory, bytes32) {
        require(broker_approval_queue.contains(account) == true, "Broker is not in approval queue!");
        return (broker_address_map[account].owner,
                broker_address_map[account].id,
                broker_address_map[account].PoC);
    }
    /// @dev Get the total number of brokers
    function getBrokerCount() public view returns (uint256) {
        return getRoleMemberCount(BROKER_ROLE);
    }
    /// @dev Get broker by index
    function getBrokerByIndex(uint256 index) public view returns (address, string memory, bytes32) {
        return getBrokerByAddress(getRoleMember(BROKER_ROLE, index));
    }
    /// @dev Get broker by address
    function getBrokerByAddress(address account) public view returns (address, string memory, bytes32) {
        require(isBroker(account), "Broker not approved!");
        require(bytes(broker_address_map[account].id).length > 0, "Broker should have applied before!");
        return (broker_address_map[account].owner,
                broker_address_map[account].id,
                broker_address_map[account].PoC);
    }
    /// @dev Remove oneself from the broker role.
    function renounceBroker() public {
        renounceRole(BROKER_ROLE, msg.sender);
    }



    /// @dev Return `true` if the entity approval request is valid and queued for notary
    function requestEntityApproval(string memory id, bytes32 PoA_hash, bytes memory signature, address[] memory proxies) public returns(bool) {
        // check if id is empty
        require(bytes(id).length > 0, "Entity application id can not be empty!");
        // check if proxies is empty
        require(proxies.length > 0, "Entity proxies can not be empty!");
        // check address mapping, if present
        require(bytes(entity_address_map[msg.sender].id).length == 0, "Entity already approved, address present!");
        // check Power of Attorney document hash signature
        if (isSigner(msg.sender, PoA_hash, signature) != true) {
            emit RecoverFailed(msg.sender, PoA_hash, signature);
            return false;
        }
        // check if proxies are already approved as Brokers
        for (uint256 i = 0; i < proxies.length; i++) {
            if (isBroker(proxies[i]) != true) {
                emit BrokerInvalid(proxies[i]);
                return false;
            }
        }
        // fill the mapping
        entity_address_map[msg.sender].id = id;
        entity_address_map[msg.sender].owner = msg.sender;
        entity_address_map[msg.sender].PoA = PoA_hash;
        entity_address_map[msg.sender].proxies = proxies;
        // add to notary approval queue
        if (entity_approval_queue.add(msg.sender) != true) {
            emit QueueOpFailed(msg.sender);
            return false;
        }
        emit EntityRequest(msg.sender);
        return true;
    }
    /// @dev Return the count of the broker approval requests queued for notarization
    function getEntityInQueueCount() public view returns(uint256) {
        return entity_approval_queue.length();
    }
    /// @dev Return info on the entity in the queue by index
    function getEntityInQueueByIndex(uint256 index) public view returns(address, string memory, bytes32) {
        require(entity_approval_queue.length() > index, "Entity queue length should be greater than index!");
        return getEntityInQueueByAddress(entity_approval_queue.at(index));
    }
    /// @dev Return info on the entity in the queue by address
    function getEntityInQueueByAddress(address account) public view returns(address, string memory, bytes32) {
        require(entity_approval_queue.contains(account) == true, "Entity is not in approval queue!");
        return (entity_address_map[account].owner,
                entity_address_map[account].id,
                entity_address_map[account].PoA);
    }
    /// @dev Get the total number of entities.
    function getEntityCount() public view returns (uint256) {
        return getRoleMemberCount(ENTITY_ROLE);
    }
    /// @dev Get entity by index
    function getEntityByIndex(uint256 index) public view returns (address, string memory, bytes32, address[] memory) {
        return getEntityByAddress(getRoleMember(ENTITY_ROLE, index));
    }
    /// @dev Get entity by address
    function getEntityByAddress(address account) public view returns (address, string memory, bytes32, address[] memory) {
        require(isEntity(account), "Entity not approved!");
        require(bytes(entity_address_map[account].id).length > 0, "Entity should have applied before!");
        return (entity_address_map[account].owner,
                entity_address_map[account].id,
                entity_address_map[account].PoA,
                entity_address_map[account].proxies);
    }
    /// @dev Remove oneself from the entity role.
    function renounceEntity() public virtual {
        renounceRole(ENTITY_ROLE, msg.sender);
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