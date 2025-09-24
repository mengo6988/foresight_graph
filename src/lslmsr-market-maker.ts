import {
  AMMCreated as AMMCreatedEvent,
  AMMOutcomeTokenTrade as AMMOutcomeTokenTradeEvent,
  AdminTransferred as AdminTransferredEvent,
  LSLMSRMarketMaker,
} from "../generated/LSLMSRMarketMaker/LSLMSRMarketMaker"
import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  LSLMSRMarketMakerAMMCreated,
  AMMOutcomeTokenTrade as AMMOutcomeTokenTradeEntity,
  LSLMSRMarketMakerAdminTransferred,
  UserTransaction,
  MarketMaker,
} from "../generated/schema"

export function handleAMMOutcomeTokenTrade(event: AMMOutcomeTokenTradeEvent): void {
  let entity = new AMMOutcomeTokenTradeEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Create a normalized UserTransaction record (Buy/Sell)
  let userTx = new UserTransaction(
    event.transaction.hash
      .concatI32(event.logIndex.toI32())
      .concat(Bytes.fromI32(1))
  )
  userTx.user = event.params.transactor

  // Link to MarketMaker entity by address; ensure existence
  let mmId = event.address as Bytes
  let mm = MarketMaker.load(mmId)
  if (mm == null) {
    mm = new MarketMaker(mmId)
    mm.address = event.address
    mm.collateralToken = entity.collateralToken
    mm.positionIds = []
    mm.resolutionOutcome = -1
    mm.blockTimestamp = event.block.timestamp
    mm.transactionHash = event.transaction.hash
    mm.save()
  }
  userTx.marketMaker = mm.id

  // Determine transaction type from net cost sign
  let isBuy = event.params.outcomeTokenNetCost.ge(BigInt.zero())
  userTx.transactionType = isBuy ? "Buy" : "Sell"

  // Collateral spent/received is absolute net cost
  userTx.collateralAmount = event.params.outcomeTokenNetCost.abs()

  // Sum absolute token deltas to a single BigInt value
  let amounts = event.params.outcomeTokenAmounts
  let totalTokens = BigInt.zero()
  for (let i = 0; i < amounts.length; i++) {
    let a = amounts[i]
    totalTokens = totalTokens.plus(a.lt(BigInt.zero()) ? a.neg() : a)
  }
  userTx.outcomeTokenAmounts = totalTokens

  userTx.blockTimestamp = event.block.timestamp
  userTx.txHash = event.transaction.hash

  userTx.save()
}

export function handleAMMCreated(event: AMMCreatedEvent): void {
  let entity = new LSLMSRMarketMakerAMMCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.initialFunding = event.params.initialFunding

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAdminTransferred(event: AdminTransferredEvent): void {
  let entity = new LSLMSRMarketMakerAdminTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )
  entity.previousAdmin = event.params.previousAdmin
  entity.newAdmin = event.params.newAdmin

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
