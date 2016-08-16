'use strict'
export const NO_ITEM_MESSAGE = 'No item was provided for scanning'
export const UNKNOWN_ITEM_MESSAGE = 'The item was not found in the inventory'
export const NO_INVENTORY_MESSAGE = 'No inventory was provided when creating the cart'
export const NO_PRICING_RULES_MESSAGE = 'No pricing rules were provided when initializing checkout'
export const NO_CART_MESSAGE = 'No cart was provided for checkout'
export const NO_OFFER_DATA_MESSAGE = 'No data regarding the presence or absence of offers was provided'
export const NO_ITEM_OFFER_MESSAGE = 'No item was provided when trying to check for offers'
export const NOT_AN_OFFER_MESSAGE = 'The object specified does not represent an offer'
export const INCORRECT_OFFER_TYPE_MESSAGE = 'The offer specified has an incorrect type'
export const UNKNOWN_OFFER_MESSAGE = 'The offer specified is not listed'

export class NoItemScannedError extends Error {
  constructor (message, extra) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'NoItemScannedError'
    this.message = message
    if (extra) this.extra = extra
  }
}

export class UnknownItemError extends Error {
  constructor (message, extra) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'UnknownItemError'
    this.message = message
    if (extra) this.extra = extra
  }
}

export class NoInventoryError extends Error {
  constructor (message, extra) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'NoInventoryError'
    this.message = message
    if (extra) {
      this.extra = extra
    }
  }
}

export class NoPricingRulesError extends Error {
  constructor (message, extra) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'NopricingRulesError'
    this.message = message
    if (this.extra) {
      this.extra = extra
    }
  }
}

export class NoCartError extends Error {
  constructor (message, extra) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'NoCartError'
    this.message = message
    if (this.extra) {
      this.extra = extra
    }
  }
}

export class OfferCheckError extends Error {
  constructor (message, extra) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'OfferCheckError'
    this.message = message
    if (this.extra) {
      this.extra = extra
    }
  }
}

export class OfferError extends Error {
  constructor (message, extra) {
    super()
    Error.captureStackTrace(this, this.constructor)
    this.name = 'OfferError'
    this.message = message
    if (this.extra) {
      this.extra = extra
    }
  }
}
