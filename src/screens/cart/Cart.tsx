import React from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useAppSelector, useAppDispatch } from '../../redux/hooks';
import { removeFromCart } from '../../redux/cartSlice';
import { styles } from './cartstyle';

const Cart = () => {
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(state => state.cart.items);

  const handleRemoveFromCart = (itemId: string) => {
    dispatch(removeFromCart(itemId));
  };

  const handleBuyNow = () => {
    console.log('Proceed to checkout');
  };

  const renderCartItem = ({ item }: { item: any }) => (
    <View style={styles.cartItem}>
      <Image source={{ uri: item.image }} style={styles.cartImage} />
      <View style={styles.cartItemDetails}>
        <Text style={styles.cartItemTitle}>{item.title}</Text>
        <Text style={styles.cartItemPrice}>₹{item.price}</Text>
        <View style={styles.cartItemActions}>
          <TouchableOpacity
            style={styles.removeButton}
            onPress={() => handleRemoveFromCart(item.id)}
          >
            <Text style={styles.removeButtonText}>Remove</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.buyButton}
            onPress={handleBuyNow}
          >
            <Text style={styles.buyButtonText}>Buy Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* 🔙 Go Back Button */}
      <TouchableOpacity
      onPress={() => navigation.navigate('Home')}
        style={styles.goBackButton}
      >
        <Text style={styles.goBackButtonText}>← Go Back</Text>
      </TouchableOpacity>

      <Text style={styles.cartHeader}>Your Cart</Text>

      {cartItems.length === 0 ? (
        <Text style={styles.emptyCartText}>Your cart is empty.</Text>
      ) : (
        <FlatList
          data={cartItems}
          keyExtractor={(item) => item.id.toString()}
          renderItem={renderCartItem}
          style={styles.cartList}
        />
      )}
    </View>
  );
};

export default Cart;



