/* global Worker */

import { useState, useEffect, useRef, useCallback } from 'react';
import Button from '@enact/sandstone/Button';
import Item from '@enact/sandstone/Item';
import InputField from '@enact/sandstone/Input'
import Spinner from '@enact/sandstone/Spinner'
import {Panel, Header} from '@enact/sandstone/Panels';

const PrimeNumber = (props) => {
	const [started, setStarted] = useState(false);
	const [number, setNumber] = useState(0);
	const [limit, setLimit] = useState(100000000);
	const [timeElapsed, setTimeElapsed] = useState(0);

	let worker = useRef();

	useEffect(() => {
		worker.current = props.worker;

		worker.current.onmessage = ({ data: {nrOfPrimeNumbers, elapsed} }) => {
			setNumber(nrOfPrimeNumbers);
			setStarted(false);
			setTimeElapsed(elapsed);
		};

		return (() => {
			worker.current.terminate();
		});
	}, [props.worker]);

	const startWorker = useCallback(() => {
		setStarted(true);
		setNumber(0);
		setTimeElapsed(0);
		worker.current.postMessage({limit: limit});
	}, [limit]);

	const onChangeInputField = useCallback((event) => {
		setLimit(event.value);
	}, []);

	return (
		<>
			{started === false ?
				<>
					<Button onClick={startWorker}>{props.buttonName}</Button>
					<InputField
						onChange={onChangeInputField}
						value={limit}
						disabled
					/>
				</> :
				<Spinner />
			}
			<Item label={number}>Number of Prime Numbers</Item>
			<Item label={timeElapsed / 1000}>Time Elapsed in Sec</Item>
		</>
	);
};

const MainPanel = (props) => {
	return (
		<Panel {...props}>
			<Header title="get number of prime numbers under the limit" />
			<PrimeNumber
				buttonName="Start JavaScript"
				worker={new Worker(new URL("../primeNumberJSWorker", import.meta.url))} />
			<PrimeNumber
				buttonName="Start Webassembly"
				worker={new Worker(new URL("../primeNumberWasmWorker", import.meta.url))} />
		</Panel>
	);
};

export default MainPanel;
