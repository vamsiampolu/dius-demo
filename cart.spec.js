'use strict'

/* eslint-env node,mocha */

import createCart from './cart'
import { UNKNOWN_ITEM_MESSAGE, NO_ITEM_MESSAGE, NO_INVENTORY_MESSAGE } from './errors'

require('clarify')
const pricingRules = require('./pricingRules.json')

import { expect } from 'chai'

describe('cart', function () {
  const {inventory} = pricingRules
  it('throws an error if called without a list of valid SKUs', function () {
    expect(createCart).to.throw(NO_INVENTORY_MESSAGE)
  })

  it('has a scan method', function () {
    const cart = createCart(inventory)
    expect(cart.scan).to.be.a('function')
  })

  it('has a get method', function () {
    const cart = createCart(inventory)
    expect(cart.get).to.be.a('function')
  })

  describe('#get', function () {
    it('retrieves an empty object when there are no items', function () {
      const cart = createCart(inventory)
      const actual = cart.get()
      const expected = {}
      expect(actual).to.deep.equal(expected)
    })
  })

  describe('#scan', function () {
    it('throws if called without an sku', function () {
      const cart = createCart(inventory)
      expect(cart.scan.bind(cart)).to.throw(NO_ITEM_MESSAGE)
    })

    it('throws if called with a wrong sku', function () {
      const cart = createCart(inventory)
      expect(cart.scan.bind({}, 'bad')).to.throw(UNKNOWN_ITEM_MESSAGE)
    })

    it('adds a new property on the cart if it does not exist', function () {
      const cart = createCart(inventory)
      const initial = cart.get()
      expect(initial).to.deep.equal({})
      cart.scan('ipd')
      const actual = cart.get()
      const expected = {
        ipd: {
          quantity: 1
        }
      }

      expect(actual).to.deep.equal(expected)
    })
    it('updates the quantity if an item exists', function () {
      const cart = createCart(inventory)
      cart.scan('ipd')
      cart.scan('ipd')
      const actual = cart.get()
      const expected = {
        ipd: {
          quantity: 2
        }
      }
      expect(expected).to.deep.equal(actual)
    })
  })

  it('adds a new item alongside existing items', function () {
    const cart = createCart(inventory)
    cart.scan('ipd')
    cart.scan('ipd')
    cart.scan('mbp')
    const actual = cart.get()
    const expected = {
      ipd: {
        quantity: 2
      },
      mbp: {
        quantity: 1
      }
    }
    expect(actual).to.deep.equal(expected)
  })
})
