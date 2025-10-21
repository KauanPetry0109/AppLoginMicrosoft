import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import * as Google from 'expo-auth-session/providers/google';
import * as WebBrowser from 'expo-web-browser';

// Configurar para abrir autenticação no navegador
WebBrowser.maybeCompleteAuthSession();

export default function App() {
  const [userInfo, setUserInfo] = useState(null);
  const [request, response, promptAsync] = Google.useAuthRequest({
    // ⚠️ SUBSTITUA pelos seus próprios Client IDs
    expoClientId: 'YOUR_EXPO_CLIENT_ID',
    androidClientId: 'YOUR_ANDROID_CLIENT_ID', 
    iosClientId: 'YOUR_IOS_CLIENT_ID',
    webClientId: 'YOUR_WEB_CLIENT_ID',
  });

  useEffect(() => {
    if (response?.type === 'success') {
      const { authentication } = response;
      getUserInfo(authentication.accessToken);
    }
  }, [response]);

  const getUserInfo = async (token) => {
    if (!token) return;
    
    try {
      const response = await fetch(
        'https://www.googleapis.com/userinfo/v2/me',
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      
      const user = await response.json();
      setUserInfo(user);
      console.log('Usuário logado:', user);
    } catch (error) {
      Alert.alert('Erro', 'Falha ao buscar informações do usuário');
      console.error('Erro:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await promptAsync();
    } catch (error) {
      Alert.alert('Erro', 'Falha no login');
      console.error('Erro login:', error);
    }
  };

  const handleLogout = () => {
    setUserInfo(null);
    Alert.alert('Logout', 'Você saiu da conta');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>🔐 Login com Google</Text>
      
      {userInfo ? (
        <View style={styles.profileContainer}>
          {userInfo.picture && (
            <Image 
              source={{ uri: userInfo.picture }} 
              style={styles.avatar} 
            />
          )}
          <Text style={styles.name}>Olá, {userInfo.name}! 👋</Text>
          <Text style={styles.email}>{userInfo.email}</Text>
          
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>🚪 Sair</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <TouchableOpacity 
          style={styles.loginButton} 
          onPress={handleLogin}
          disabled={!request}
        >
          <Text style={styles.loginText}>🎯 Entrar com Google</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f8ff',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    color: '#2c3e50',
  },
  loginButton: {
    backgroundColor: '#4285f4',
    paddingHorizontal: 40,
    paddingVertical: 18,
    borderRadius: 12,
    elevation: 5,
    shadowOffset: { width: 2, height: 2 },
    shadowColor: '#333',
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  loginText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 30,
    borderRadius: 15,
    elevation: 8,
    shadowOffset: { width: 3, height: 3 },
    shadowColor: '#333',
    shadowOpacity: 0.4,
    shadowRadius: 6,
    minWidth: 250,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 20,
    borderWidth: 3,
    borderColor: '#4285f4',
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#2c3e50',
    textAlign: 'center',
  },
  email: {
    fontSize: 16,
    color: '#7f8c8d',
    marginBottom: 25,
    textAlign: 'center',
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