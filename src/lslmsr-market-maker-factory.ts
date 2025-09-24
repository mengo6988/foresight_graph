import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  LSLMSRMarketMakerFactory,
  AMMCreated,
  AdminTransferred,
  CloneCreated,
  LSLMSRMarketMakerCreation,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/LSLMSRMarketMakerFactory/LSLMSRMarketMakerFactory"
import { ExampleEntity } from "../generated/schema"

export function handleAMMCreated(event: AMMCreated): void {
  // Entities can be loaded from the store using an ID; this ID
  // needs to be unique across all entities of the same type
  const id = event.transaction.hash.concat(
    Bytes.fromByteArray(Bytes.fromBigInt(event.logIndex))
  )
  let entity = ExampleEntity.load(id)

  // Entities only exist after they have been saved to the store;
  // `null` checks allow to create entities on demand
  if (!entity) {
    entity = new ExampleEntity(id)

    // Entity fields can be set using simple assignments
    entity.count = BigInt.fromI32(0)
  }

  // BigInt and BigDecimal math are supported
  entity.count = entity.count + BigInt.fromI32(1)

  // Entity fields can be set based on event parameters
  entity.initialFunding = event.params.initialFunding

  // Entities can be written to the store with `.save()`
  entity.save()

  // Note: If a handler doesn't require existing field values, it is faster
  // _not_ to load the entity from the store. Instead, create it fresh with
  // `new Entity(...)`, set the fields that should be updated and save the
  // entity back to the store. Fields that were not set or unset remain
  // unchanged, allowing for partial updates to be applied.

  // It is also possible to access smart contracts from mappings. For
  // example, the contract that has emitted the event can be connected to
  // with:
  //
  // let contract = Contract.bind(event.address)
  //
  // The following functions can then be called on this contract to access
  // state variables and other data:
  //
  // - contract.DEFAULT_ADMIN_ROLE(...)
  // - contract.FEE_RANGE(...)
  // - contract.LAUNCHPAD_ROLE(...)
  // - contract.ORACLE_ROLE(...)
  // - contract.admin(...)
  // - contract.alpha(...)
  // - contract.atomicOutcomeSlotCount(...)
  // - contract.collateralToken(...)
  // - contract.collectionIds(...)
  // - contract.conditionIds(...)
  // - contract.createLSLMSRMarketMaker(...)
  // - contract.factoryReferralSystem(...)
  // - contract.factoryRewardsManager(...)
  // - contract.factoryTreasuryAddress(...)
  // - contract.fee(...)
  // - contract.funding(...)
  // - contract.getRoleAdmin(...)
  // - contract.hasRole(...)
  // - contract.implementationMaster(...)
  // - contract.marketDeadline(...)
  // - contract.onERC1155BatchReceived(...)
  // - contract.onERC1155Received(...)
  // - contract.outcomeSlotCounts(...)
  // - contract.pmSystem(...)
  // - contract.positionIds(...)
  // - contract.referralSystem(...)
  // - contract.rewardsManager(...)
  // - contract.stage(...)
  // - contract.supportsInterface(...)
  // - contract.treasuryAddress(...)
  // - contract.volume(...)
  // - contract.whitelist(...)
}

export function handleAdminTransferred(event: AdminTransferred): void {}

export function handleCloneCreated(event: CloneCreated): void {}

export function handleLSLMSRMarketMakerCreation(
  event: LSLMSRMarketMakerCreation
): void {}

export function handleRoleAdminChanged(event: RoleAdminChanged): void {}

export function handleRoleGranted(event: RoleGranted): void {}

export function handleRoleRevoked(event: RoleRevoked): void {}
