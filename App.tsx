import 'react-native-gesture-handler'; // must be first
import React from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import StackRoutes from './src/routes/StackRoutes';
import { store } from './src/redux/store';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <NavigationContainer>
          <StackRoutes />
        </NavigationContainer>
      </GestureHandlerRootView>
    </Provider>
  );
};

export default App;


