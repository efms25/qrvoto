import React, { useEffect } from 'react';
import { NativeBaseProvider, Text } from 'native-base';
import { Toast } from 'react-native-toast-message/lib/src/Toast';
import GlobalContextProvider, {
  GlobalContext,
  useGlobalContext,
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
