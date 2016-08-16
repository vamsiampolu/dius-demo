'use strict'
import { NoItemScannedError, NO_ITEM_MESSAGE, UnknownItemError, UNKNOWN_ITEM_MESSAGE, NoInventoryError, NO_INVENTORY_MESSAGE } from './errors'

function createCart (inventory) {
  if (inventory != null) {
    let cart = {}
    const scan = (sku) => {
      if (sku == null) {
        throw new NoItemScannedError(NO_ITEM_MESSAGE)
      } else if (inventory.includes(sku)) {
        let oldQuantity = 0
        let oldItem = {}
        if (cart[sku] != null) {
          oldQuantity = cart[sku].quantity
          oldItem = cart[sku]
        }
        const quantity = oldQuantity + 1
        cart[sku] = {
          ...oldItem,
          quantity
        }
      } else {
        throw new UnknownItemError(UNKNOWN_ITEM_MESSAGE)
      }
    }

    const get = () => cart
    const clear = () => {
      cart = {}
    }

    return {
      scan,
      get,
      clear
    }
  } else {
    throw new NoInventoryError(NO_INVENTORY_MESSAGE)
  }
}

export default createCart
