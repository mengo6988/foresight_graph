import { BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  PayoutRedemption as PayoutRedemptionEvent,
  ConditionResolution as ConditionResolutionEvent
} from "../generated/ConditionalTokens/ConditionalTokens"
import { CollateralTransfer, UserTransaction, ConditionToMarketMaker, MarketMaker } from "../generated/schema"

export function payoutRedemption(event: PayoutRedemptionEvent): void {
  // Track this as a collateral transfer
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
      mm.resolutionOutcome = -999 // -999 = unresolved
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

export function handleConditionResolution(event: ConditionResolutionEvent): void {
  // Find the MarketMaker associated with this conditionId
  let mapping = ConditionToMarketMaker.load(event.params.conditionId)
  if (mapping == null) {
    return // No associated market maker found
  }

  let marketMaker = MarketMaker.load(mapping.marketMaker)
  if (marketMaker == null) {
    return // Market maker not found
  }

  // Determine the resolution outcome from the payoutNumerators array
  // If both payouts are equal, it's a draw (-1)
  // If [1, 0] then index 0 won, if [0, 1] then index 1 won
  let payoutNumerators = event.params.payoutNumerators

  if (payoutNumerators.length < 2) {
    return // Invalid payout structure
  }

  let payout0 = payoutNumerators[0]
  let payout1 = payoutNumerators[1]

  // Check if both payouts are equal (draw)
  if (payout0.equals(payout1)) {
    marketMaker.resolutionOutcome = -1 // Draw
  } else if (payout0.gt(payout1)) {
    marketMaker.resolutionOutcome = 0 // Index 0 won
  } else {
    marketMaker.resolutionOutcome = 1 // Index 1 won
  }

  marketMaker.save()
}
