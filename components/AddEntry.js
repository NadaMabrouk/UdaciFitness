import React, {Component} from 'react'
import { View, Text,TouchableOpacity,StyleSheet,Platform,Dimensions } from 'react-native'
import { getDailyReminder, getMetricMetaInfo, timeToString } from '../utils/helpers'
import { Ionicons } from '@expo/vector-icons'
import UdaciSlider from './UdaciSlider'
import UdaciStepper from './UdaciStepper'
import DateHeader from './DateHeader'
import TextButton from './TextButton'
import {submitEntry , removeEntry} from '../utils/api'
import { addEntry } from '../actions'
import { connect } from 'react-redux'
import {white, purple} from '../utils/colors'

function SubmitBtn({ onPress }){
    return (
        <TouchableOpacity 
        style={Platform.OS === 'ios' ? styles.iosSubmitBtn : styles.AndroidSubmitBtn}
        onPress = {onPress}>
            <Text style={styles.submitBtnText}>Submit</Text>
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
        const entry = [this.state]

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
        const {width,height} = Dimensions.get('window')
        if(this.props.alreadyLogged){
            return (
                <View style={styles.center}>
                    <Ionicons 
                    name="ios-happy-outline" 
                    size={100} 
                    color="black" 
                    />
                    <Text>You have already logged data for today</Text>
                    <TextButton style={{padding:10}} onPress={this.reset}>
                        <Text>Reset</Text>
                    </TextButton>
                </View>
            )
        }
        return (
            <View style={styles.container}>
                <DateHeader date={(new Date()).toLocaleDateString()}/>
                {Object.keys(metainfo).map((key) => {
                    const {getIcon, type, ...rest} = metainfo[key]
                    const value = this.state[key]
                    return (
                        <View key={key} style={styles.row}>
                            {getIcon()}
                            {type === "slider" ? (
                            <UdaciSlider
                            value={value}
                            onChange={value => this.slide(key, value)}
                            {...rest}
                            />
                        ) : (
                            <UdaciStepper
                            value={value}
                            onIncrement={() => this.increment(key)}
                            onDecrement={() => this.decrement(key)}
                            {...rest}
                            />
                        )}
                        </View>
                        )
                })}
                <SubmitBtn onPress={this.submit}/>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex:1,
        padding: 20,
        backgroundColor: white
    },
    row: {
        flexDirection: "row",
        flex:1,
        alignItems: "center",
    },
    iosSubmitBtn: {
        backgroundColor: purple,
        padding: 10,
        borderRadius: 7,
        height: 45,
        marginLeft: 40,
        marginRight: 40,
        marginRight: 40
    },
    AndroidSubmitBtn: {
        backgroundColor: purple,
        paddingRight: 30,
        paddingLeft: 30,
        height: 45,
        borderRadius: 2,
        alignSelf: "flex-end",
        justifyContent: "center",
        alignItems: "center"
    },
    submitBtnText: {
        color: white,
        fontSize: 22,
        textAlign: "center"
        },
        center: {
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            marginLeft: 30,
            marginRight:30
        }
})

function mapStatetoProps(state){
  const key = timeToString()

  return {
    alreadyLogged: state[key] && typeof state[key].today === 'undefined'
  }
}

export default connect(mapStatetoProps)(AddEntry)