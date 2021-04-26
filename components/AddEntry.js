import React, {Component} from 'react'
import { View, Text,TouchableOpacity } from 'react-native'
import { getDailyReminder, getMetricMetaInfo, timeToString } from '../utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import UdaciSlider from './UdaciSlider'
import UdaciStepper from './UdaciStepper'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import {submitEntry , removeEntry} from '../utils/api'
import addEntry from '../actions'
import { connect } from 'react-redux'

function SubmitBtn({ onPress }){
    return (
        <TouchableOpacity
        onPress = {onPress}>
            <Text>Submit</Text>
        </TouchableOpacity>
    )
}
class AddEntry extends Component{
    state = {
        run : 0,
        bike: 0,
        swim: 0,
        sleep: 0,
        eat: 0,
    }

    increment = (metric) => {
        const {max, step} = getMetricMetaInfo(metric)

        this.setState((state) => {
            const count = state[metric] + step

            return {
                ...state,
                [metric] : count > max ? max : count
            }
        })
    }

    decrement = (metric) => {
        this.setState((state) => {
            const count = state[metric] - getMetricMetaInfo(metric).step

            return {
                ...state,
                [metric] : count < 0 ? 0 : count
            }
        })
    }

    slide = (metric,value) => {
        this.setState(() => ({
            [metric] : value
        }))
    }

    submit = () => {
        const key = timeToString()
        const entry = this.state 

        this.props.dispatch(addEntry({
            [key] : entry
        }))

        this.setState(() => ({
            run : 0,
            bike: 0,
            swim: 0,
            sleep: 0,
            eat: 0,
        }))

        submitEntry({key,entry})
        //Update Redux
        //Naviagte to Home
    }
    reset = () => {
        const key = timeToString()
        this.props.dispatch(addEntry({
            [key]: getDailyReminder()
          }))
        removeEntry(key)
    }
    render(){
        const metainfo = getMetricMetaInfo()
        if(this.props.alreadyLogged){
            return (
                <View>
                    <Ionicons 
                    name="ios-happy-outline" 
                    size={100} 
                    color="black" 
                    />
                    <Text>You have already logged data for today</Text>
                    <TextButton onPress={this.reset}>
                        <Text>Reset</Text>
                    </TextButton>
                </View>
            )
        }
        return (
            <View>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {Object.keys(metainfo).map((key) => {
                    const {getIcon, type, ...rest} = metainfo[key]
                    const value = this.state[key]
                    return (
                        <View key={key}>
                            <Text >
                            {getIcon()}
                            { type === 'slider' ?
                            <UdaciSlider 
                            value ={value}
                            onChange ={(value) => this.slide(key,value)}
                            {...rest}/> :
                            <UdaciStepper
                            value = {value}
                            onIncrement = {() => this.increment(key)}
                            onDecrement = {() => this.decrement(key)}
                            {...rest}
                            />}
                            </Text>
                        </View>
                        )
                })}
                <Text>Nothing Wrong</Text>
                <SubmitBtn onPress={this.submit}/>
            </View>
        )
    }
}

function mapStatetoProps(state){
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStatetoProps)(AddEntry)