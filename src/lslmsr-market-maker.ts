import {
  AMMCreated as AMMCreatedEvent,
  AMMOutcomeTokenTrade as AMMOutcomeTokenTradeEvent,
  AdminTransferred as AdminTransferredEvent,
  LSLMSRMarketMaker,
} from "../generated/LSLMSRMarketMaker/LSLMSRMarketMaker"
import { BigInt, Bytes, ByteArray, BigDecimal } from "@graphprotocol/graph-ts"
import {
  LSLMSRMarketMakerAMMCreated,
  AMMOutcomeTokenTrade as AMMOutcomeTokenTradeEntity,
  LSLMSRMarketMakerAdminTransferred,
  UserTransaction,
  UserPosition,
  MarketMaker,
} from "../generated/schema"

export function handleAMMOutcomeTokenTrade(event: AMMOutcomeTokenTradeEvent): void {
  let entity = new AMMOutcomeTokenTradeEntity(
    event.transaction.hash.concatI32(event.logIndex.toI32()),
  )

  // Populate trade entity details
  let contract = LSLMSRMarketMaker.bind(event.address)
  entity.transactor = event.params.transactor
  entity.outcomeTokenAmounts = event.params.outcomeTokenAmounts
  entity.outcomeTokenNetCost = event.params.outcomeTokenNetCost
  entity.marketFees = event.params.marketFees
  entity.collateralToken = contract.collateralToken()
  entity.collateralAmount = event.params.outcomeTokenNetCost.abs()

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
    mm.resolutionOutcome = -999 // -999 = unresolved
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

  let amounts = event.params.outcomeTokenAmounts
  let totalTokens = BigInt.zero()
  for (let i = 0; i < amounts.length; i++) {
    let a = amounts[i]
    totalTokens = totalTokens.plus(a)
  }
  userTx.outcomeTokenAmounts = totalTokens

  userTx.blockTimestamp = event.block.timestamp
  userTx.txHash = event.transaction.hash

  userTx.save()

  let positionAmounts = event.params.outcomeTokenAmounts

  // Assume exactly one non-zero outcome per trade
  let chosenIndex = -1
  for (let i = 0; i < positionAmounts.length; i++) {
    if (!positionAmounts[i].equals(BigInt.zero())) {
      chosenIndex = i
      break
    }
  }

  if (chosenIndex == -1) {
    return
  }

  let deltaTokens = positionAmounts[chosenIndex]
  let absNetCost = event.params.outcomeTokenNetCost.abs()

  // Fetch on-chain positionId for chosen outcome
  let onchainPositionId = LSLMSRMarketMaker.bind(event.address).getPositionId(
    BigInt.fromI32(chosenIndex)
  )

  // Stable entity id: user + positionId
  let positionId = event.params.transactor
    .concat(Bytes.fromByteArray(ByteArray.fromBigInt(onchainPositionId)))

  let userPosition = UserPosition.load(positionId)
  if (userPosition == null) {
    userPosition = new UserPosition(positionId)
    userPosition.user = event.params.transactor
    userPosition.marketMaker = mm.id
    userPosition.outcomeIndex = chosenIndex
    userPosition.positionId = onchainPositionId
    userPosition.totalShares = BigInt.zero()
    userPosition.totalInvested = BigInt.zero()
    userPosition.realizedPnL = BigInt.zero()
    userPosition.avgCost = BigDecimal.zero()
    userPosition.lastUpdatedAt = event.block.timestamp
  }
  userPosition.positionId = onchainPositionId

  if (deltaTokens.gt(BigInt.zero())) {
    userPosition.totalShares = userPosition.totalShares.plus(deltaTokens)
    userPosition.totalInvested = userPosition.totalInvested.plus(absNetCost)
    if (!userPosition.totalShares.equals(BigInt.zero())) {
      userPosition.avgCost = userPosition.totalInvested.toBigDecimal().div(userPosition.totalShares.toBigDecimal())
    } else {
      userPosition.avgCost = BigDecimal.zero()
    }
  } else {
    let tokensSold = deltaTokens.neg()
    if (tokensSold.gt(userPosition.totalShares)) {
      tokensSold = userPosition.totalShares
    }
    // Calculate cost basis using avgCost (matches SQL logic exactly)
    // avgCost * tokensSold = cost basis for the sold tokens
    let costBasisValue = BigInt.zero()
    if (!userPosition.totalShares.equals(BigInt.zero()) && !tokensSold.equals(BigInt.zero())) {
      // Use BigDecimal for precision: avgCost * tokensSold
      let costBasisDecimal = userPosition.avgCost.times(tokensSold.toBigDecimal())
      costBasisValue = costBasisDecimal.truncate(0).digits
    }
    let proceeds = absNetCost
    let pnl = proceeds.minus(costBasisValue)

    userPosition.realizedPnL = userPosition.realizedPnL.plus(pnl)
    userPosition.totalShares = userPosition.totalShares.minus(tokensSold)

    if (userPosition.totalInvested.gt(costBasisValue)) {
      userPosition.totalInvested = userPosition.totalInvested.minus(costBasisValue)
    } else {
      userPosition.totalInvested = BigInt.zero()
    }

    // if (!userPosition.totalShares.equals(BigInt.zero())) {
    //   userPosition.avgCost = userPosition.totalInvested.toBigDecimal().div(userPosition.totalShares.toBigDecimal())
    // } else {
    //   userPosition.avgCost = BigDecimal.zero()
    // }
  }

  userPosition.lastUpdatedAt = event.block.timestamp
  userPosition.save()
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
