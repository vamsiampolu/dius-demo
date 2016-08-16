'use strict'

/* eslint-env node,mocha */

require('clarify')
import { expect } from 'chai'
import applyOffers, { doesOfferExist, isOfferApplicable, applyXForYOffer, applyPriceDropOffer, applyFreeItemOffer} from './offers'
import { OfferCheckError, OfferError, NOT_AN_OFFER_MESSAGE, NO_OFFER_DATA_MESSAGE, NO_ITEM_OFFER_MESSAGE, INCORRECT_OFFER_TYPE_MESSAGE } from './errors'
const {prices, offers} = require('./pricingRules.json')

describe('offers', function () {
  describe('doesOfferExist', function () {
    it('recieves offers and sku as arguments', function () {
      expect(doesOfferExist).to.throw(NO_OFFER_DATA_MESSAGE)
      expect(doesOfferExist.bind(doesOfferExist, offers)).to.throw(NO_ITEM_OFFER_MESSAGE)
      expect(doesOfferExist.bind(doesOfferExist, offers, 'ipd')).to.not.throw(OfferCheckError)
    })

    it('returns a boolean indicating the presence of an offer on the item', function () {
      const expected = true
      const actual = doesOfferExist(offers, 'atv')
      expect(actual).to.equal(expected)
    })
  })

  describe('isOfferApplicable', function () {
    it('recieves an offer and an item as arguments', function () {
      expect(isOfferApplicable).to.throw(NO_OFFER_DATA_MESSAGE)
      const offer = offers['ipd']
      const item = {
        quantity: 2
      }
      const badOffer = {
        threshold: 1,
        offerPrice: 0
      }
      expect(isOfferApplicable.bind(isOfferApplicable, offer)).to.throw(NO_ITEM_OFFER_MESSAGE)
      expect(isOfferApplicable.bind(isOfferApplicable, badOffer, item)).to.throw(NOT_AN_OFFER_MESSAGE)
      expect(isOfferApplicable.bind(isOfferApplicable, offer, item)).to.not.throw(OfferCheckError)
    })

    it('checks if x-for-y offer can be applied', function () {
      const offer = offers['atv']
      let item = {
        quantity: offer.buy
      }
      let actual = isOfferApplicable(offer, item)
      let expected = true
      expect(actual).to.equal(expected)

      item = {
        quantity: offer.buy - 1
      }
      actual = isOfferApplicable(offer, item)
      expected = false
      expect(actual).to.equal(expected)
    })

    it('checks if price-drop offer can be applied', function () {
      const offer = offers['ipd']
      let item = {
        quantity: offer.threshold
      }
      let actual = isOfferApplicable(offer, item)
      let expected = true
      expect(actual).to.equal(expected)
      item.quantity = item.quantity - 1
      expected = false
      actual = isOfferApplicable(offer, item)
      expect(actual).to.equal(expected)
    })

    it('checks if free-item offer can be applied', function () {
      const offer = offers['mbp']
      const item = {
        quantity: 1
      }
      const expected = true
      const actual = isOfferApplicable(offer, item)
      expect(actual).to.equal(expected)
    })
  })

  describe('applyOffer', function () {
    describe('applyXForYOffer', function () {
      it('expects to be called with the correct offer type', function () {
        const badOffer = {
          prop: 'value'
        }

        const badOfferWithType = {
          type: 'WRONG'
        }
        const item = {}
        const offer = offers['atv']
        expect(applyXForYOffer).to.throw(NO_OFFER_DATA_MESSAGE)
        expect(applyXForYOffer.bind(applyXForYOffer, offer, 'atv')).to.throw(NO_ITEM_OFFER_MESSAGE)
        expect(applyXForYOffer.bind(applyXForYOffer, badOffer, 'atv', item)).to.throw(NOT_AN_OFFER_MESSAGE)
        expect(applyXForYOffer.bind(applyXForYOffer, badOfferWithType, 'atv', item)).to.throw(INCORRECT_OFFER_TYPE_MESSAGE)
        expect(applyXForYOffer.bind(applyXForYOffer, offer, 'atv', item)).to.not.throw(OfferCheckError)
        expect(applyXForYOffer.bind(applyXForYOffer, offer, 'atv', item)).to.not.throw(OfferError)
      })

      it('applies the offer for multiples of `buy`', function () {
        const offer = offers['atv']
        const quantity = offer.buy * 2
        const effectiveQuantity = offer.payFor * 2
        const mockCart = {
          atv: {
          quantity}
        }

        const expected = {
          atv: {
            quantity,
          effectiveQuantity}
        }
        const actual = applyXForYOffer(offer, 'atv', mockCart)
        expect(actual).to.deep.equal(expected)
      })

      it('applies the offer to a non-multiple of `buy`', function () {
        const sku = 'atv'
        const offer = offers[sku]
        const quantity = 7
        const effectiveQuantity = 5
        const mockCart = {
          [sku]: {
          quantity}
        }
        const expected = {
          [sku]: {
            quantity,
          effectiveQuantity}
        }

        const actual = applyXForYOffer(offer, sku, mockCart)
        expect(actual).to.deep.equal(expected)
      })
    })

    describe('applyPriceDropOffer', function () {
      it('is applied to a value below threshold', function () {
        const sku = 'ipd'
        const offer = offers[sku]
        const quantity = offer.threshold - 1
        const mockCart = {
          [sku]: {
          quantity}
        }
        const expected = mockCart
        const actual = applyPriceDropOffer(offer, sku, mockCart)
        expect(actual).to.deep.equal(expected)
      })

      it('is applied to a value above threshold', function () {
        const sku = 'ipd'
        const offer = offers[sku]
        const quantity = offer.threshold + 1
        const mockCart = {
          [sku]: {
          quantity}
        }
        const expected = {
          [sku]:{
            ...mockCart[sku],
            effectivePrice:offer.offerPrice
          }
        }
        const actual = applyPriceDropOffer(offer, sku, mockCart)
        expect(actual).to.deep.equal(expected)
      })
    })

    describe('applyFreeItemOffer', function () {
      it('is applied when no `freeItemSku` was added to the cart', function () {
        const sku = 'mbp'
        const offer = offers[sku]
        const quantity = 1
        const mockCart = {
          [sku]: {
            quantity
          }
        }
        const actual = applyFreeItemOffer(offer, sku, mockCart)
        const expected = {
          ...mockCart,
          vga: {
            quantity: 1,
            effectiveQuantity: 0
          }
        }
        expect(actual).to.deep.equal(expected)
      })

      describe('is applied when `freeItemSku` is already in the cart', function () {
        it('and has a smaller number of free items', function () {
          const sku = 'mbp'
          const offer = offers[sku]
          const quantity = 3
          const mockCart = {
            [sku]: {
              quantity
            },
            vga: {
              quantity: 1
            }
          }
          const actual = applyFreeItemOffer(offer, sku, mockCart)
          const expected = {
            ...mockCart,
            vga: {
              quantity: 3,
              effectiveQuantity: 0
            }
          }
          expect(actual).to.deep.equal(expected)
        })

        it('and has a greater number of free items', function () {
          const sku = 'mbp'
          const offer = offers[sku]
          const quantity = 3
          const mockCart = {
            [sku]: {
              quantity
            },
            vga: {
              quantity: 5
            }
          }
          const actual = applyFreeItemOffer(offer, sku, mockCart)
          const expected = {
            ...mockCart,
            vga: {
              quantity: 5,
              effectiveQuantity: 2
            }
          }
          expect(actual).to.deep.equal(expected)
        })
      })
    })
  })

  describe('applyOffers', function () {
    it('applies all offers and returns the cart', function () {
      const mockCart = {
        mbp: {
          quantity: 3
        },
        vga: {
          quantity: 5
        },
        ipd: {
          quantity: 5
        },
        atv: {
          quantity: 7
        }
      }
      const expected = {
        mbp: {
          quantity: 3
        },
        vga: {
          quantity: 5,
          effectiveQuantity: 2
        },
        ipd: {
          quantity: 5,
          effectivePrice: 499.99
        },
        atv: {
          quantity: 7,
          effectiveQuantity: 5
        }
      }
      const actual = applyOffers(offers, mockCart)
      expect(actual).to.deep.equal(expected)
    })
  })
})
