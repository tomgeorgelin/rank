import './App.css';
import { useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import {
	doc,
	setDoc,
	collection,
	getDocs,
	increment,
} from 'firebase/firestore';

const firebaseConfig = {
	apiKey: process.env.REACT_APP_API_KEY,
	authDomain: process.env.REACT_APP_AUTH_DOMAIN,
	projectId: process.env.REACT_APP_PROJECT_ID,
	storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
	messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
	appId: process.env.REACT_APP_APP_ID,
};

const files = [
	'cat--1.png',
	'cat--2.png',
	'cat--3.png',
	'dog--1.png',
	'dog--2.png',
	'dog--3.png',
	'dog--4.png',
	'fruit--1.png',
	'fruit--2.png',
	'pasta--1.png',
	'pasta--2.png',
	'pingu--1.png',
	'pingu--2.png',
	'pingu--3.png',
	'pingu--4.png',
	'pingu--5.png',
	'popcorn--1.png',
	'skull--1.png',
	'skull--2.png',
	'skull--3.png',
	'skull--4.png',
	'skull--5.png',
	'turtle--1.png',
	'unicorn--1.png',
	'vegetables--1.png',
];

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

function App() {
	const [random1, setRandom1] = useState(
		Math.floor(Math.random() * files.length)
	);
	const [random2, setRandom2] = useState(
		Math.floor(Math.random() * files.length)
	);

	const fileUrl = require('./assets/images/' + files[random1]);

	const fileUrl2 = require('./assets/images/' + files[random2]);

	const [result, setResult] = useState({ name: '', value: '' });

	const handleResult = async () => {
		const querySnapshot = await getDocs(collection(db, 'rank'));
		const res = querySnapshot.docs
			.map((doc) => {
				if (doc.data().seen && doc.data().rank)
					return {
						name: doc.id,
						value: doc.data().rank / doc.data().seen,
					};
				return {
					name: '',
					value: -1,
				};
			})
			.reduce((a, b) => (a.value > b.value ? a : b));
		console.log(res);
		setResult(res);
	};

	const handleClick = () => {
		setRandom1(Math.floor(Math.random() * files.length));
		setRandom2(Math.floor(Math.random() * files.length));
		setResult({ name: '', value: '' });
	};

	const handleLeft = async () => {
		console.log(files[random1]);
		const leftDoc = doc(db, 'rank', files[random1]);
		const rightDoc = doc(db, 'rank', files[random2]);
		await setDoc(
			leftDoc,
			{
				rank: increment(1),
				seen: increment(1),
			},
			{ merge: true }
		);
		await setDoc(
			rightDoc,
			{
				seen: increment(1),
			},
			{ merge: true }
		);
		handleClick();
	};

	const handleRight = async () => {
		console.log(files[random2]);
		const leftDoc = doc(db, 'rank', files[random1]);
		const rightDoc = doc(db, 'rank', files[random2]);
		await setDoc(
			leftDoc,
			{
				seen: increment(1),
			},
			{ merge: true }
		);
		await setDoc(
			rightDoc,
			{
				rank: increment(1),
				seen: increment(1),
			},
			{ merge: true }
		);
		handleClick();
	};

	if (random1 === random2) handleClick();

	return (
		<div className='App' style={{}}>
			<button onClick={handleResult}>Voir qui gagne</button>
			<button onClick={handleClick}>Changer</button>
			<div
				style={{
					display: 'flex',
					justifyContent: 'space-around',
					alignItems: 'center',
				}}
			>
				<div
					onClick={handleLeft}
					style={{
						height: 300,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-around',
					}}
				>
					<div
						style={{
							height: 200,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<img src={fileUrl} alt='' width={150} />
					</div>
					<div>
						{(
							files[random1].charAt(0).toUpperCase() +
							files[random1].slice(1)
						).split('--')[0] + ' 👋🏻'}
					</div>
				</div>
				<div>VS</div>
				<div
					onClick={handleRight}
					style={{
						height: 300,
						display: 'flex',
						flexDirection: 'column',
						justifyContent: 'space-around',
					}}
				>
					<div
						style={{
							height: 200,
							display: 'flex',
							alignItems: 'center',
						}}
					>
						<img src={fileUrl2} alt='' width={150} />
					</div>
					<div>
						{(
							files[random2].charAt(0).toUpperCase() +
							files[random2].slice(1)
						).split('--')[0] + ' 👋🏻'}
					</div>
				</div>
			</div>
			<div>
				{result.name !== '' ? (
					<span>
						<img
							src={require('./assets/images/' + result.name)}
							alt=''
							width={150}
						/>
						<div>C'est moi qui gagne 👋🏻</div>
					</span>
				) : (
					''
				)}
			</div>
		</div>
	);
}

export default App;
