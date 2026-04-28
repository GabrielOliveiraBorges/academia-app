import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'usuarioLogado';
const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [usuario, setUsuario] = useState(null);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem(STORAGE_KEY)
      .then((dados) => {
        if (dados) setUsuario(JSON.parse(dados));
      })
      .finally(() => setCarregando(false));
  }, []);

  async function entrar(dadosUsuario) {
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(dadosUsuario));
    setUsuario(dadosUsuario);
  }

  async function sair() {
    await AsyncStorage.removeItem(STORAGE_KEY);
    setUsuario(null);
  }

  return (
    <AuthContext.Provider value={{ usuario, carregando, entrar, sair }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider');
  return ctx;
}
