import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
  Animated,
} from 'react-native';

import { api } from '../api';
import { useAuth } from '../AuthContext';
import { colors } from '../styles';

export default function LoginScreen() {
  const { entrar } = useAuth();
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);
  const opacidade = useRef(new Animated.Value(1)).current;

  async function handleLogin() {
    setErro('');
    setCarregando(true);
    try {
      const usuarios = await api.buscarUsuarioPorEmail(email.trim());
      if (usuarios.length === 0) {
        setErro('E-mail não cadastrado!');
        setCarregando(false);
        return;
      }
      const usuario = usuarios[0];
      if (usuario.senha !== senha) {
        setErro('Senha incorreta!');
        setCarregando(false);
        return;
      }

      const dadosUsuario = {
        id: usuario.id,
        nome: usuario.nome,
        email: usuario.email,
        tipo: usuario.tipo,
      };

      Animated.timing(opacidade, {
        toValue: 0,
        duration: 280,
        useNativeDriver: true,
      }).start(() => {
        entrar(dadosUsuario);
      });
    } catch (e) {
      setErro(
        'Erro ao conectar com o servidor. Verifique se o json-server está rodando e se o IP em src/api.jsx está correto.',
      );
      setCarregando(false);
    }
  }

  return (
    <Animated.View style={[s.fundo, { opacity: opacidade }]}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={s.container}>
          <View style={s.card}>
            <Text style={s.logo}>🏋️ FITAPP</Text>
            <Text style={s.subtitulo}>Seu treino na palma da mão</Text>

            {erro ? <Text style={s.erro}>{erro}</Text> : null}

            <Text style={s.label}>E-mail</Text>
            <TextInput
              style={s.input}
              placeholder="seu@email.com"
              placeholderTextColor={colors.textSecondary}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
              value={email}
              onChangeText={setEmail}
            />

            <Text style={s.label}>Senha</Text>
            <TextInput
              style={s.input}
              placeholder="••••••"
              placeholderTextColor={colors.textSecondary}
              secureTextEntry
              value={senha}
              onChangeText={setSenha}
            />

            <TouchableOpacity
              style={[s.botao, carregando && { opacity: 0.6 }]}
              onPress={handleLogin}
              disabled={carregando}
            >
              {carregando ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={s.botaoTexto}>Entrar</Text>
              )}
            </TouchableOpacity>

            <View style={s.dica}>
              <Text style={s.dicaTitulo}>💡 Contas de teste:</Text>
              <Text style={s.dicaTexto}>joao@email.com / 123456</Text>
              <Text style={s.dicaTexto}>maria@email.com / 123456</Text>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  fundo: {
    flex: 1,
    backgroundColor: colors.bg,
  },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  card: {
    backgroundColor: colors.bgCard,
    padding: 28,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: colors.border,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.primary,
    textAlign: 'center',
  },
  subtitulo: {
    color: colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    marginTop: 4,
  },
  label: {
    color: colors.text,
    marginBottom: 6,
    marginTop: 12,
    fontSize: 14,
  },
  input: {
    backgroundColor: colors.bgInput,
    color: colors.text,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  botao: {
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 24,
  },
  botaoTexto: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  erro: {
    backgroundColor: 'rgba(239,68,68,0.15)',
    color: '#ff6b6b',
    padding: 10,
    borderRadius: 6,
    marginBottom: 8,
    textAlign: 'center',
  },
  dica: {
    marginTop: 24,
    padding: 12,
    backgroundColor: colors.bgInput,
    borderRadius: 8,
  },
  dicaTitulo: {
    color: colors.primary,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  dicaTexto: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
