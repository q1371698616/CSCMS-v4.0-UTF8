import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { registerUser } from '../redux/slices/userSlice';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Ionicons';

const RegisterScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);

  const dispatch = useDispatch();
  const { loading } = useSelector(state => state.user);

  const validateForm = () => {
    if (!username.trim()) {
      alert('请输入用户名');
      return false;
    }

    if (username.length < 3 || username.length > 20) {
      alert('用户名长度应在3-20个字符之间');
      return false;
    }

    if (!password) {
      alert('请输入密码');
      return false;
    }

    if (password.length < 6) {
      alert('密码长度不能少于6位');
      return false;
    }

    if (password !== confirmPassword) {
      alert('两次输入的密码不一致');
      return false;
    }

    if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      alert('邮箱格式不正确');
      return false;
    }

    if (phone && !/^1[3-9]\d{9}$/.test(phone)) {
      alert('手机号格式不正确');
      return false;
    }

    if (!email && !phone) {
      alert('请至少填写邮箱或手机号');
      return false;
    }

    if (!agreedToTerms) {
      alert('请同意用户协议和隐私政策');
      return false;
    }

    return true;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      await dispatch(registerUser({
        username,
        password,
        email,
        phone,
        code,
      })).unwrap();

      // 注册成功后会自动跳转
    } catch (error) {
      // 错误已在interceptor中处理
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={['#667eea', '#764ba2']} style={styles.gradient}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardView}
        >
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* 头部 */}
            <View style={styles.header}>
              <TouchableOpacity
                style={styles.backButton}
                onPress={() => navigation.goBack()}
              >
                <Icon name="arrow-back" size={24} color="#fff" />
              </TouchableOpacity>
              <Text style={styles.title}>注册账号</Text>
              <Text style={styles.subtitle}>加入音乐平台，开启音乐之旅</Text>
            </View>

            {/* 表单 */}
            <View style={styles.form}>
              {/* 用户名 */}
              <View style={styles.inputContainer}>
                <Icon name="person-outline" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="用户名 (3-20个字符)"
                  placeholderTextColor="#999"
                  value={username}
                  onChangeText={setUsername}
                  autoCapitalize="none"
                />
              </View>

              {/* 邮箱 */}
              <View style={styles.inputContainer}>
                <Icon name="mail-outline" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="邮箱地址"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>

              {/* 手机号 */}
              <View style={styles.inputContainer}>
                <Icon name="call-outline" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="手机号"
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {/* 验证码 */}
              <View style={styles.inputContainer}>
                <Icon name="shield-checkmark-outline" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={[styles.input, styles.codeInput]}
                  placeholder="验证码"
                  placeholderTextColor="#999"
                  value={code}
                  onChangeText={setCode}
                />
                <TouchableOpacity style={styles.codeButton}>
                  <Text style={styles.codeButtonText}>发送验证码</Text>
                </TouchableOpacity>
              </View>

              {/* 密码 */}
              <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="密码 (至少6位)"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Icon
                    name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              {/* 确认密码 */}
              <View style={styles.inputContainer}>
                <Icon name="lock-closed-outline" size={20} color="#999" style={styles.icon} />
                <TextInput
                  style={styles.input}
                  placeholder="确认密码"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={!showConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                  <Icon
                    name={showConfirmPassword ? 'eye-outline' : 'eye-off-outline'}
                    size={20}
                    color="#999"
                  />
                </TouchableOpacity>
              </View>

              {/* 用户协议 */}
              <View style={styles.termsContainer}>
                <TouchableOpacity
                  style={styles.checkbox}
                  onPress={() => setAgreedToTerms(!agreedToTerms)}
                >
                  <Icon
                    name={agreedToTerms ? 'checkbox' : 'square-outline'}
                    size={20}
                    color={agreedToTerms ? '#667eea' : '#999'}
                  />
                </TouchableOpacity>
                <Text style={styles.termsText}>
                  我已阅读并同意
                  <Text style={styles.termsLink}> 用户协议 </Text>
                  和
                  <Text style={styles.termsLink}> 隐私政策</Text>
                </Text>
              </View>

              {/* 注册按钮 */}
              <TouchableOpacity
                style={styles.registerButton}
                onPress={handleRegister}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color="#667eea" />
                ) : (
                  <Text style={styles.registerButtonText}>注册</Text>
                )}
              </TouchableOpacity>

              {/* 底部链接 */}
              <View style={styles.footer}>
                <Text style={styles.footerText}>已有账号？</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.link}>立即登录</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </LinearGradient>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    opacity: 0.8,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 10,
    paddingHorizontal: 15,
    marginBottom: 15,
    height: 50,
  },
  icon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  codeInput: {
    flex: 0.6,
  },
  codeButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#667eea',
    borderRadius: 5,
  },
  codeButtonText: {
    fontSize: 12,
    color: '#fff',
  },
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 15,
  },
  checkbox: {
    marginRight: 8,
  },
  termsText: {
    flex: 1,
    fontSize: 12,
    color: '#fff',
  },
  termsLink: {
    color: '#FFD700',
    fontWeight: 'bold',
  },
  registerButton: {
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 10,
  },
  registerButtonText: {
    color: '#667eea',
    fontSize: 18,
    fontWeight: 'bold',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  footerText: {
    color: '#fff',
    fontSize: 14,
  },
  link: {
    color: '#FFD700',
    fontSize: 14,
    fontWeight: 'bold',
    marginLeft: 5,
  },
});

export default RegisterScreen;
