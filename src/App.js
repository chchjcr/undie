import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

function calcDay() {
	let date = new Date(Date.now());
	let day = date.getUTCDay();
	if (day <= 2) return false;
	if (day >= 6) return false;
	return true;
}

async function getCalendar() {
	try {
		let calendarId = '1di06f3pqhr8o0mrefiiouts80@group.calendar.google.com';
		let today = new Date(Date.now());
		let res = await axios({
			baseURL: 'https://clients6.google.com/calendar/v3/calendars/',
			url: calendarId + '/events',
			params: {
				calendarId,
				singleEvents: true,
				timeZone: 'Europe/London',
				maxAttendees: 1,
				maxResults: 250,
				sanitizeHtml: true,
				timeMin: new Date(new Date(today).setUTCDate(today.getUTCDate() - 1)).toISOString(), //'2019-10-27T00:00:00Z',
				timeMax: new Date(new Date(today).setUTCDate(today.getUTCDate() + 1)).toISOString(), //'2019-12-01T00:00:00Z',
				key: 'AIzaSyAWgkdBGseBg_AtOB2kfZXWiyp4RM6b45c' //AIzaSyBNlYH01_9Hc5S1J9vuFmu2nUqBZJNAXxs'
			}
		});
		let data = res.data;
		console.log(data.items);
		return (data.items || []).map((event) => {
			return {
				name: event.summary,
				day: event.start ? new Date(event.start.date || event.start.dateTime) : new Date(Date.now()),
				description: event.description || ''
			}
		}) || [];
	} catch (e) {
		console.error(e);
	}
}

export default function App() {

	const [isOpen, setIsOpen] = useState(calcDay());
	const [events, setEvents] = useState([]);

	useEffect(() => {
		getCalendar()
			.then((data) => {
				console.log(data);
				for (let event of data) {
					let status = event.name.trim().toUpperCase();
					if (status === 'CLOSED') setIsOpen(false);
					else if (status === 'OPEN') setIsOpen(true);
				}
				setEvents(data);
			});
	}, [])
	

	return (
		<div className='App'>
			<div>
				IS THE UNDIE OPEN TONIGHT?
			</div>
			<div>
				<img
					src = {process.env.PUBLIC_URL + '/crest-cardinals-hat.png'}
					className = "App-logo"
					alt = "logo"
				/>
			</div>
			<div
				className={['isOpen', isOpen ? 'open' : 'closed'].join(' ')}
			>
				{isOpen ? 'YES' : 'NO'}
			</div>
			{events.map((event) => {
				if (!event.description) return null;
				return <div className='description' dangerouslySetInnerHTML={{
					__html: event.description
				}} />
			})}
			<div>
				The undie is open every Wednesday, Thursday, Friday, and Saturday, from 8PM to 11PM.
			</div>
		</div>
	);
}