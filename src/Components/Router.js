import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { ElectionList, Login, Poll, Processor, QrScanner, SheetGenerated } from '../Screens';
import { useAuthContext } from '../Contexts/AuthContext';

const Stack = createNativeStackNavigator();

function Router() {
  const { isLogged } = useAuthContext();

  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
        }}
      >
        {isLogged ? (
          <>
            <Stack.Screen
              name="Listagem"
              component={ElectionList}
              options={{
                title: 'Listagem',
              }}
            />
            <Stack.Screen
              name="Poll"
              component={Poll}
              options={{
                title: 'Eleição',
              }}
            />
            <Stack.Screen
              name="QrScanner"
              component={QrScanner}
              options={{
                title: 'Leitor de Qr code',
              }}
            />
            <Stack.Screen
              name="Processor"
              component={Processor}
              options={{
                title: 'Processador de Qr code',
              }}
            />
            <Stack.Screen
              name="SheetGenerated"
              component={SheetGenerated}
              options={{
                title: 'Planilha de pleito gerada',
              }}
            />
          </>
        ) : (
          <Stack.Screen
            name="Login"
            component={Login}
            // component={Login}
            options={{
              animationTypeForReplace: isLogged ? 'pop' : 'push',
            }}
          />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default Router;
