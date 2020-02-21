import React, { useState } from 'react';
import './App.css';

function calcDay() {
	let date = new Date(Date.now());
	let day = date.getUTCDay();
	if (day <= 2) return false;
	if (day >= 6) return false;
	return true;
}

export default function App() {

	const [isOpen, setIsOpen] = useState(calcDay());

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
			<br />
			<div>
				The undie is open every Wednesday, Thursday, Friday, and Saturday, from 8PM to 11PM.
			</div>
		</div>
	);
}