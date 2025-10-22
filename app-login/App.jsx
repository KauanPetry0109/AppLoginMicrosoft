import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, Linking } from 'react-native';

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(false);

  // SEU CLIENT ID REAL
  const CLIENT_ID = '91884546511-ds7ft54unsig82fkpts63r2qbgj9f21k.apps.googleusercontent.com';
  
  // URL de redirecionamento para Expo
  const REDIRECT_URI = 'https://auth.expo.io/@kauan_petry/logingoogleapp';

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      
      // Parâmetros para OAuth do Google
      const authUrl = [
        'https://accounts.google.com/o/oauth2/v2/auth',
        `?client_id=${CLIENT_ID}`,
        '&response_type=token',
        '&scope=profile email',
        `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}`,
        '&prompt=select_account'
      ].join('');

      console.log('URL de Login:', authUrl);
      
      // Abre no navegador
      const supported = await Linking.canOpenURL(authUrl);
      
      if (supported) {
        await Linking.openURL(authUrl);
      } else {
        Alert.alert('Erro', 'Não foi possível abrir o navegador');
      }
      
    } catch (error) {
      console.error('Erro:', error);
      Alert.alert('Erro', 'Falha ao iniciar login: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    Alert.alert('Logout', 'Você saiu da conta');
  };

  // Simulação de dados para teste
  const handleTestLogin = () => {
    setUserInfo({
      name: 'João Silva (Teste)',
      email: 'joao.silva@gmail.com',
      id: '123456789'
    });
    Alert.alert('Modo Teste', 'Login simulado para demonstração');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login com Google</Text>
      
      {userInfo ? (
        <View style={styles.profileContainer}>
          <Text style={styles.name}>Olá, {userInfo.name}! 👋</Text>
          <Text style={styles.email}>{userInfo.email}</Text>
          <Text style={styles.id}>ID: {userInfo.id}</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.loginContainer}>
          <Text style={styles.instruction}>
            Escolha uma opção de login:
          </Text>
          
          <TouchableOpacity 
            style={[styles.loginButton, loading && styles.disabledButton]} 
            onPress={handleGoogleLogin}
            disabled={loading}
          >
            <Text style={styles.loginText}>
              {loading ? '🔄 Abrindo...' : '🌐 Login Real com Google'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[styles.testButton, loading && styles.disabledButton]} 
            onPress={handleTestLogin}
            disabled={loading}
          >
            <Text style={styles.testButtonText}>
              🧪 Modo Teste (Simulação)
            </Text>
          </TouchableOpacity>

          <Text style={styles.note}>
            O login real abrirá seu navegador para autenticação com Google
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2c3e50',
    textAlign: 'center',
  },
  loginContainer: {
    alignItems: 'center',
    width: '100%',
  },
  instruction: {
    fontSize: 18,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  testButton: {
    backgroundColor: '#34a853',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 15,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    opacity: 0.6,
  },
  loginText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  testButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 12,
    color: '#95a5a6',
    textAlign: 'center',
    marginTop: 20,
    fontStyle: 'italic',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    elevation: 8,
    minWidth: 300,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
  },
  email: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 8,
  },
  id: {
    fontSize: 12,
    color: '#bdc3c7',
    marginBottom: 25,
  },
  logoutButton: {
    backgroundColor: '#ea4335',
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});