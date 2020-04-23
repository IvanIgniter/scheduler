import * as ReactDOM from 'react-dom';
import * as React from 'react';
import { ScheduleComponent, ViewsDirective, ViewDirective, Day, Week, Month, PopupCloseEventArgs, Inject } from '@syncfusion/ej2-react-schedule';
import { L10n, isNullOrUndefined  } from '@syncfusion/ej2-base';
import { FormValidator } from '@syncfusion/ej2-inputs';
import { DateTimePickerComponent } from '@syncfusion/ej2-react-calendars';
import { DropDownListComponent } from '@syncfusion/ej2-react-dropdowns';
import {formatDate} from '../lib/common';
import Head from 'next/head';
import isEmpty from "lodash/isEmpty"
import moment from 'moment';

class Scheduler extends React.Component {
  counter = 0;
  formObject = new FormValidator;
  
  constructor(props) {
    super(props);
    this.isLoading = true;
    this.scheduleObj = null;
    this.isEdit = false;
    this.selectedFrom = null;
    this.selectedTo = null;
    this.hasRendered = false;

    this.state = {
      selectedSchedule: {
        from: null,
        to: null,
        details: [],
        data: null,
      }
    }

    L10n.load({
      'en-US': {
        'schedule': {
          'newEvent': 'Create Leave',
          'editEvent': 'Edit Leave'
        }
      }
    })

    // this.setSelectedSchedule = this.setSelectedSchedule.bind(this)
    // this.editorTemplate = this.editorTemplate.bind(this, this.onSelectEvent, this.selectedTimeChange, this.state.selectedSchedule, this.setSelectedSchedule)
    // this.selectedTimeChange = this.selectedTimeChange.bind(this)

  }

  componentDidMount () {
    // console.log("done loading",this.props)
    if (this.props.records) {
      this.setState({schedules: this.props.records.map(record => ({
        Id: record.id,
        userId: record.user_id,
        Subject: record.title,
        Location: record.location,
        Description: record.description,
        StartTime: formatDate(record.start_time),
        EndTime: formatDate(record.end_time),
        RecurrenceRule: record.recurrence,
        Classification: record.classification,
        LeaveType: record.leave_type,
        DayTypeLeaves: record.day_type_leaves,
      }))
     });
    }

  }

  componentDidUpdate() {
    console.log("componentDidUpdate")
  }

  editorTemplate (onSelectEvent, selectedTimeChange, selectedSchedule, props) {
    console.log("editorTemplate-props",props)
    console.log("editorTemplate-selectedSchedule",selectedSchedule)
    // console.log("editorTemplate-selectedTimeChange",selectedTimeChange)

    let startTime = new Date();
    let endTime = new Date();
    let dateFormat = 'MMM. dd, yyyy';
    let data = {
      Id: null,
      Classification: null,
      LeaveType: '',
      StartTime: new Date(),
      EndTime: new Date(),
      Description: null,
      DayTypeLeaves: [{
        date: startTime,
        day_type_leave: 'Whole Day'
      }],
    };

    // console.log("editorTemplate-isEmpty(props)",isEmpty(props))
    // if (isEmpty(props) === true) {
    //   console.log("editorTemplate-inside-1-props", props)
    //   return false;
    // } else 
    if ((selectedSchedule.from && selectedSchedule.data)) { //After changing date  isEmpty(props) === false && 
      console.log("editorTemplate-inside-2-props", props)
      data.DayTypeLeaves = selectedSchedule.details;
      data.StartTime = selectedSchedule.from;
      data.EndTime = selectedSchedule.to;
      data.Classification = selectedSchedule.data.Classification;
      data.LeaveType = selectedSchedule.data.LeaveType;
      data.Description = selectedSchedule.data.Description;
    } else if (isEmpty(props) === false && props.Id === undefined) { //New schedule
      console.log("editorTemplate-inside-3-props",props)
      startTime = props.StartTime;
      endTime = props.EndTime;

      startTime.setHours(startTime.getHours() + 8);
      endTime.setDate(endTime.getDate() - 1);
      endTime.setHours(endTime.getHours() + 17);

      props.StartTime = startTime;
      props.EndTime = endTime;

      // data.Classification = props.Classification,
      // data.LeaveType = props.LeaveType;
      // data.Description = props.Description;
      data.StartTime = props.StartTime;
      data.EndTime = props.EndTime;
      data.DayTypeLeaves = [{
        date: props.StartTime,
        day_type_leave: null
      }];

    } else if (isEmpty(props) === false) { //Edit schedule
      console.log("editorTemplate-inside-4-props",props)
      data.Classification = props.Classification,
      data.LeaveType = props.LeaveType;
      data.Description = props.Description;
      data.StartTime = props.StartTime;
      data.EndTime = props.EndTime;
      if (props.DayTypeLeaves.length) {
        data.DayTypeLeaves = props.DayTypeLeaves;
      } else {
        data.DayTypeLeaves = [{
          date: props.StartTime,
          day_type_leave: null
        }];
      }

    }

    console.log("editorTemplate-data",data)
    
    return (
      <table className="custom-event-editor" style={{ width: '100%' }}>
        <tbody>
          <tr>
            <td className="e-textlabel">Classification</td>
            <td colSpan={4}>
              <DropDownListComponent 
                  id="Classification" placeholder='Choose classification' data-name="Classification" className="e-field e-input" style={{ width: '100%' }} 
                  dataSource={['Planned', 'Unplanned']} 
                  value={data.Classification || null}
                  change={onSelectEvent}
                  >
              </DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">Leave Type</td>
            <td colSpan={4}>
              <DropDownListComponent 
                  id="LeaveType" placeholder='Choose Leave Type' data-name="LeaveType" className="e-field" style={{ width: '100%' }} 
                  dataSource={['Vacation', 'Sick']} 
                  value={data.LeaveType || null}
                  change={onSelectEvent}
                  
                  >
              </DropDownListComponent>
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">From</td>
            <td colSpan={4}>
              <DateTimePickerComponent format={dateFormat}  id="StartTime" data-name="StartTime" value={new Date(data.StartTime)} className="e-field" 
                  change={e => {console.log("DateTimePicker-change-e",e); (e.event !== null && e.event.type === "click") ? selectedTimeChange({type: 'from', from: data.StartTime, to: data.EndTime, data: data, propsData:props}, e) : false}}
                   
              />
            </td>
          </tr>
          <tr>
            <td className="e-textlabel">To</td>
            <td colSpan={4}>
              <DateTimePickerComponent format={dateFormat} id="EndTime" data-name="EndTime" value={new Date(data.EndTime)}  className="e-field" 
                  change={e => {console.log("DateTimePicker-change-e",e); (e.event !== null && e.event.type === "click") ? selectedTimeChange({type: 'to', from: data.StartTime, to: data.EndTime, data: data, propsData:props}, e) : false}}
              />
            </td>
          </tr>
          {data.DayTypeLeaves.map((detail, i) => {
            i++;
            return (<tr key={i}>
              <td className="e-textlabel">{(data.DayTypeLeaves.length===1 ? 'Choose' : formatDate(detail.date,'MMMM D'))} </td>
              <td colSpan={4}>
                <DropDownListComponent 
                    id={`DayTypeLeave${i}`}  placeholder='Select (AM,PM,WD)' data-name={`DayTypeLeave${i}`} className="e-field" style={{ width: '100%' }} 
                    dataSource={['AM', 'PM','Whole Day']} value={detail.day_type_leave || null}
                    // change={onSelectEvent}
                    >
                </DropDownListComponent>
              </td>
            </tr>)
          })}
          {/* <tr style={{display:'none'}}>
            <td className="e-textlabel">Choose Day</td>
            <td colSpan={4}>
              <DropDownListComponent 
                  id="DayTypeLeave" placeholder='Choose Day' data-name="DayTypeLeave" className="e-field" style={{ width: '100%' }} 
                  dataSource={['Whole Day', 'AM', 'PM']} value={data.DayTypeLeave || null}
                  // change={onSelectEvent}
                  >
              </DropDownListComponent>
            </td>
          </tr> */}
          <tr>
            <td className="e-textlabel">Reason</td>
            <td colSpan={4}>
              <textarea id="Description" value={data.Description} className="e-field e-input" name="Description"  rows={3} cols={50} style={{ width: '100%', height: '60px !important', resize: 'vertical' }}></textarea>
            </td>
          </tr>
        </tbody>
      </table>);
  }

  onPopupOpen(args) {
      console.log('onPopup-args', args)
      if (args.target !== undefined && args.target.className === "e-appointment") {
        this.isEdit = true;
        this.state.selectedSchedule = {
            from: args.data.StartTime,
            to: args.data.EndTime,
            details: [{
              date: args.data.StartTime,
              day_type_leave: null
            }],
          }

      } else {
        this.isEdit = false;
      }
      
      if (args.type === 'Editor') {
        this.addFormValidation('form')
      }

  }

  addFormValidation(field) {
    console.log('addFormValidation', field, this.state.selectedSchedule)
    const validator = new FormValidator('#EditForm');

    if (field === 'form') {
      validator.addRules('Classification', { required: true }); 
      validator.addRules('LeaveType', { required: true });
      validator.addRules('Description', { required: true });
      validator.addRules('DayTypeLeave1', { required: true });

    } else {
      validator.addRules('Classification', { required: true });
      validator.addRules('LeaveType', { required: true });
      validator.addRules('Description', { required: true });

      for (let i=1; i<=this.state.selectedSchedule.details.length;i++) {
        validator.addRules('DayTypeLeave'+i, { required: true });
      }
      
    }
    
    
  }

  onSelectEvent(args) {
    try {
      if (args.element.id === "Classification" && !isNullOrUndefined(document.getElementById("Classification"))) {
          document.getElementById("Classification-info").style.display = "none";
      } else if (args.element.id === "LeaveType" && !isNullOrUndefined(document.getElementById("LeaveType"))) {
          document.getElementById("LeaveType-info").style.display = "none";
      }
      // else if (args.element.id === "DayTypeLeave" && !isNullOrUndefined(document.getElementById("DayTypeLeave"))) {
      //     document.getElementById("DayTypeLeave-info").style.display = "none";
      // }

    } catch (e) {
      // console.log("error: ", e)
    }
  }

  onCloseDialog(e) {
    console.log("onCloseDialog-e",e)
    // console.log("onCloseDialog-this.schedules",this.schedules)
    if (e.type == "DeleteAlert"){ // || e.name === "popupClose"
      this.clearSelected();
    } else if (e.cancel === false && e.data === null) {
      console.log("close-programmatically",e)
      // this.scheduleObj.openEditor(this.scheduleObj.activeCellsData,'Add');
      this.clearSelected();
    } else if (e.cancel === false && e.data !== undefined) { //saving dialog
      let schedules = null;
      if (this.isEdit === false) {
        schedules = this.state.schedules;
      } else {
        schedules = this.state.schedules.slice(0,-1);
      }
      console.log("onCloseDialog-e.data",e.data)
      console.log("onCloseDialog-schedules",schedules)
      let dates = schedules.filter(sched => {
        let startTime = new Date(sched.StartTime);
        let endTime = new Date(sched.EndTime);

        if (
          (e.data.StartTime > e.data.EndTime) ||
          (e.data.StartTime <= endTime && e.data.EndTime >= startTime)
        )
         return (startTime, endTime)
      });
      console.log("validating-date",dates)
      console.log("validating dates-state",this.state);
      // dates = [];

      if (dates.length) {
        // this.state.schedules.pop();
        // console.log("removed last - this.schedules",this.schedules)
        e.cancel = true;
        alert("Date input is invalid")
      } else {
        e.data.Subject = e.data.LeaveType + " Leave";
      }

    }

    

  }

  clearSelected() {
    this.setState({selectedSchedule: {
      from: null,
      to: null,
      details: [],
    }})
    this.isEdit = false;
  }

  selectedTimeChange = (data, args) => {
    console.log("selectedTimeChange-data", data)
    console.log("selectedTimeChange-args", args)
  
    let selectedFrom = null;
    let selectedTo = null;
    let noOfDays = 0;
    let scheduleDetails = [];

    try {
      if (data.type === "from") {
        selectedFrom = args.value;
        selectedTo = data.to;
      } else {
        selectedFrom = data.from;
        selectedTo = args.value;
      }

      // noOfDays = (selectedTo.getDay() - selectedFrom.getDay()) + 1;
      selectedFrom = moment(selectedFrom);
      selectedTo = moment(selectedTo);
      noOfDays = selectedTo.diff(selectedFrom, "days") + 1;
      // console.log("selectedTimeChange-this.selectedFrom-selectedTo: ",selectedFrom, selectedTo)
      console.log("noOfDays",noOfDays)
      for (let i=0; i<noOfDays; i++) {
        let fromDate = moment(selectedFrom);
        // console.log("selectedTimeChange-fromDate",fromDate)
        scheduleDetails.push({
          date: formatDate(new Date(fromDate.add(i,'days'))),
          day_type_leave: null,
        })
      }
      // console.log("selectedTimeChange-scheduleDetails",scheduleDetails)
      // console.log("selectedTimeChange-state",this.state)
      this.hasRendered = false;
      this.setState({
          selectedSchedule: {
            Id: data.Id,
            from: selectedFrom,
            to: selectedTo,
            details: scheduleDetails,
            data: data.data,
            propsData: data.propsData,
            },
      });

    } catch (e) {
      console.log("error",e)
    }

  }

  onEventRendered(e) {
    // console.log("onEventRendered-this.state",this.state)
    console.log("onEventRendered-this.hasRendered",this.hasRendered)
    if (this.state.selectedSchedule.details.length && this.hasRendered === false) {
      if (this.isEdit) {
        console.log("onEventRendered-this.state.selectedSchedule",this.state.selectedSchedule)
        this.scheduleObj.openEditor(this.state.selectedSchedule.propsData,'Save'); //e.data  this.state.selectedSchedule.data 
        
      } else {
        console.log("onEventRendered-Add",this.state.selectedSchedule)
        this.scheduleObj.openEditor(this.scheduleObj.activeCellsData,'Add');
      }

      this.addFormValidation('schedule details')
      console.log("onEventRendered-done")
      this.hasRendered = true;
    } else {
      // console.log("onEventRendered-dont-openEditor")
    }
  }

  updateRecord(data, requestType, saveSchedule) { //return;
    console.log("updateRecord",data, saveSchedule)
    // console.log("updateRecord-this.isEdit",this.isEdit)
    console.log("updateRecord-this.state1",this.state)
    if ( (requestType === "toolBarItemRendered" || requestType === "viewNavigate") ) {
      
    } else if (!isEmpty(requestType) && !isEmpty(data) ) {
      console.log("updateRecord-data",data)
      // console.log("updateRecord-requestType",requestType)
      if (requestType === "eventChanged" || this.isEdit === true) {
        requestType = "eventChanged";
        let objIndex = this.state.schedules.findIndex((obj => obj.Id == data.Id));

        if (this.state.selectedSchedule.details.length > 0) {
          for (let i=0; i<this.state.selectedSchedule.details.length; i++) {
            this.state.selectedSchedule.details[i].day_type_leave = data['DayTypeLeave'+(i+1)];
          }
          this.state.schedules[objIndex].DayTypeLeaves = this.state.selectedSchedule.details;
          data.DayTypeLeaves = this.state.selectedSchedule.details;

        } else {
          for (let i=0; i<this.state.schedules[objIndex].DayTypeLeaves.length; i++) {
            this.state.schedules[objIndex].DayTypeLeaves[i].day_type_leave = data['DayTypeLeave'+(i+1)];
          }
          data.DayTypeLeaves = this.state.schedules[objIndex].DayTypeLeaves;
        }

      } else if (requestType === "eventCreated" && this.isEdit === false) { // New schedule and set the details to state.schedules
        let objIndex = this.state.schedules.findIndex((obj => obj.Id == data.Id));

        for (let i=0; i<this.state.selectedSchedule.details.length; i++) {
          this.state.selectedSchedule.details[i].day_type_leave = data['DayTypeLeave'+(i+1)];
        }
        this.state.schedules[objIndex].DayTypeLeaves = this.state.selectedSchedule.details;
      }
      console.log("updateRecord-this.state2",this.state)
      saveSchedule(data, requestType);
      this.setState({selectedSchedule: {
        from: null,
        to: null,
        details: [],
      }})
      this.isEdit = false;

    }


  }

  render () {
    console.log("Scheduler-props",this.props)
    console.log("Scheduler state",this.state)

    return (
      <div>
        <Head>
          <link href="/static/scheduler.css" rel="stylesheet" />
        </Head>

        <ScheduleComponent
          ref={t => this.scheduleObj = t}
          height='700px'
          showQuickInfo={false}
          actionComplete={(e) => {console.log("actionComplete-e",e); e.data !== undefined ?
                this.updateRecord(e.requestType === "eventChanged" ? e.data : e.data[0], e.requestType, this.props.saveSchedule) : ''}}
          eventSettings={{ dataSource: this.state.schedules }}
          editorTemplate={this.editorTemplate.bind(this, this.onSelectEvent, this.selectedTimeChange, this.state.selectedSchedule)}
          popupClose={this.onCloseDialog.bind(this)}
          popupOpen={this.onPopupOpen.bind(this)}
          eventRendered={this.onEventRendered.bind(this)}

        >
          {/* <ViewsDirective>
            <ViewDirective option='Month'/>
          </ViewsDirective>
          <Inject services={[Month]}/> */}
          <ViewsDirective>
            <ViewDirective option='Day'  />
            <ViewDirective option='Week' />
            <ViewDirective option='Month' />
          </ViewsDirective>
          <Inject services={[Day, Week, Month]}/>
        </ScheduleComponent>
        <br/>
      </div>
       
    )
  }
  
}




export default Scheduler;