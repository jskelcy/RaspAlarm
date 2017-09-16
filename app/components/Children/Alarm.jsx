import React from 'react';
import moment from 'moment';
import { Link } from 'react-router';
import ReactModal from 'react-modal';

const alarmSound = new Audio('./sounds/alarm.mp3');
let alarmInterval;
const modalStyle = {
  overlay: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
  },
  content: {
    backgroundColor: 'black',
    height: '50%',
  },
};

export default class Alarm extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alarmStatus: 'not ringing',
      awake: false,
      alarms: [],
      showModal: false,
      images: [],
    };
    this.getAlarms = this.getAlarms.bind(this);
    this.checkAlarm = this.checkAlarm.bind(this);
    this.awake = this.awake.bind(this);
    this.launchModal = this.launchModal.bind(this);
  }
  componentDidMount() {
    this.getAlarms();
    alarmInterval = setInterval(this.checkAlarm, 1000);
  }
  componentWillUnmount() {
    clearInterval(alarmInterval);
  }
  getAlarms() {
    $.ajax({
      url: '/alarms',
    }).done((alarms) => {
      this.setState({ alarms });
      this.checkAlarm();
    });
  }
  // Function to check whether its time for an alarm to go off or not.
  checkAlarm() {
    const dayOfWeek = moment().format('dddd');
    for (let i = 0; i < this.state.alarms.length; i += 1) {
      for (let j = 0; j < this.state.alarms[i].dayOfWeek.length; j += 1) {
  // If the alarm is not ringing, ring the alarm and set the state. This should only happen once.
        if (this.props.currentTime === this.state.alarms[i].time
          && this.state.alarms[i].dayOfWeek[j] === dayOfWeek
          && this.state.alarmStatus !== 'ringing'
          && this.state.awake === false) {
          alarmSound.play();
          this.setState({
            alarmStatus: 'ringing',
          });
        } else if (this.state.alarmStatus === 'ringing') {
          alarmSound.play();
        }
      }
    }
  }
  launchModal() {
    $.ajax({
      url: '/images',
    }).done((images) => {
      this.setState({
        showModal: true,
        images,
      });
      console.log(this.state.images);
    });
  }
  closeModal() {
    this.setState({
      showModal: false,
    });
  }
  awake() {
    this.setState({
      alarmStatus: 'not ringing',
      awake: true,
    });
  // After 60 seconds, this will revert awake to false.
  // We wait 60 to prevent the alarm from continously going off.
    setTimeout(() => this.setState({ awake: false }), 60000);
  }
  render() {
    if (this.state.alarmStatus === 'ringing') {
      return (
        <div className="col-xs-12" id="alarm">
          <button className="btn-xl btn-success" id="wakeUp" onClick={() => { this.awake(); }}>Wake Up</button>
        </div>
      );
    }

    return (
      <div className="col-xs-12" id="alarm">
        <h3><Link to="/AlarmManager">Set an alarm</Link></h3>
        <h3 id="settings" onClick={() => this.launchModal()}>Settings</h3>
        <ReactModal isOpen={this.state.showModal} contentLabel="Settings" shouldCloseOnOverlayClick style={modalStyle}>
          <h4 id="settingsBanner">Settings</h4>
          <h5> Change Sound: </h5>
          <h5> Change Background: </h5>
          <button onClick={() => this.closeModal()}>Close</button>
        </ReactModal>
      </div>
    );
  }
}
