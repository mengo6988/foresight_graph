import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  AMMCreated,
  AdminTransferred,
  CloneCreated,
  LSLMSRMarketMakerCreation,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/LSLMSRMarketMakerFactory/LSLMSRMarketMakerFactory"

export function createAMMCreatedEvent(initialFunding: BigInt): AMMCreated {
  let ammCreatedEvent = changetype<AMMCreated>(newMockEvent())

  ammCreatedEvent.parameters = new Array()

  ammCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "initialFunding",
      ethereum.Value.fromUnsignedBigInt(initialFunding)
    )
  )

  return ammCreatedEvent
}

export function createAdminTransferredEvent(
  previousAdmin: Address,
  newAdmin: Address
): AdminTransferred {
  let adminTransferredEvent = changetype<AdminTransferred>(newMockEvent())

  adminTransferredEvent.parameters = new Array()

  adminTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdmin",
      ethereum.Value.fromAddress(previousAdmin)
    )
  )
  adminTransferredEvent.parameters.push(
    new ethereum.EventParam("newAdmin", ethereum.Value.fromAddress(newAdmin))
  )

  return adminTransferredEvent
}

export function createCloneCreatedEvent(
  target: Address,
  clone: Address
): CloneCreated {
  let cloneCreatedEvent = changetype<CloneCreated>(newMockEvent())

  cloneCreatedEvent.parameters = new Array()

  cloneCreatedEvent.parameters.push(
    new ethereum.EventParam("target", ethereum.Value.fromAddress(target))
  )
  cloneCreatedEvent.parameters.push(
    new ethereum.EventParam("clone", ethereum.Value.fromAddress(clone))
  )

  return cloneCreatedEvent
}

export function createLSLMSRMarketMakerCreationEvent(
  creator: Address,
  lmsrMarketMaker: Address,
  pmSystem: Address,
  collateralToken: Address,
  conditionIds: Array<Bytes>,
  fee: BigInt,
  funding: BigInt
): LSLMSRMarketMakerCreation {
  let lslmsrMarketMakerCreationEvent =
    changetype<LSLMSRMarketMakerCreation>(newMockEvent())

  lslmsrMarketMakerCreationEvent.parameters = new Array()

  lslmsrMarketMakerCreationEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  lslmsrMarketMakerCreationEvent.parameters.push(
    new ethereum.EventParam(
      "lmsrMarketMaker",
      ethereum.Value.fromAddress(lmsrMarketMaker)
    )
  )
  lslmsrMarketMakerCreationEvent.parameters.push(
    new ethereum.EventParam("pmSystem", ethereum.Value.fromAddress(pmSystem))
  )
  lslmsrMarketMakerCreationEvent.parameters.push(
    new ethereum.EventParam(
      "collateralToken",
      ethereum.Value.fromAddress(collateralToken)
    )
  )
  lslmsrMarketMakerCreationEvent.parameters.push(
    new ethereum.EventParam(
      "conditionIds",
      ethereum.Value.fromFixedBytesArray(conditionIds)
    )
  )
  lslmsrMarketMakerCreationEvent.parameters.push(
    new ethereum.EventParam("fee", ethereum.Value.fromUnsignedBigInt(fee))
  )
  lslmsrMarketMakerCreationEvent.parameters.push(
    new ethereum.EventParam(
      "funding",
      ethereum.Value.fromUnsignedBigInt(funding)
    )
  )

  return lslmsrMarketMakerCreationEvent
}

export function createRoleAdminChangedEvent(
  role: Bytes,
  previousAdminRole: Bytes,
  newAdminRole: Bytes
): RoleAdminChanged {
  let roleAdminChangedEvent = changetype<RoleAdminChanged>(newMockEvent())

  roleAdminChangedEvent.parameters = new Array()

  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "previousAdminRole",
      ethereum.Value.fromFixedBytes(previousAdminRole)
    )
  )
  roleAdminChangedEvent.parameters.push(
    new ethereum.EventParam(
      "newAdminRole",
      ethereum.Value.fromFixedBytes(newAdminRole)
    )
  )

  return roleAdminChangedEvent
}

export function createRoleGrantedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleGranted {
  let roleGrantedEvent = changetype<RoleGranted>(newMockEvent())

  roleGrantedEvent.parameters = new Array()

  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleGrantedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleGrantedEvent
}

export function createRoleRevokedEvent(
  role: Bytes,
  account: Address,
  sender: Address
): RoleRevoked {
  let roleRevokedEvent = changetype<RoleRevoked>(newMockEvent())

  roleRevokedEvent.parameters = new Array()

  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("role", ethereum.Value.fromFixedBytes(role))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("account", ethereum.Value.fromAddress(account))
  )
  roleRevokedEvent.parameters.push(
    new ethereum.EventParam("sender", ethereum.Value.fromAddress(sender))
  )

  return roleRevokedEvent
}
