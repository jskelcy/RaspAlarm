import React from 'react'
import moment from 'moment'
import { Link } from 'react-router'
import ReactModal from 'react-modal'

const alarmSound = new Audio("./sounds/alarm.mp3")
let alarmInterval;
let alarmsArr = [];
const modalStyle = {
	overlay: {
		backgroundColor: 'rgba(0, 0, 0, 0.7)'
	},
	content: {
		backgroundColor: 'black',
		height: '50%'
	}
}

export default class Alarm extends React.Component{
	constructor(props){
		super(props);
		this.state = {
			alarmStatus: "not ringing",
			awake: false,
			alarms: [],
			showModal: false,
			images: []
		}
		this._getAlarms = this._getAlarms.bind(this);
		this._checkAlarm = this._checkAlarm.bind(this);
		this._awake = this._awake.bind(this);
		this._launchModal = this._launchModal.bind(this);
	}
	_getAlarms(){
		$.ajax({
			url: "/alarms"
		}).done((alarms)=>{
			this.setState({alarms: alarms});
			this._checkAlarm();
		});
	}
	//Function to check whether its time for an alarm to go off or not.
	_checkAlarm(){
		let dayOfWeek = moment().format("dddd");
			for(let i =0; i < this.state.alarms.length;i++){
				for(let j=0; j < this.state.alarms[i].dayOfWeek.length; j++){
					//If the alarm is not ringing, ring the alarm and set the state. This should only happen once. 
					if(this.props.currentTime == this.state.alarms[i].time && this.state.alarms[i].dayOfWeek[j] == dayOfWeek && this.state.alarmStatus != "ringing" && this.state.awake == false){
						alarmSound.play();
						this.setState({
							alarmStatus: "ringing"
						});
					}
					//If the alarmStatus is already ringing, we just want to play the alarmSound. So we do this. 
					else if(this.state.alarmStatus=="ringing"){
						alarmSound.play();
					}
				}
			}	
	} 
	_launchModal(){
		$.ajax({
			url: "/images"
		}).done((images)=>{
			this.setState({
				showModal: true,
				images: images
			});
			console.log(this.state.images);
		});
	}
	_closeModal(){
		this.setState({
			showModal: false
		})
	}
	componentDidMount(){
		this._getAlarms();
		alarmInterval = setInterval(this._checkAlarm, 1000);
	}
	componentWillUnmount(){
		clearInterval(alarmInterval);
	}
	_awake(){
		this.setState({
			alarmStatus: "not ringing",
			awake: true
		});
		//After 60 seconds, this will revert awake to false. We wait 60 to prevent the alarm from continously going off, even when the user is awake. 
		setTimeout(()=>this.setState({awake: false}), 60000);
	}
	render(){
		if(this.state.alarmStatus == "ringing"){
			return(
				<div className="col-xs-12" id="alarm">
					<button className="btn-xl btn-success" id="wakeUp" onClick={()=>{this._awake()}}>Wake Up</button>
				</div>
			)
		}
		else{
			return(
				<div className="col-xs-12" id="alarm">
					<h3><Link to="/AlarmManager">Set an alarm</Link></h3>
					<h3 id="settings" onClick={()=>this._launchModal()}>Settings</h3>
					<ReactModal isOpen={this.state.showModal} contentLabel="Settings" shouldCloseOnOverlayClick={true} style={modalStyle}>
						<h4 id="settingsBanner">Settings</h4>
						<h5> Change Sound: </h5>
						<h5> Change Background: </h5>
						<button onClick={() => this._closeModal()}>Close</button>
					</ReactModal>
				</div>
			)
		}
	}
}