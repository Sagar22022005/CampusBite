import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [cartShop, setCartShop] = useState(null); // { id, name }

  useEffect(() => {
    const savedCart = localStorage.getItem('campusbite_cart');
    const savedShop = localStorage.getItem('campusbite_cart_shop');
    if (savedCart) {
      try {
        setCartItems(JSON.parse(savedCart));
      } catch (e) {
        localStorage.removeItem('campusbite_cart');
      }
    }
    if (savedShop) {
      try {
        setCartShop(JSON.parse(savedShop));
      } catch (e) {
        localStorage.removeItem('campusbite_cart_shop');
      }
    }
  }, []);

  const saveCart = (items, shop) => {
    setCartItems(items);
    setCartShop(shop);
    localStorage.setItem('campusbite_cart', JSON.stringify(items));
    if (shop) {
      localStorage.setItem('campusbite_cart_shop', JSON.stringify(shop));
    } else {
      localStorage.removeItem('campusbite_cart_shop');
    }
  };

  const addToCart = (product, shop) => {
    // Check if adding from a different shop
    if (cartShop && cartShop.id !== (shop._id || shop.id) && cartItems.length > 0) {
      const confirmReset = window.confirm(
        `Your cart contains items from ${cartShop.name}. Would you like to clear your cart and add items from ${shop.name}?`
      );
      if (!confirmReset) return false;
      // Reset cart for new shop
      const newItems = [
        {
          productId: product._id || product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          stock: product.stock,
        },
      ];
      saveCart(newItems, { id: shop._id || shop.id, name: shop.name });
      return true;
    }

    const targetShop = cartShop || { id: shop._id || shop.id, name: shop.name };
    const pId = product._id || product.id;
    const existingIndex = cartItems.findIndex((item) => item.productId === pId);

    let updated;
    if (existingIndex > -1) {
      const currentQty = cartItems[existingIndex].quantity;
      if (currentQty >= product.stock) {
        alert(`Maximum available stock reached (${product.stock} items).`);
        return false;
      }
      updated = [...cartItems];
      updated[existingIndex].quantity += 1;
    } else {
      if (product.stock <= 0) {
        alert('This item is currently out of stock.');
        return false;
      }
      updated = [
        ...cartItems,
        {
          productId: pId,
          name: product.name,
          price: product.price,
          quantity: 1,
          image: product.image,
          stock: product.stock,
        },
      ];
    }

    saveCart(updated, targetShop);
    return true;
  };

  const updateQuantity = (productId, delta) => {
    const existingIndex = cartItems.findIndex((item) => item.productId === productId);
    if (existingIndex === -1) return;

    const item = cartItems[existingIndex];
    const newQty = item.quantity + delta;

    if (newQty <= 0) {
      removeFromCart(productId);
      return;
    }

    if (newQty > item.stock) {
      alert(`Only ${item.stock} items are available in stock.`);
      return;
    }

    const updated = [...cartItems];
    updated[existingIndex].quantity = newQty;
    saveCart(updated, cartShop);
  };

  const removeFromCart = (productId) => {
    const updated = cartItems.filter((item) => item.productId !== productId);
    if (updated.length === 0) {
      saveCart([], null);
    } else {
      saveCart(updated, cartShop);
    }
  };

  const clearCart = () => {
    saveCart([], null);
  };

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const deliveryFee = cartItems.length > 0 ? 50 : 0;
  const total = subtotal + deliveryFee;
  const totalItemsCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartShop,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        subtotal,
        deliveryFee,
        total,
        totalItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
