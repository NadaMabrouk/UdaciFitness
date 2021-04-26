import React from 'react'
import {View, Text } from 'react-native'
import Slider from '@react-native-community/slider'

export default function UdaciSlider({max,unit,step,value,onChange}){
        return (
            <View>
                <View>
                <Slider 
                    style={{width: 200}}
                    step={step}
                    value={value}
                    maximumValue={max}
                    minimumValue={0}
                    onValueChange = {onChange}
                /> 
               </View>
               <View>
                    <Text>{value}</Text>
                    <Text>{unit}</Text>
                </View>
            </View>
        )
}