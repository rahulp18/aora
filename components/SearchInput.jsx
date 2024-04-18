import {
  Alert,
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import React, { useState } from 'react';
import { icons, images } from '../constants';
import { router, usePathname } from 'expo-router';

const SearchInput = ({
  title,
  value,
  placeholder,
  handleChangeText,
  otherStyles,
  initialQuery,
  ...props
}) => {
  const pathname = usePathname();
  const [query, setQuery] = useState(initialQuery || '');
  return (
    <View
      className="w-full h-16 px-4 bg-black-100 border-2 border-black-200 rounded-2xl
       focus:border-secondary items-center flex-row space-x-4"
    >
      <TextInput
        className="  text-white text-base mt-0.5 font-pregular flex-1"
        value={query}
        placeholder={placeholder}
        placeholderTextColor={'#cdcde0'}
        onChangeText={e => setQuery(e)}
      />
      <TouchableOpacity
        onPress={() => {
          if (!query) {
            return Alert.alert(
              'Missing Query',
              'Please input something to search result across database',
            );
          }
          if (pathname.startsWith('/search')) router.setParams({ query });
          else router.push(`/search/${query}`);
        }}
      >
        <Image source={icons.search} className="w-5 h-5" resizeMode="contain" />
      </TouchableOpacity>
    </View>
  );
};

export default SearchInput;
