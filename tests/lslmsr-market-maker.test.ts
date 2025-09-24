import {
  assert,
  describe,
  test,
  clearStore,
  beforeAll,
  afterAll
} from "matchstick-as/assembly/index"
import { BigInt, Address, Bytes } from "@graphprotocol/graph-ts"
import { AMMClosed } from "../generated/schema"
import { AMMClosed as AMMClosedEvent } from "../generated/LSLMSRMarketMaker/LSLMSRMarketMaker"
import { handleAMMClosed } from "../src/lslmsr-market-maker"
import { createAMMClosedEvent } from "./lslmsr-market-maker-utils"

// Tests structure (matchstick-as >=0.5.0)
// https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#tests-structure

describe("Describe entity assertions", () => {
  beforeAll(() => {
    let newAMMClosedEvent = createAMMClosedEvent()
    handleAMMClosed(newAMMClosedEvent)
  })

  afterAll(() => {
    clearStore()
  })

  // For more test scenarios, see:
  // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#write-a-unit-test

  test("AMMClosed created and stored", () => {
    assert.entityCount("AMMClosed", 1)

    // 0xa16081f360e3847006db660bae1c6d1b2e17ec2a is the default address used in newMockEvent() function

    // More assert options:
    // https://thegraph.com/docs/en/subgraphs/developing/creating/unit-testing-framework/#asserts
  })
})
