import { View, Text } from 'react-native'
import React from 'react'

const ChatHeader = (props) => {
  const { data } = props
  return (
    <View>
      <Text style={{ color: 'black' }}>{data.name}</Text>
    </View>
  )
}

export default ChatHeader