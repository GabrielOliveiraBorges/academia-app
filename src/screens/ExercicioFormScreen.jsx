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
  Modal,
  FlatList,
} from 'react-native';

import { api } from '../api';
import { colors } from '../styles';

export default function ExercicioFormScreen({ navigation, route }) {
  const { treinoId, regId } = route.params;
  const editando = !!regId;

  const [catalogo, setCatalogo] = useState([]);
  const [exercicioId, setExercicioId] = useState('');
  const [series, setSeries] = useState('3');
  const [repeticoes, setRepeticoes] = useState('10-12');
  const [cargaKg, setCargaKg] = useState('0');
  const [descansoMin, setDescansoMin] = useState('1');
  const [descansoSeg, setDescansoSeg] = useState('0');
  const [carregando, setCarregando] = useState(true);
  const [salvando, setSalvando] = useState(false);
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    async function bootstrap() {
      try {
        const cat = await api.listarExercicios();
        setCatalogo(cat);

        if (editando) {
          const te = await api.obterTreinoExercicio(regId);
          setExercicioId(String(te.exercicio_id));
          setSeries(String(te.series));
          setRepeticoes(te.repeticoes);
          setCargaKg(String(te.carga_kg));
          setDescansoMin(String(Math.floor((te.descanso_seg || 0) / 60)));
          setDescansoSeg(String((te.descanso_seg || 0) % 60));
        }
      } catch (e) {
        Alert.alert('Erro', 'Não foi possível carregar os dados.');
      } finally {
        setCarregando(false);
      }
    }
    bootstrap();
  }, [regId, editando]);

  async function salvar() {
    if (!exercicioId) {
      Alert.alert('Atenção', 'Selecione um exercício.');
      return;
    }

    const dados = {
      treino_id: treinoId,
      exercicio_id: exercicioId,
      series: parseInt(series, 10) || 1,
      repeticoes: repeticoes.trim(),
      carga_kg: parseFloat(cargaKg) || 0,
      descanso_seg:
        (parseInt(descansoMin, 10) || 0) * 60 + (parseInt(descansoSeg, 10) || 0),
      ordem: 1,
    };

    setSalvando(true);
    try {
      if (editando) {
        await api.atualizarTreinoExercicio(regId, dados);
      } else {
        await api.criarTreinoExercicio(dados);
      }
      navigation.goBack();
    } catch (e) {
      Alert.alert('Erro', 'Não foi possível salvar o exercício.');
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

  const exSelecionado = catalogo.find((e) => String(e.id) === String(exercicioId));

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={s.label}>Exercício</Text>
        <TouchableOpacity style={s.input} onPress={() => setModalAberto(true)}>
          <Text style={{ color: exSelecionado ? colors.text : colors.textSecondary }}>
            {exSelecionado
              ? `${exSelecionado.nome} (${exSelecionado.grupo_muscular})`
              : 'Selecione...'}
          </Text>
        </TouchableOpacity>

        <Text style={s.label}>Séries</Text>
        <TextInput
          style={s.input}
          value={series}
          onChangeText={setSeries}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={s.label}>Repetições (ex: 10 ou 10-12)</Text>
        <TextInput
          style={s.input}
          value={repeticoes}
          onChangeText={setRepeticoes}
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={s.label}>Carga (kg)</Text>
        <TextInput
          style={s.input}
          value={cargaKg}
          onChangeText={setCargaKg}
          keyboardType="numeric"
          placeholderTextColor={colors.textSecondary}
        />

        <Text style={s.label}>Descanso</Text>
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View style={{ flex: 1 }}>
            <TextInput
              style={s.input}
              value={descansoMin}
              onChangeText={setDescansoMin}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={s.subLabel}>minutos</Text>
          </View>
          <View style={{ flex: 1 }}>
            <TextInput
              style={s.input}
              value={descansoSeg}
              onChangeText={setDescansoSeg}
              keyboardType="numeric"
              placeholderTextColor={colors.textSecondary}
            />
            <Text style={s.subLabel}>segundos</Text>
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

      <Modal
        visible={modalAberto}
        animationType="slide"
        onRequestClose={() => setModalAberto(false)}
      >
        <View style={{ flex: 1, backgroundColor: colors.bg, padding: 16 }}>
          <Text style={[s.label, { fontSize: 18, marginBottom: 12 }]}>
            Selecione um exercício
          </Text>
          <FlatList
            data={catalogo}
            keyExtractor={(item) => String(item.id)}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={s.opcao}
                onPress={() => {
                  setExercicioId(String(item.id));
                  setModalAberto(false);
                }}
              >
                <Text style={{ color: colors.text, fontSize: 15 }}>{item.nome}</Text>
                <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                  {item.grupo_muscular} · {item.equipamento}
                </Text>
              </TouchableOpacity>
            )}
          />
          <TouchableOpacity
            style={[s.botao, s.botaoCancelar, { marginTop: 12 }]}
            onPress={() => setModalAberto(false)}
          >
            <Text style={s.botaoCancelarTexto}>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
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
    justifyContent: 'center',
    minHeight: 48,
  },
  acoes: { flexDirection: 'row', gap: 12, marginTop: 28 },
  botao: { flex: 1, padding: 14, borderRadius: 8, alignItems: 'center' },
  botaoPrimario: { backgroundColor: colors.primary },
  botaoPrimarioTexto: { color: '#fff', fontWeight: 'bold', fontSize: 16 },
  botaoCancelar: { backgroundColor: colors.bgCard, borderWidth: 1, borderColor: colors.border },
  botaoCancelarTexto: { color: colors.text, fontWeight: 'bold', fontSize: 16 },
  opcao: {
    backgroundColor: colors.bgCard,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: colors.border,
    marginBottom: 8,
  },
});
