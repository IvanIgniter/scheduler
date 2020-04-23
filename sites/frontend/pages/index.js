import React, { PureComponent, Fragment } from 'react'
import Layout from '../components/Layout';
import Scheduler from '../components/Scheduler.jsx';
import Head from 'next/head';
import http from '../lib/http';
import {formatDate} from '../lib/common';

class Index extends PureComponent {

  constructor(props) {
    super(props);

  }

  static async getInitialProps (context) {
    const { query } = context;
    let records = [];

    try {
    let { data:body } = await http().get(`api/schedules`);
    records = body;

  } catch (error) {
    console.log(error)
    throw error
  }

  return {
    records
  }
  
  }

  handleSaveSchedule = (schedule, requestType) => {
    console.log("handleSaveSchedule-schedule",schedule)
    console.log("handleSaveSchedule-schedule",schedule.DayTypeLeaves)
    let rType = "post";
    let data = null;
    let id = null;

    if (requestType === "eventCreated") {
      rType = "post";
      // let day_type_leave = [];
      // let details = schedule.selectedSchedule.details;
      // for (let i=1; i<=details.length+1; i++) {
      //   day_type_leave.push({
      //     'schedule_id': schedule.Id,
      //     'date': detail.date,
      //     'day_type_leave': detail.dayTypeLeave,
      //   })
      // }
   
        // day_type_leave = schedule[0]['DayTypeLeave1'] ? schedule[0]['DayTypeLeave1'] : '';
      
      // data = {
      //   user_id: schedule.userId,
      //   title: schedule.Subject,
      //   location: schedule.Location ? schedule.Location : '',
      //   description: schedule.Description ? schedule.Description : '',
      //   start_time: schedule.StartTime ? formatDate(schedule.StartTime) : '',
      //   end_time: schedule.EndTime ? formatDate(schedule.EndTime) : '',
      //   classification: schedule.Classification ? schedule.Classification : '',
      //   leave_type: schedule.LeaveType ? schedule.LeaveType : '',
      //   day_type_leaves: schedule.DayTypeLeaves ? schedule.DayTypeLeaves : '',
      // };

    } else if (requestType === "eventChanged") {
      rType = "put";
      id = schedule.Id;

    } else if (requestType === "eventRemoved") {
      rType = "delete";
      this.updateApi(null, rType, schedule.Id);
      return;
    }

    data = {
      id: id,
      user_id: schedule.userId,
      title: schedule.Subject ? schedule.Subject : '',
      location: schedule.Location ? schedule.Location : '',
      description: schedule.Description ? schedule.Description : '',
      start_time: schedule.StartTime ? formatDate(schedule.StartTime) : '',
      end_time: schedule.EndTime ? formatDate(schedule.EndTime) : '',
      classification: schedule.Classification ? schedule.Classification : '',
      leave_type: schedule.LeaveType ? schedule.LeaveType : '',
      day_type_leaves: schedule.DayTypeLeaves ? schedule.DayTypeLeaves : '',
    };

    const user_id = 1;

    console.log("handleSaveSchedule-data",data)

    let form = new FormData()

    form.append(`schedule[user_id]`, user_id)
    form.append(`schedule[title]`, data.title)
    form.append(`schedule[location]`, data.location)
    form.append(`schedule[description]`, data.description)
    form.append(`schedule[start_time]`, data.start_time)
    form.append(`schedule[end_time]`, data.end_time)
    form.append(`schedule[classification]`, data.classification)
    form.append(`schedule[leave_type]`, data.leave_type)
    form.append(`schedule[day_type_leaves]`, JSON.stringify(data.day_type_leaves))

    this.updateApi(form, rType, id);
  }


  updateApi = async (data, requestType, id = null) => {
      try {
        // console.log("updateApi-form",data, id)
        let body = null;
        
        if (requestType === 'post') {
          const {data: body} = await http().post(`api/schedules`, data)
        } else if (requestType === 'put') {
          const {data: body} = await http().post(`/api/schedules/${id}?_method=PUT`, data)
          
        } else if (requestType === 'delete') {
          const {data: body} = await http().post(`api/schedules/${id}?_method=DELETE`)
        } 
        // let { data:body } = await http().get(`api/schedules`);
        // console.error("updateApi-body",body)
      } catch (e) {
        console.error(e)
      }
  
  }



  render () {
    console.log("index-render-props",this.props)
    // console.log("index render state",this.state)
    const {records} = this.props;
    // const records = [];
    return (
      <div>
        <Head>
          <title>Scheduler</title>
        </Head>
 
        <Scheduler records={records.data} saveSchedule={this.handleSaveSchedule}  />
   
        <div>
        </div>
      </div>
    );
  }
}


export default Index
