import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
  Image,
  Modal,
  Pressable,
  Dimensions,
} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useAppDispatch, useAppSelector } from '../../redux/hooks';
import { fetchProducts } from '../../redux/productSlice';
import { addToCart } from '../../redux/cartSlice';
import { styles } from './styles';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

// Define navigation types
type RootStackParamList = {
  Home: undefined;
  Cart: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeProps {
  navigation: HomeScreenNavigationProp;
}

const sliderImages = [
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSCffWujvvEA5K_gEv9w2_17qErV7u76xlnYQ&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTcqi-1QSWOyEyiTeMi7d1BDGDIUphh7_tBxw&s',
  'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiwkL_L7CzxALZ1R_QkF9LfB5PKhiFdqIMtg&s',
];

const Home: React.FC<HomeProps> = ({ navigation }) => {
  const dispatch = useAppDispatch();
  const { items: products } = useAppSelector(state => state.product);
  const cartItems = useAppSelector(state => state.cart.items);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [sort, setSort] = useState('none');
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef<FlatList<any> | null>(null);

  useEffect(() => {
    dispatch(fetchProducts());
  }, [dispatch]);

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % sliderImages.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 3000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const categories = ['All', ...new Set(products.map((item: any) => item.category))];

  const filteredProducts = products
    .filter((item: any) =>
      item.title?.toLowerCase().includes(search.toLowerCase()) &&
      (category === 'All' || item.category === category)
    )
    .sort((a: any, b: any) => {
      if (sort === 'low') return a.price - b.price;
      if (sort === 'high') return b.price - a.price;
      return 0;
    });

  const handleAddToCart = (item: any) => {
    dispatch(addToCart(item));
  };

  const openModal = (item: any) => {
    setSelectedProduct(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedProduct(null);
  };

  const renderItem = ({ item }: { item: any }) => (
    
    <TouchableOpacity onLongPress={() => openModal(item)} style={styles.card}>
      <Image source={{ uri: item.image || 'https://via.placeholder.com/150' }} style={styles.image} />
      <View style={{ flex: 1 }}>
        <Text style={[styles.title, { color: '#000' }]}>{item.name}</Text>
        <Text style={styles.price}>₹{item.price || '0'}</Text>
        <Text style={styles.discount}>{item.discount || 0}% OFF</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => handleAddToCart(item)}>
          <Text style={styles.addButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  const handleGoToCart = () => {
    navigation.replace('Cart');
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>MiniMart</Text>
        <View style={styles.cartContainer}>
          <TouchableOpacity onPress={handleGoToCart}>
            <Text style={styles.cartIcon}>🛒</Text>
          </TouchableOpacity>
          <Text style={styles.cartCount}>{cartItems.length}</Text>
        </View>
      </View>

      <TextInput
      style={styles.searchBar}
      placeholder="Search product..."
       placeholderTextColor="#888"  
      value={search}
      onChangeText={setSearch}
    />


      <View style={styles.dropdownContainer}>
        <Text>Category: </Text>
        <Picker selectedValue={category} style={styles.picker} onValueChange={setCategory}>
          {categories.map((cat, index) => (
            <Picker.Item key={index} label={cat} value={cat} />
          ))}
        </Picker>
      </View>
      <View style={styles.dropdownContainer}>
        <Text>Sort By: </Text>
        <Picker selectedValue={sort} style={styles.picker} onValueChange={setSort}>
          <Picker.Item label="None" value="none" />
          <Picker.Item label="Price: Low to High" value="low" />
          <Picker.Item label="Price: High to Low" value="high" />
        </Picker>
      </View>

      <FlatList
  ref={flatListRef}
  data={sliderImages}
  horizontal
  pagingEnabled
  showsHorizontalScrollIndicator={false}
  keyExtractor={(_, index) => index.toString()}
  renderItem={({ item }) => <Image source={{ uri: item }} style={styles.sliderImage} />}
/>

<View style={styles.dotsContainer}>
  {sliderImages.map((_, index) => (
    <View
      key={index}
      style={[styles.dot, currentIndex === index && styles.activeDot]}
    />
  ))}
</View>


      <View style={{ flex: 1 }}>
        {filteredProducts.length === 0 ? (
          <Text style={{ textAlign: 'center', marginTop: 20 }}>No products found.</Text>
        ) : (
          <FlatList
            data={filteredProducts}
            keyExtractor={(_, index) => index.toString()}
            renderItem={renderItem}
            contentContainerStyle={[styles.productList, { paddingBottom: 100 }]}
            showsVerticalScrollIndicator={false}
            numColumns={2}
          />
        )}
      </View>

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedProduct && (
              <>
                <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
                <Text style={styles.modalTitle}>{selectedProduct.title}</Text>
                <Text>{selectedProduct.description}</Text>
                <Text>Price: ₹{selectedProduct.price}</Text>
                <Text>Discount: {selectedProduct.discount}%</Text>
              </>
            )}
            <Pressable style={styles.closeButton} onPress={closeModal}>
              <Text style={{ color: '#fff' }}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default Home;

