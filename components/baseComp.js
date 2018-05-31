import React, {Component} from "react";
import { 
  TouchableOpacity, 
  Text, 
  Keyboard, 
  TouchableWithoutFeedback,
} from 'react-native';


export const LongButton = (props) => (
    <TouchableOpacity 
      {...props }
      activeOpacity={0.6}
      style={[{alignItems: 'center', 
              justifyContent:'center', 
              width: '80%', 
              marginBottom: 30, 
              height: 50, 
              backgroundColor: '#FFDC97', 
              borderRadius: 5}, props.style]} >
      <Text style={{fontSize: 16, fontWeight: '700', color: '#73520C'}}>{props.title}</Text>
    </TouchableOpacity> 
  );

export const KeyboardDismessView = ({ children }) => (
  <TouchableWithoutFeedback onPress={()=>Keyboard.dismiss()}>
    { children }
  </TouchableWithoutFeedback>
);
