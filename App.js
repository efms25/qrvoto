import React from 'react';
import { NativeBaseProvider } from 'native-base';
import Toast from 'react-native-toast-message/lib/index';
import GlobalContextProvider, {
  GlobalContext,
} from './src/Contexts/GlobalContext';
import AuthProvider from './src/Contexts/AuthContext';
import { SplashScreen, Router } from './src/Components';


export default function App() {
  return (
    <GlobalContextProvider>
      <GlobalContext.Consumer>
        {(loading) => (
          <AuthProvider>
            <NativeBaseProvider>
              {!loading ? <SplashScreen /> : <Router />}
              <Toast />
            </NativeBaseProvider>
          </AuthProvider>
        )}
      </GlobalContext.Consumer>
    </GlobalContextProvider>
  );
}
