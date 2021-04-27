import React from 'react'
import { View,Text } from 'react-native'
import { connect } from 'react-redux'
import { addEntry, receiveEntries } from '../actions'
import { fetchCalenderResults } from '../utils/api'
import { getDailyReminder, timeToString } from '../utils/helpers'
import {Agenda as UdaciFitnessCalendar} from 'react-native-calendars'

class History extends React.Component{
    componentDidMount(){
        const {dispatch} = this.props

        fetchCalenderResults()
        .then((entries) => {
            dispatch(receiveEntries(entries))
        })
        .then(({entries}) => {
            if(!entries[timeToString()]){
                dispatch(addEntry({
                    [timeToString()] : getDailyReminder()
                }))
            }
        })
    }
    renderItem = ({ today, ...metrics }, formattedDate, key) => (
        <View>
          {today
            ? <Text>{JSON.stringify(today)}</Text>
            : <Text>{JSON.stringify(metrics)}</Text>}
        </View>
      )

      renderEmptyDate(formattedDate) {
        return (
          <View>
            <Text>No Data for this day</Text>
          </View>
        )
      }
    render(){
        const {entries} = this.props
        return (
            <View>
                <UdaciFitnessCalendar 
                    items={entries}
                    renderItem={this.renderItem}
                    renderEmptyDate={this.renderEmptyDate}
                />
            </View>
        )
    }
}
function mapStatetoProps(entries){
    return {
        entries
    }
}
export default connect(mapStatetoProps)(History)