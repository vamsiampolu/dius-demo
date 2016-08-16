'use strict'

/* eslint-env node,mocha */
require('clarify')
import { expect } from 'chai'
import getCheckout from './checkout'
import createCart from './cart'
import { NO_PRICING_RULES_MESSAGE, NO_CART_MESSAGE } from './errors'
const pricingRules = require('./pricingRules.json')

const { prices, offers, inventory } = pricingRules

describe('getCheckout', function () {
  it('throws an error if no pricingRules are specified', function () {
    expect(getCheckout).to.throw(NO_PRICING_RULES_MESSAGE)
    expect(getCheckout.bind({})).to.throw(NO_PRICING_RULES_MESSAGE)
    expect(
      getCheckout.bind({
        prices: void 0,
        offers: void 0
      })
    ).to.throw(NO_PRICING_RULES_MESSAGE)

    expect(
      getCheckout.bind({
        prices,
      offers})
    ).to.be.ok
  })

  describe('checkout', function () {
    it('returns a function that accepts the cart', function () {
      const checkout = getCheckout({prices, offers})
      const cart = createCart(inventory)
      expect(checkout).to.throw(NO_CART_MESSAGE)
      expect(checkout.bind(getCheckout, cart.get())).to.not.throw(NO_CART_MESSAGE)
    })

    it('calculates the total when no offers can be applied', function () {
      const checkout = getCheckout({prices, offers})
      const cart = createCart(inventory)
      cart.scan('ipd')
      cart.scan('ipd')
      cart.scan('atv')
      cart.scan('atv')
      const expected = prices['ipd'] * 2 + prices['atv'] * 2
      const actual = checkout(cart.get())
      expect(actual).to.equal(expected)
    })

    it('applies all the offers before calculating the total', function () {
      const checkout = getCheckout({prices, offers})
      const cart = createCart(inventory)
      cart.scan('atv')
      cart.scan('atv')
      cart.scan('atv')
      cart.scan('vga')
      let expected = 249.00
      let actual = checkout(cart.get())
      expect(actual).to.equal(expected)
      cart.clear()
      cart.scan('atv')
      cart.scan('ipd')
      cart.scan('ipd')
      cart.scan('atv')
      cart.scan('ipd')
      cart.scan('ipd')
      cart.scan('ipd')
      expected = 2718.95
      actual = checkout(cart.get())
      expect(expected).to.equal(actual)
      cart.clear()
      cart.scan('mbp')
      cart.scan('vga')
      cart.scan('ipd')
      expected = 1949.98
      actual = checkout(cart.get())
      expect(actual).to.equal(expected)
    })
  })
})
