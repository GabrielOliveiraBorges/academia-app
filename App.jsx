import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';

import { AuthProvider, useAuth } from './src/AuthContext';
import { colors } from './src/styles';
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/HomeScreen';
import TreinoFormScreen from './src/screens/TreinoFormScreen';
import DetalhesScreen from './src/screens/DetalhesScreen';
import ExercicioFormScreen from './src/screens/ExercicioFormScreen';

const Stack = createNativeStackNavigator();

const navTheme = {
  ...DefaultTheme,
  dark: true,
  colors: {
    ...DefaultTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.primary,
  },
};

function Rotas() {
  const { usuario, carregando } = useAuth();

  if (carregando) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: { backgroundColor: colors.bg },
        headerTintColor: colors.primary,
        headerTitleStyle: { color: colors.text, fontWeight: 'bold' },
        contentStyle: { backgroundColor: colors.bg },
      }}
    >
      {usuario ? (
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: '🏋️ FITAPP' }}
          />
          <Stack.Screen
            name="TreinoForm"
            component={TreinoFormScreen}
            options={({ route }) => ({
              title: route.params?.treinoId ? 'Editar Treino' : 'Novo Treino',
            })}
          />
          <Stack.Screen
            name="Detalhes"
            component={DetalhesScreen}
            options={{ title: 'Detalhes do Treino' }}
          />
          <Stack.Screen
            name="ExercicioForm"
            component={ExercicioFormScreen}
            options={({ route }) => ({
              title: route.params?.regId ? 'Editar Exercício' : 'Novo Exercício',
            })}
          />
        </>
      ) : (
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer theme={navTheme}>
          <StatusBar style="light" />
          <Rotas />
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
