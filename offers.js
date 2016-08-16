'use strict'

import { OfferCheckError, OfferError, NOT_AN_OFFER_MESSAGE, INCORRECT_OFFER_TYPE_MESSAGE, NO_OFFER_DATA_MESSAGE, NO_ITEM_OFFER_MESSAGE } from './errors'

const X_FOR_Y = 'X-FOR-Y'
const PRICE_DROP = 'PRICE-DROP'
const FREE_ITEM = 'FREE-ITEM'

export const doesOfferExist = (offers, sku) => {
  const isInitializedCorrectly = offers != null && sku != null
  if (isInitializedCorrectly) {
    return offers[sku] != null && offers[sku].type != null
  } else if (offers == null) {
    throw new OfferCheckError(NO_OFFER_DATA_MESSAGE)
  } else if (sku == null) {
    throw new OfferCheckError(NO_ITEM_OFFER_MESSAGE)
  }
}

const xForYCanBeApplied = (item, threshold) => {
  const {quantity} = item
  return quantity >= threshold
}

const priceDropCanBeApplied = xForYCanBeApplied

export const isOfferApplicable = (offer, item) => {
  if (offer != null && item != null) {
    const {type} = offer
    if (type != null) {
      switch (type) {
        case X_FOR_Y: {
          const { buy } = offer
          return xForYCanBeApplied(item, buy)
        }
        case PRICE_DROP: {
          const {threshold} = offer
          return priceDropCanBeApplied(item, threshold)
        }
        case FREE_ITEM: {
          return true
        }
      }
    } else if (type == null) {
      throw new OfferError(NOT_AN_OFFER_MESSAGE)
    }
  } else if (offer == null) {
    throw new OfferCheckError(NO_OFFER_DATA_MESSAGE)
  } else if (item == null) {
    throw new OfferCheckError(NO_ITEM_OFFER_MESSAGE)
  }
}

export const applyXForYOffer = (offer, sku, cart) => {
  if (offer != null && cart != null) {
    const {type} = offer
    if (type != null) {
      if (type !== X_FOR_Y) {
        throw new OfferError(INCORRECT_OFFER_TYPE_MESSAGE)
      } else {
        const item = cart[sku]
        if (item != null) {
          const {quantity} = item
          const {buy, payFor} = offer
          const effectiveQuantity = Math.floor(quantity / buy) * payFor + (quantity % buy)
          cart[sku] = {
            ...item,
            effectiveQuantity
          }
          return cart
        }
      }
    } else {
      throw new OfferError(NOT_AN_OFFER_MESSAGE)
    }
  } else if (offer == null) {
    throw new OfferCheckError(NO_OFFER_DATA_MESSAGE)
  } else if (cart == null) {
    throw new OfferCheckError(NO_ITEM_OFFER_MESSAGE)
  }
}

export const applyPriceDropOffer = (offer, sku, cart) => {
  if (offer != null && cart != null) {
    const {type} = offer
    if (type != null) {
      if (type !== PRICE_DROP) {
        throw new OfferError(INCORRECT_OFFER_TYPE_MESSAGE)
      } else {
        const item = cart[sku]
        if (item != null) {
          const {quantity} = item
          const {threshold, offerPrice} = offer
          if (quantity >= threshold) {
            cart[sku] = {
              ...item,
              effectivePrice: offerPrice
            }
          }
        }
        return cart
      }
    } else {
      throw new OfferError(NOT_AN_OFFER_MESSAGE)
    }
  } else if (offer == null) {
    throw new OfferCheckError(NO_OFFER_DATA_MESSAGE)
  } else if (cart == null) {
    throw new OfferCheckError(NO_ITEM_OFFER_MESSAGE)
  }
}

export const applyFreeItemOffer = (offer, sku, cart) => {
  if (offer != null && cart != null) {
    const {type} = offer
    if (type != null) {
      if (type !== FREE_ITEM) {
        throw new OfferError(INCORRECT_OFFER_TYPE_MESSAGE)
      } else {
        const item = cart[sku]
        if (item != null) {
          const {quantity: boughtItemQuantity} = item
          const {freeItemSku, freeItemQuantityPerUnit} = offer
          if (cart[freeItemSku] != null) {
            let {quantity} = cart[freeItemSku]
            let effectiveQuantity
            const freeItemQuantity = boughtItemQuantity * freeItemQuantityPerUnit
            if (freeItemQuantity >= quantity) {
              effectiveQuantity = 0
              quantity = freeItemQuantity
            } else {
              effectiveQuantity = quantity - freeItemQuantity
            }
            cart[freeItemSku] = {
              quantity,
              effectiveQuantity
            }
          } else {
            cart[freeItemSku] = {
              quantity: boughtItemQuantity * freeItemQuantityPerUnit,
              effectiveQuantity: 0
            }
          }
        }
        return cart
      }
    } else {
      throw new OfferError(NOT_AN_OFFER_MESSAGE)
    }
  } else if (offer == null) {
    throw new OfferCheckError(NO_OFFER_DATA_MESSAGE)
  } else if (cart == null) {
    throw new OfferCheckError(NO_ITEM_OFFER_MESSAGE)
  }
}

export const applyOffer = (offer, sku, cart) => {
  if (offer != null && cart != null) {
    const {type} = offer
    if (type != null) {
      switch (type) {
        case X_FOR_Y:
          return applyXForYOffer(offer, sku, cart)
        case PRICE_DROP:
          return applyPriceDropOffer(offer, sku, cart)
        case FREE_ITEM:
          return applyFreeItemOffer(offer, sku, cart)
        default:
          throw new OfferError(INCORRECT_OFFER_TYPE_MESSAGE)
      }
    } else {
      throw new OfferError(NOT_AN_OFFER_MESSAGE)
    }
  } else if (offer == null) {
    throw new OfferCheckError(NO_OFFER_DATA_MESSAGE)
  } else if (cart == null) {
    throw new OfferCheckError(NO_ITEM_OFFER_MESSAGE)
  }
}

const applyOffers = (offers, cart) => {
  const itemList = Object.keys(cart)
  const offerApplyingReducer = (cart, sku) => {
    if (doesOfferExist(offers, sku) && isOfferApplicable(offers[sku], cart[sku])) {
      cart = applyOffer(offers[sku], sku, cart)
    }
    return cart
  }
  cart = itemList.reduce(offerApplyingReducer, cart)
  return cart
}

export default applyOffers
