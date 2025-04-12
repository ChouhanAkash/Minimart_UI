import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface CartState {
  items: any[];
}

const initialState: CartState = {
  items: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCart: (state, action: PayloadAction<any>) => {
      state.items.push(action.payload);
    },
    removeFromCart: (state, action: PayloadAction<any>) => {
      // FIXED: Accepts just the id
      state.items = state.items.filter(item => item.id !== action.payload);
    },
  },
});

export const { addToCart, removeFromCart } = cartSlice.actions;

export default cartSlice.reducer;
