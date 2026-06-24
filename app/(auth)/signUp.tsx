import { View, Text } from 'react-native'
import { Link } from 'expo-router'
import React from 'react'

const signUp = () => {
  return (
    <View>
      <Text>signUp</Text>
      <Link href='/(auth)/signIn'>Already have an account? Sign In!</Link>
    </View>
  )
}

export default signUp