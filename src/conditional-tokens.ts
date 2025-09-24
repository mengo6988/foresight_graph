import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import { PayoutRedemption as PayoutRedemptionEvent } from "../generated/ConditionalTokens/ConditionalTokens"
import { PayoutRedemption, CollateralTransfer, UserTransaction, ConditionToMarketMaker, MarketMaker } from "../generated/schema"

export function payoutRedemption(event: PayoutRedemptionEvent): void {
  let entity = new PayoutRedemption(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.redeemer = event.params.redeemer
  entity.collateralToken = event.params.collateralToken
  entity.parentCollectionId = event.params.parentCollectionId
  entity.conditionId = event.params.conditionId
  entity.indexSets = event.params.indexSets
  entity.payout = event.params.payout
  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()

  // Also track this as a collateral transfer
  let transferEntity = new CollateralTransfer(
    event.transaction.hash.concatI32(event.logIndex.toI32()).concat(Bytes.fromI32(1))
  )

  transferEntity.from = Bytes.fromHexString("0x0000000000000000000000000000000000000000") // Zero address (minted)
  transferEntity.to = event.params.redeemer
  transferEntity.value = event.params.payout
  transferEntity.token = event.params.collateralToken
  transferEntity.relatedContract = event.address // ConditionalTokens contract
  transferEntity.blockNumber = event.block.number
  transferEntity.blockTimestamp = event.block.timestamp
  transferEntity.transactionHash = event.transaction.hash

  transferEntity.save()

  // Also record a normalized UserTransaction of type Redeem
  let userTx = new UserTransaction(
    event.transaction.hash.concatI32(event.logIndex.toI32()).concat(Bytes.fromI32(2))
  )
  userTx.user = event.params.redeemer

  // Resolve the related MarketMaker via the conditionId mapping
  let mapping = ConditionToMarketMaker.load(event.params.conditionId)
  if (mapping != null) {
    userTx.marketMaker = mapping.marketMaker
  } else {
    // Fallback: create a placeholder MarketMaker keyed by ConditionalTokens address to satisfy schema
    let mmId = event.address as Bytes
    let mm = MarketMaker.load(mmId)
    if (mm == null) {
      mm = new MarketMaker(mmId)
      mm.address = event.address
      mm.collateralToken = event.params.collateralToken
      mm.positionIds = []
      mm.resolutionOutcome = -1
      mm.blockTimestamp = event.block.timestamp
      mm.transactionHash = event.transaction.hash
      mm.save()
    }
    userTx.marketMaker = mm.id
  }

  userTx.transactionType = "Redeem"
  userTx.collateralAmount = event.params.payout
  // Tokens burned equals sum of index set weights; without precise token amounts in event,
  // store payout as outcomeTokenAmounts proxy for analytics symmetry
  userTx.outcomeTokenAmounts = event.params.payout
  userTx.blockTimestamp = event.block.timestamp
  userTx.txHash = event.transaction.hash
  userTx.save()
}
