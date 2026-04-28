import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';

import { api } from '../api';
import { useAuth } from '../AuthContext';
import { colors } from '../styles';

export default function TreinoFormScreen({ navigation, route }) {
  const treinoId = route.params?.treinoId;
  const editando = !!treinoId;
  const { usuario } = useAuth();

  const [nome, setNome] = useState('');
  const [tipo, setTipo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [horas, setHoras] = useState('1');
  const [minutos, setMinutos] = useState('0');
  const [carregando, setCarregando] = useState(editando);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    if (!editando) return;
    api
      .obterTreino(treinoId)
      .then((t) => {
        setNome(t.nome || '');
        setTipo(t.tipo || '');
        setDescricao(t.descricao || '');
        const total = t.duracao_minutos || 0;
        setHoras(String(Math.floor(total / 60)));
        setMinutos(String(total % 60));
      })
      .catch(() => Alert.alert('Erro', 'Não foi possível carregar o treino.'))
      .finally(() => setCarregando(false));
  }, [treinoId, editando]);

  async function salvar() {
    if (!nome.trim() || !tipo.trim()) {
      Alert.alert('Atenção', 'Preencha o nome e o tipo do treino.');
      return;
    }

    const treino = {
      nome: nome.trim(),
      tipo: tipo.trim(),
      descricao: descricao.trim(),
      duracao_minutos:
        (parseInt(horas, 10) || 0) * 60 + (parseInt(minutos, 10) || 0),
      usuario_id: usuario.id,
      personal_id: 3,
      data_criacao: new Date().toISOString().split('T')[0],
    };

    setSalvando(true);
    try {
      let salvo;
      if (editando) {
        salvo = await api.atualizarTreino(treinoId, treino);
      } else {
        salvo = await api.criarTreino(treino);
      }

      if (!editando && salvo?.id) {
        Alert.alert(
          'Treino criado! 🎉',
          'Deseja adicionar exercícios a este treino agora?',
          [
            { text: 'Depois', onPress: () => navigation.goBack() },
            {
              text: 'Sim, adicionar',
              onPress: () =>
                navigation.replace('Detalhes', { treinoId: salvo.id }),
            },
          ],
        );
      } else {
        navigation.goBack();
      }
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o treino.');
    } finally {
      setSalvando(false);
    }
  }

  if (carregando) {
    return (
      <View style={s.centro}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={s.label}>Nome do treino</Text>
        <TextInput
          style={s.input}
          value={nome}
          onChangeText={setNome}
          placeholder="Ex: Treino A - Peito"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={s.label}>Tipo</Text>
        <TextInput
          style={s.input}
          value={tipo}
          onChangeText={setTipo}
          placeholder="Ex: Peito/Tríceps"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={s.label}>Descrição</Text>
        <TextInput
          style={[s.input, { height: 80, textAlignVertical: 'top' }]}
          value={descricao}
          onChangeText={setDescricao}
          placeholder="Detalhes do treino..."
          placeholderTextColor={colors.textSecondary}
          multiline
        />

        <Text style={s.label}>Duração</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={s.input}
              value={horas}
              onChangeText={setHoras}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={s.subLabel}>horas</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={s.input}
              value={minutos}
              onChangeText={setMinutos}
              keyboardType="numeric"
              placeholder="0"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={s.subLabel}>minutos</Text>
          </View>
        </View>

        <View style={s.acoes}>
          <TouchableOpacity
            style={[s.botao, s.botaoCancelar]}
            onPress={() => navigation.goBack()}
            disabled={salvando}
          >
            <Text style={s.botaoCancelarTexto}>Cancelar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.botao, s.botaoPrimario, salvando && { opacity: 0.6 }]}
            onPress={salvar}
            disabled={salvando}
          >
            {salvando ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={s.botaoPrimarioTexto}>Salvar</Text>
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const s = StyleSheet.create({
  centro: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  label: { color: colors.text, marginBottom: 6, marginTop: 14, fontSize: 14 },
  subLabel: { color: colors.textSecondary, fontSize: 12, marginTop: 4 },
  input: {
    backgroundColor: colors.bgInput,
    color: colors.text,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    fontSize: 16,
  },
  acoes: { flexDirection: 'row', gap: 12, marginTop: 28 },
  botao: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  botaoPrimario: { backgroundColor: colors.primary },
  botaoPrimarioTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botaoCancelar: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border },
  botaoCancelarTexto: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
});
