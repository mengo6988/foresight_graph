import { newMockEvent } from "matchstick-as"
import { ethereum, BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import {
  AMMClosed,
  AMMCreated,
  AMMFeeChanged,
  AMMFeeWithdrawal,
  AMMFundingChanged,
  AMMOutcomeTokenTrade,
  AMMPaused,
  AMMResumed,
  AdminTransferred,
  FeesDistributed,
  ReferralTrade,
  RoleAdminChanged,
  RoleGranted,
  RoleRevoked
} from "../generated/LSLMSRMarketMaker/LSLMSRMarketMaker"

export function createAMMClosedEvent(): AMMClosed {
  let ammClosedEvent = changetype<AMMClosed>(newMockEvent())

  ammClosedEvent.parameters = new Array()

  return ammClosedEvent
}

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

export function createAMMFeeChangedEvent(newFee: BigInt): AMMFeeChanged {
  let ammFeeChangedEvent = changetype<AMMFeeChanged>(newMockEvent())

  ammFeeChangedEvent.parameters = new Array()

  ammFeeChangedEvent.parameters.push(
    new ethereum.EventParam("newFee", ethereum.Value.fromUnsignedBigInt(newFee))
  )

  return ammFeeChangedEvent
}

export function createAMMFeeWithdrawalEvent(fees: BigInt): AMMFeeWithdrawal {
  let ammFeeWithdrawalEvent = changetype<AMMFeeWithdrawal>(newMockEvent())

  ammFeeWithdrawalEvent.parameters = new Array()

  ammFeeWithdrawalEvent.parameters.push(
    new ethereum.EventParam("fees", ethereum.Value.fromUnsignedBigInt(fees))
  )

  return ammFeeWithdrawalEvent
}

export function createAMMFundingChangedEvent(
  fundingChange: BigInt
): AMMFundingChanged {
  let ammFundingChangedEvent = changetype<AMMFundingChanged>(newMockEvent())

  ammFundingChangedEvent.parameters = new Array()

  ammFundingChangedEvent.parameters.push(
    new ethereum.EventParam(
      "fundingChange",
      ethereum.Value.fromSignedBigInt(fundingChange)
    )
  )

  return ammFundingChangedEvent
}

export function createAMMOutcomeTokenTradeEvent(
  transactor: Address,
  outcomeTokenAmounts: Array<BigInt>,
  outcomeTokenNetCost: BigInt,
  marketFees: BigInt
): AMMOutcomeTokenTrade {
  let ammOutcomeTokenTradeEvent =
    changetype<AMMOutcomeTokenTrade>(newMockEvent())

  ammOutcomeTokenTradeEvent.parameters = new Array()

  ammOutcomeTokenTradeEvent.parameters.push(
    new ethereum.EventParam(
      "transactor",
      ethereum.Value.fromAddress(transactor)
    )
  )
  ammOutcomeTokenTradeEvent.parameters.push(
    new ethereum.EventParam(
      "outcomeTokenAmounts",
      ethereum.Value.fromSignedBigIntArray(outcomeTokenAmounts)
    )
  )
  ammOutcomeTokenTradeEvent.parameters.push(
    new ethereum.EventParam(
      "outcomeTokenNetCost",
      ethereum.Value.fromSignedBigInt(outcomeTokenNetCost)
    )
  )
  ammOutcomeTokenTradeEvent.parameters.push(
    new ethereum.EventParam(
      "marketFees",
      ethereum.Value.fromUnsignedBigInt(marketFees)
    )
  )

  return ammOutcomeTokenTradeEvent
}

export function createAMMPausedEvent(): AMMPaused {
  let ammPausedEvent = changetype<AMMPaused>(newMockEvent())

  ammPausedEvent.parameters = new Array()

  return ammPausedEvent
}

export function createAMMResumedEvent(): AMMResumed {
  let ammResumedEvent = changetype<AMMResumed>(newMockEvent())

  ammResumedEvent.parameters = new Array()

  return ammResumedEvent
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

export function createFeesDistributedEvent(
  treasuryAmount: BigInt,
  referralAmount: BigInt,
  isReferralTrade: boolean
): FeesDistributed {
  let feesDistributedEvent = changetype<FeesDistributed>(newMockEvent())

  feesDistributedEvent.parameters = new Array()

  feesDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "treasuryAmount",
      ethereum.Value.fromUnsignedBigInt(treasuryAmount)
    )
  )
  feesDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "referralAmount",
      ethereum.Value.fromUnsignedBigInt(referralAmount)
    )
  )
  feesDistributedEvent.parameters.push(
    new ethereum.EventParam(
      "isReferralTrade",
      ethereum.Value.fromBoolean(isReferralTrade)
    )
  )

  return feesDistributedEvent
}

export function createReferralTradeEvent(
  trader: Address,
  referrer: Address,
  referralCode: string,
  feeAmount: BigInt
): ReferralTrade {
  let referralTradeEvent = changetype<ReferralTrade>(newMockEvent())

  referralTradeEvent.parameters = new Array()

  referralTradeEvent.parameters.push(
    new ethereum.EventParam("trader", ethereum.Value.fromAddress(trader))
  )
  referralTradeEvent.parameters.push(
    new ethereum.EventParam("referrer", ethereum.Value.fromAddress(referrer))
  )
  referralTradeEvent.parameters.push(
    new ethereum.EventParam(
      "referralCode",
      ethereum.Value.fromString(referralCode)
    )
  )
  referralTradeEvent.parameters.push(
    new ethereum.EventParam(
      "feeAmount",
      ethereum.Value.fromUnsignedBigInt(feeAmount)
    )
  )

  return referralTradeEvent
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
