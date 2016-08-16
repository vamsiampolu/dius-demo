'use strict'
import { NoPricingRulesError, NO_PRICING_RULES_MESSAGE, NoCartError, NO_CART_MESSAGE } from './errors'
import applyOffers from './offers'

const computeTotal = (pricingRules, cart) => {
  const {prices, offers} = pricingRules
  const itemSkuList = Object.keys(cart)
  cart = applyOffers(offers, cart)
  const totalReducer = (total, sku) => {
    const price = prices[sku]
    const item = cart[sku]
    const {quantity} = item
    let subTotal
    if (item.effectiveQuantity != null) {
      const {effectiveQuantity} = item
      subTotal = effectiveQuantity * price
    } else if (item.effectivePrice != null) {
      const {effectivePrice} = item
      subTotal = effectivePrice * quantity
    } else {
      subTotal = price * quantity
    }
    total = total + subTotal
    return total
  }
  const total = itemSkuList.reduce(totalReducer, 0)
  return total
}

const getCheckout = (pricingRules) => {
  if (pricingRules != null) {
    const {prices, offers} = pricingRules
    const isInitializedCorrectly = prices != null && offers != null && Object.keys(prices).length > 0
    if (isInitializedCorrectly) {
      const checkout = cart => {
        if (cart != null) {
          return computeTotal(pricingRules, cart)
        } else {
          throw new NoCartError(NO_CART_MESSAGE)
        }
      }
      return checkout
    } else {
      throw new NoPricingRulesError(NO_PRICING_RULES_MESSAGE)
    }
  } else {
    throw new NoPricingRulesError(NO_PRICING_RULES_MESSAGE)
  }
}

export default getCheckout
