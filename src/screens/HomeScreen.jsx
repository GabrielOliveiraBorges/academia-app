import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  RefreshControl,
  Alert,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../api';
import { useAuth } from '../AuthContext';
import { colors } from '../styles';

function formatarData(dataStr) {
  if (!dataStr) return '-';
  const d = new Date(dataStr);
  return d.toLocaleDateString('pt-BR');
}

function formatarDuracao(minutos) {
  const min = Number(minutos) || 0;
  if (min <= 0) return '-';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

export default function HomeScreen({ navigation }) {
  const { usuario, sair } = useAuth();
  const [treinos, setTreinos] = useState([]);
  const [stats, setStats] = useState({ total: 0, concluidos: 0, ultimo: '-' });
  const [carregando, setCarregando] = useState(true);
  const [atualizando, setAtualizando] = useState(false);
  const opacidade = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(opacidade, {
      toValue: 1,
      duration: 320,
      useNativeDriver: true,
    }).start();
  }, [opacidade]);

  const carregar = useCallback(async () => {
    try {
      const [todosTreinos, todoHistorico] = await Promise.all([
        api.listarTreinos(),
        api.listarHistorico(),
      ]);

      const meusTreinos = todosTreinos.filter(
        (t) => String(t.usuario_id) === String(usuario.id),
      );
      const meuHistorico = todoHistorico.filter(
        (h) => String(h.usuario_id) === String(usuario.id),
      );

      let ultimo = '-';
      if (meuHistorico.length > 0) {
        const sorted = [...meuHistorico].sort(
          (a, b) => new Date(b.data_execucao) - new Date(a.data_execucao),
        );
        ultimo = formatarData(sorted[0].data_execucao);
      }

      setTreinos(meusTreinos);
      setStats({
        total: meusTreinos.length,
        concluidos: meuHistorico.filter((h) => h.concluido).length,
        ultimo,
      });
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os treinos. Verifique o servidor.');
    } finally {
      setCarregando(false);
      setAtualizando(false);
    }
  }, [usuario.id]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function onRefresh() {
    setAtualizando(true);
    carregar();
  }

  function handleSair() {
    Alert.alert('Sair do app?', 'Você precisará fazer login novamente.', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: sair },
    ]);
  }

  function handleExcluir(treino) {
    Alert.alert(
      'Excluir treino?',
      'Todos os exercícios vinculados também serão removidos. Esta ação não pode ser desfeita.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            try {
              const todosEx = await api.listarTreinoExercicios();
              const exDoTreino = todosEx.filter(
                (te) => String(te.treino_id) === String(treino.id),
              );
              for (const te of exDoTreino) {
                await api.excluirTreinoExercicio(te.id);
              }
              await api.excluirTreino(treino.id);
              carregar();
            } catch (e) {
              Alert.alert('Erro', 'Não foi possível excluir.');
            }
          },
        },
      ],
    );
  }

  function renderTreino({ item }) {
    return (
      <View style={s.card}>
        <View style={s.tipoTag}>
          <Text style={s.tipoTexto}>{item.tipo}</Text>
        </View>
        <Text style={s.cardTitulo}>{item.nome}</Text>
        <Text style={s.cardDescricao}>{item.descricao || 'Sem descrição'}</Text>
        <View style={s.cardInfo}>
          <Text style={s.infoTexto}>⏱️ {formatarDuracao(item.duracao_minutos)}</Text>
          <Text style={s.infoTexto}>📅 {formatarData(item.data_criacao)}</Text>
        </View>
        <View style={s.acoes}>
          <TouchableOpacity
            style={[s.btnAcao, { backgroundColor: colors.primary }]}
            onPress={() => navigation.navigate('Detalhes', { treinoId: item.id })}
          >
            <Text style={s.btnAcaoTexto}>▶ Ver</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btnAcao, { backgroundColor: '#3a3a3a' }]}
            onPress={() => navigation.navigate('TreinoForm', { treinoId: item.id })}
          >
            <Text style={s.btnAcaoTexto}>✏️ Editar</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[s.btnAcao, { backgroundColor: colors.danger }]}
            onPress={() => handleExcluir(item)}
          >
            <Text style={s.btnAcaoTexto}>🗑️</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  if (carregando) {
    return (
      <Animated.View style={[s.centro, { opacity: opacidade }]}>
        <ActivityIndicator size="large" color={colors.primary} />
      </Animated.View>
    );
  }

  const primeiroNome = usuario.nome.split(' ')[0];

  return (
    <Animated.View style={[s.fundo, { opacity: opacidade }]}>
      <FlatList
        style={s.lista}
        contentContainerStyle={s.listaContent}
        data={treinos}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderTreino}
        refreshControl={
          <RefreshControl
            refreshing={atualizando}
            onRefresh={onRefresh}
            tintColor={colors.primary}
          />
        }
        ListHeaderComponent={
          <View>
            <View style={s.headerUsuario}>
              <View style={s.avatar}>
                <Text style={s.avatarTexto}>
                  {usuario.nome.charAt(0).toUpperCase()}
                </Text>
              </View>
              <View style={s.flexUm}>
                <Text style={s.saudacao}>Olá, {primeiroNome}! 👋</Text>
                <Text style={s.subSaudacao}>Pronto para mais um treino hoje?</Text>
              </View>
              <TouchableOpacity style={s.btnSair} onPress={handleSair}>
                <Text style={s.btnSairTexto}>Sair</Text>
              </TouchableOpacity>
            </View>

            <View style={s.statsRow}>
              <View style={s.statCard}>
                <Text style={s.statLabel}>Total</Text>
                <Text style={s.statValor}>{stats.total}</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statLabel}>Concluídos</Text>
                <Text style={s.statValor}>{stats.concluidos}</Text>
              </View>
              <View style={s.statCard}>
                <Text style={s.statLabel}>Último</Text>
                <Text style={[s.statValor, s.statValorPequeno]}>{stats.ultimo}</Text>
              </View>
            </View>

            <View style={s.tituloLinha}>
              <Text style={s.tituloSecao}>Meus Treinos</Text>
              <TouchableOpacity
                style={s.btnNovo}
                onPress={() => navigation.navigate('TreinoForm', {})}
              >
                <Text style={s.btnNovoTexto}>+ Novo</Text>
              </TouchableOpacity>
            </View>
          </View>
        }
        ListEmptyComponent={
          <View style={s.vazio}>
            <Text style={s.vazioTexto}>
              Nenhum treino cadastrado.{'\n'}Toque em "+ Novo" para começar!
            </Text>
          </View>
        }
      />
    </Animated.View>
  );
}

const s = StyleSheet.create({
  fundo: { flex: 1, backgroundColor: colors.bg },
  lista: { backgroundColor: colors.bg },
  listaContent: { padding: 16, paddingBottom: 32 },
  flexUm: { flex: 1 },
  centro: {
    flex: 1,
    backgroundColor: colors.bg,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerUsuario: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTexto: { color: '#fff', fontSize: 20, fontWeight: 'bold' },
  saudacao: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  subSaudacao: { color: colors.textSecondary, fontSize: 13 },
  btnSair: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: colors.danger,
  },
  btnSairTexto: { color: colors.danger, fontWeight: 'bold' },
  statsRow: { flexDirection: 'row', gap: 8, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: colors.bgCard,
    padding: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
  },
  statLabel: { color: colors.textSecondary, fontSize: 12, marginBottom: 4 },
  statValor: { color: colors.primary, fontSize: 24, fontWeight: 'bold' },
  statValorPequeno: { fontSize: 14 },
  tituloLinha: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  tituloSecao: { color: colors.text, fontSize: 18, fontWeight: 'bold' },
  btnNovo: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  btnNovoTexto: { color: '#fff', fontWeight: 'bold' },
  card: {
    backgroundColor: colors.bgCard,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 12,
  },
  tipoTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.tipoBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
    marginBottom: 8,
  },
  tipoTexto: { color: colors.primary, fontSize: 12, fontWeight: 'bold' },
  cardTitulo: { color: colors.text, fontSize: 16, fontWeight: 'bold' },
  cardDescricao: { color: colors.textSecondary, fontSize: 13, marginTop: 4 },
  cardInfo: { flexDirection: 'row', gap: 12, marginTop: 10, marginBottom: 12 },
  infoTexto: { color: colors.textSecondary, fontSize: 12 },
  acoes: { flexDirection: 'row', gap: 8 },
  btnAcao: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  btnAcaoTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  vazio: { padding: 32, alignItems: 'center' },
  vazioTexto: { color: colors.textSecondary, textAlign: 'center', fontSize: 14 },
});
