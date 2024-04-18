import {
  Alert,
  Dimensions,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { signIn } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
const SignIn = () => {
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const [form, setForm] = useState({
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const submit = async () => {
    if (!form.email || !form.password) {
      return Alert.alert('Error', 'Please fll in all the fields');
    }
    try {
      setIsSubmitting(true);
      await signIn(form.email, form.password);
      setUser(result);
      setIsLoggedIn(true);
      router.replace('/home');
    } catch (error) {
      console.log(error);

      Alert.alert('Error', error.message);
    } finally {
      setIsSubmitting(false);
    }
  };
  return (
    <SafeAreaView className="bg-primary h-full w-full">
      <ScrollView contentContainerStyle={{ height: '100%' }}>
        <View
          className="w-full justify-center    h-full px-4 my-6 "
          style={{
            minHeight: Dimensions.get('window').height - 100,
          }}
        >
          <Image
            source={images.logo}
            resizeMode="contain"
            className="w-[115px] h-[35px]"
          />
          <Text className="text-2xl font-psemibold mt-10 text-white">
            Log in to Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={e => setForm({ ...form, email: e })}
            otherStyles={' mt-7'}
            keyboardType="email-address"
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={e => setForm({ ...form, password: e })}
            otherStyles={' mt-7'}
          />
          <CustomButton
            title="Sign in"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100">
              Don't have an account?{' '}
              <Link className="text-secondary font-psemibold" href={'/sign-up'}>
                Sign Up
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignIn;

const styles = StyleSheet.create({});
