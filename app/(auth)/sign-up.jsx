import {
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Dimensions,
} from 'react-native';
import React, { useState } from 'react';
import { images } from '../../constants';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUser } from '../../lib/appwrite';
import { useGlobalContext } from '../../context/GlobalProvider';
const SignUp = () => {
  const [form, setForm] = useState({
    username: '',
    email: '',
    password: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { setUser, setIsLoggedIn } = useGlobalContext();
  const submit = async () => {
    if (!form.email || !form.password || !form.username) {
      return Alert.alert('Error', 'Please fll in all the fields');
    }
    try {
      setIsSubmitting(true);
      const result = await createUser(form);
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
      <ScrollView>
        <View
          className="w-full justify-center   h-full px-4 my-6"
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
            Sign up to Aora
          </Text>
          <FormField
            title="Email"
            value={form.email}
            handleChangeText={e => setForm({ ...form, email: e })}
            otherStyles={' mt-7'}
            keyboardType="email-address"
          />
          <FormField
            title="Username"
            value={form.username}
            handleChangeText={e => setForm({ ...form, username: e })}
            otherStyles={' mt-5'}
          />
          <FormField
            title="Password"
            value={form.password}
            handleChangeText={e => setForm({ ...form, password: e })}
            otherStyles={' mt-5'}
          />
          <CustomButton
            title="Sign Up"
            handlePress={submit}
            containerStyles="mt-7"
            isLoading={isSubmitting}
          />
          <View className="justify-center pt-5 flex-row gap-2">
            <Text className="text-lg text-gray-100">
              have an account already?{' '}
              <Link className="text-secondary font-psemibold" href={'/sign-in'}>
                Sign In
              </Link>
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
