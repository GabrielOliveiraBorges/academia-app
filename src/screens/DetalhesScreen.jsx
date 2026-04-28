import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { api } from '../api';
import { useAuth } from '../AuthContext';
import { colors } from '../styles';

function formatarDuracao(minutos) {
  const min = Number(minutos) || 0;
  if (min <= 0) return '-';
  const h = Math.floor(min / 60);
  const m = min % 60;
  if (h === 0) return `${m}min`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}min`;
}

function formatarDescanso(segundos) {
  const seg = Number(segundos) || 0;
  if (seg <= 0) return '-';
  const m = Math.floor(seg / 60);
  const s = seg % 60;
  if (m === 0) return `${s}s`;
  if (s === 0) return `${m}min`;
  return `${m}min ${s}s`;
}

export default function DetalhesScreen({ navigation, route }) {
  const { treinoId } = route.params;
  const { usuario } = useAuth();
  const [treino, setTreino] = useState(null);
  const [exercicios, setExercicios] = useState([]);
  const [catalogo, setCatalogo] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [concluindo, setConcluindo] = useState(false);

  const carregar = useCallback(async () => {
    try {
      const [t, todosEx, cat] = await Promise.all([
        api.obterTreino(treinoId),
        api.listarTreinoExercicios(),
        api.listarExercicios(),
      ]);
      const meus = todosEx
        .filter((te) => String(te.treino_id) === String(treinoId))
        .sort((a, b) => (a.ordem || 0) - (b.ordem || 0));
      setTreino(t);
      setExercicios(meus);
      setCatalogo(cat);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível carregar os detalhes.');
    } finally {
      setCarregando(false);
    }
  }, [treinoId]);

  useFocusEffect(
    useCallback(() => {
      carregar();
    }, [carregar]),
  );

  function nomeExercicio(id) {
    const ex = catalogo.find((e) => String(e.id) === String(id));
    return ex ? ex.nome : 'Exercício não encontrado';
  }
  function grupoExercicio(id) {
    const ex = catalogo.find((e) => String(e.id) === String(id));
    return ex ? ex.grupo_muscular : '-';
  }

  function handleExcluirEx(regId) {
    Alert.alert('Remover exercício?', 'Este exercício será removido do treino.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Remover',
        style: 'destructive',
        onPress: async () => {
          try {
            await api.excluirTreinoExercicio(regId);
            carregar();
          } catch (e) {
            Alert.alert('Erro', 'Não foi possível remover.');
          }
        },
      },
    ]);
  }

  async function concluirTreino() {
    if (!treino) return;
    setConcluindo(true);
    try {
      await api.registrarHistorico({
        usuario_id: usuario.id,
        treino_id: treino.id,
        data_execucao: new Date().toISOString().split('T')[0],
        duracao_real: treino.duracao_minutos,
        concluido: true,
        avaliacao: 5,
      });
      Alert.alert('Treino concluído! 💪', 'Bom trabalho!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível registrar o treino.');
    } finally {
      setConcluindo(false);
    }
  }

  if (carregando || !treino) {
    return (
      <View style={s.centro}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        <Text style={s.titulo}>{treino.nome}</Text>
        {treino.descricao ? (
          <Text style={s.descricao}>{treino.descricao}</Text>
        ) : null}
        <View style={s.metaLinha}>
          <View style={s.tipoTag}>
            <Text style={s.tipoTexto}>{treino.tipo}</Text>
          </View>
          <Text style={s.metaTexto}>
            ⏱️ {formatarDuracao(treino.duracao_minutos)}
          </Text>
        </View>

        <View style={s.secaoHeader}>
          <Text style={s.secaoTitulo}>Exercícios ({exercicios.length})</Text>
          <TouchableOpacity
            style={s.btnAdicionar}
            onPress={() =>
              navigation.navigate('ExercicioForm', { treinoId: treino.id })
            }
          >
            <Text style={s.btnAdicionarTexto}>+ Adicionar</Text>
          </TouchableOpacity>
        </View>

        {exercicios.length === 0 ? (
          <Text style={s.vazio}>
            Nenhum exercício. Toque em "+ Adicionar" acima.
          </Text>
        ) : (
          exercicios.map((te) => (
            <View key={te.id} style={s.exItem}>
              <View style={{ flex: 1 }}>
                <Text style={s.exNome}>{nomeExercicio(te.exercicio_id)}</Text>
                <View style={s.exInfoLinha}>
                  <Text style={s.exInfo}>💪 {grupoExercicio(te.exercicio_id)}</Text>
                  <Text style={s.exInfo}>🔢 {te.series} séries</Text>
                  <Text style={s.exInfo}>🔁 {te.repeticoes} reps</Text>
                </View>
                <View style={s.exInfoLinha}>
                  <Text style={s.exInfo}>⚖️ {te.carga_kg} kg</Text>
                  <Text style={s.exInfo}>⏸️ {formatarDescanso(te.descanso_seg)}</Text>
                </View>
              </View>
              <View style={s.exAcoes}>
                <TouchableOpacity
                  style={[s.btnIcone, { backgroundColor: '#3a3a3a' }]}
                  onPress={() =>
                    navigation.navigate('ExercicioForm', {
                      treinoId: treino.id,
                      regId: te.id,
                    })
                  }
                >
                  <Text>✏️</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[s.btnIcone, { backgroundColor: colors.danger }]}
                  onPress={() => handleExcluirEx(te.id)}
                >
                  <Text>🗑️</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))
        )}
      </ScrollView>

      <View style={s.rodape}>
        <TouchableOpacity
          style={[s.btnConcluir, concluindo && { opacity: 0.6 }]}
          onPress={concluirTreino}
          disabled={concluindo}
        >
          {concluindo ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={s.btnConcluirTexto}>✓ Concluir Treino</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  centro: { flex: 1, backgroundColor: colors.bg, justifyContent: 'center', alignItems: 'center' },
  titulo: { color: colors.text, fontSize: 22, fontWeight: 'bold' },
  descricao: { color: colors.textSecondary, marginTop: 6, fontSize: 14 },
  metaLinha: { flexDirection: 'row', alignItems: 'center', gap: 12, marginTop: 12 },
  tipoTag: {
    backgroundColor: colors.tipoBg,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 4,
  },
  tipoTexto: { color: colors.primary, fontSize: 12, fontWeight: 'bold' },
  metaTexto: { color: colors.textSecondary, fontSize: 13 },
  secaoHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 24,
    marginBottom: 12,
  },
  secaoTitulo: { color: colors.primary, fontSize: 16, fontWeight: 'bold' },
  btnAdicionar: {
    backgroundColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 6,
  },
  btnAdicionarTexto: { color: '#fff', fontWeight: 'bold', fontSize: 13 },
  vazio: {
    color: colors.textSecondary,
    textAlign: 'center',
    padding: 24,
    fontSize: 13,
  },
  exItem: {
    flexDirection: 'row',
    backgroundColor: colors.bgCard,
    padding: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 10,
    gap: 10,
  },
  exNome: { color: colors.text, fontWeight: 'bold', fontSize: 15 },
  exInfoLinha: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 4 },
  exInfo: { color: colors.textSecondary, fontSize: 12 },
  exAcoes: { gap: 6 },
  btnIcone: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: 6,
    alignItems: 'center',
  },
  rodape: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    backgroundColor: colors.bg,
    borderTopWidth: 1,
    borderTopColor: colors.border,
  },
  btnConcluir: {
    backgroundColor: colors.success,
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  btnConcluirTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
});
