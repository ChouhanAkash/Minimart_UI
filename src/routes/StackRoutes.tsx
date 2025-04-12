
import React from 'react'
import { createStackNavigator } from '@react-navigation/stack';

import Home from '../screens/home/Home';

import Splash from '../screens/splash/Splash';
import Cart from '../screens/cart/Cart';

const Stack = createStackNavigator();
const StackRoutes = () => {
  return (
    <Stack.Navigator initialRouteName='splash' screenOptions={{headerShown:false}}>
      <Stack.Screen name="splash" component={Splash} />
      <Stack.Screen name="Home" component={Home} />
      <Stack.Screen name="Cart" component={Cart} />
    </Stack.Navigator>
  )
}

export default StackRoutes