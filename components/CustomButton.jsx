import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';

const CustomButton = ({
  title,
  containerStyles,
  textStyles,
  handlePress,
  isLoading,
}) => {
  return (
    <TouchableOpacity
      onPress={handlePress}
      activeOpacity={0.7}
      className={`bg-secondary rounded-xl font-pregular min-h-[58px] justify-center items-center ${containerStyles} ${
        isLoading ? 'opacity-50' : ''
      } `}
      disabled={isLoading}
    >
      <Text className={`text-primary font-semibold text-lg ${textStyles}`}>
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default CustomButton;

const styles = StyleSheet.create({});
