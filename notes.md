I have created several errors within the module errors.js, this is used in lieu of a type checking library such as
flow or tcomb. I have tried flow before but I still have to figure out an appropriate workflow for using it to ensure
that it does not give me a sense of false confidence and works correctly with the `standard` linter.

I have no idea how to test with curried functions when I am trying to ensure that a function throws if
it is called with incorrect arguments. That's why `checkout` is created within `getCheckout`.

Testing a function with a destructured object with `undefined` as the first argument throws, this might
be because babel translates:

```
const x = ({a,b}) => {
  return a + b
}
```

to the function:

```
var x = function x(_ref) {
  var a = _ref.a;
  var b = _ref.b;

  return a + b;
};
```

and it cannot lookup `a` if `_ref` is undefined.

We cannot just pass the object we retrieved from the createCart directly to `checkout`, we need to
invoke the `get` method on the object. That interface is pretty awkward, I need to be esp. diligent to
ensure that I do not repeat the same mistake again.

When checking to see if free item offer can be applied, we just return true, the presence of the item on the cart
which leads to the check to see if an offer can be applied on the item is a nessecary and sufficient condition. if
additional conditions were required, we could quickly wire up a function to accomplish this.

I think I am going too far with the error messages, I am not going to check for all the errors in every test, it might be rather difficult to cover every edge case by creating specific errors.

Finished

+ offers

+ cart

+ checkout

All the test cases are working except for the one case where a cart has both a Macbook Pro and a VGA adapter. In the case specified, the logic should

1. make the quantity equal to the number of free items if the number of free items is greater and set the effectiveQuantity to zero

2. make the quantity equal to the number of purchased items and the effectiveQuantity to number of purchased items - number of free items if the number of purchased items
is greater than the number of free items.

Done with the changes for checkout mentioned in 1 and 2.

---
