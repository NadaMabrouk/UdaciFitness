import React from 'react'
import {TouchableOpacity} from 'react-native'

export default function TextButton({children,onPress}){
    return (
        <TouchableOpacity onPress={onPress}>
            {children}
        </TouchableOpacity>
    )
}