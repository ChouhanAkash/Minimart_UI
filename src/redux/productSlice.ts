import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Product {
  id: string;
  title: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  category: string;
}

interface ProductState {
  items: Product[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
}

const initialState: ProductState = {
  items: [],
  status: 'idle',
};

// Async thunk to fetch products from Firebase
export const fetchProducts = createAsyncThunk<Product[]>(
  'product/fetchProducts',
  async () => {
    const response = await fetch(
      'https://minimart-fa7c9-default-rtdb.firebaseio.com/products.json'
    );
    const data = await response.json();

    if (!data) return [];

    // Transforming data into a Product[] array
    const products: Product[] = Object.values(data).map((item: any, index: number) => ({
      id: item.id || String(index),
      title: item.title || 'No Title',
      image: item.image || '',
      price: item.price || 0,
      discount: item.discount || 0,
      description: item.description || 'No description',
      category: item.category || 'General',
    }));

    return products;
  }
);

const productSlice = createSlice({
  name: 'product',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchProducts.pending, state => {
        state.status = 'loading';
      })
      .addCase(fetchProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.status = 'succeeded';
        state.items = action.payload;
      })
      .addCase(fetchProducts.rejected, state => {
        state.status = 'failed';
      });
  },
});

export default productSlice.reducer;

