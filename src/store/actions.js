import shop from '@/api/shop';

export default { // methods
  fetchProducts ({commit}) { // Desestructuración de argumentos de ES6, no se llamaría solo el parámetro "context", sino lo que se utilizará únicamente, para este caso el método "commit"
    return new Promise((resolve, reject) => {
      // make the call
      // run setProducts mutation
      shop.getProducts(products => {
        commit('setProducts', products);
        resolve()
      })
    })
  },

  addProductToCart ({state, getters, commit}, product) {
    if (getters.productIsInStock(product)) {
      const cartItem = state.cart.find(item => item.id === product.id);

      if (!cartItem) {
        commit('pushProductToCart', product.id)
      } else {
        commit('incrementQuantity', cartItem)
      }
      commit('decrementProductInventory', product)
    }
  },

  checkout ({state, commit}) {
    shop.buyProducts(
      state.cart,
      () => {
        commit('emptyCart');
        commit('setCheckoutStatus', 'success')
      },
      () => {
        commit('setCheckoutStatus', 'fail')
      }
    )
  }
}

