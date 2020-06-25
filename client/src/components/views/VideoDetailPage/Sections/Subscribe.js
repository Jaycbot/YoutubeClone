import React, { useState, useEffect } from 'react';
import Axios from 'axios';

const Subscribe = (props) => {
	const [SubscribeNumber, setSubscribeNumber] = useState(0);
	const [Subscribed, setSubscribed] = useState(false);
	useEffect(() => {
		let variable = { userTo: props.userTo };
		Axios.post('/api/subscribe/subscribeNumber', variable).then((response) => {
			if (response.data.success) {
				setSubscribeNumber(response.data.subscribeNumber);
			} else {
				alert('구독자 수 정보를 받아오지 못했습니다.');
			}
		});
		let subscribedVariable = {
			userTo: props.userTo,
			userFrom: localStorage.getItem('userId'),
		};
		Axios.post('/api/subscribe/subscribed', subscribedVariable).then(
			(response) => {
				if (response.data.success) {
					setSubscribed(response.data.result);
				} else {
					alert('Failed to load the information');
				}
			}
		);
	}, []);
	const onSubscribe = () => {
		//이미 구독중
		let subscribedVariable = {
			userTo: props.userTo,
			userFrom: props.userFrom,
		};

		if (Subscribed) {
			Axios.post('/api/subscribe/unSubscribe', subscribedVariable).then(
				(response) => {
					if (response.data.success) {
						//구독을 취소한 것이므로, 원래 가지고있던 구독자 수에서 -1 해줌.
						setSubscribeNumber(SubscribeNumber - 1);
						//현재 있는 상태와 반대되는 상태.
						setSubscribed(!Subscribed);
					} else {
						alert('구독 취소하는데 실패 했습니다.');
					}
				}
			);
			//아직 구독하지 않은 경우
		} else {
			Axios.post('/api/subscribe/subscribe', subscribedVariable).then(
				(response) => {
					if (response.data.success) {
						setSubscribeNumber(SubscribeNumber + 1);
						setSubscribed(!Subscribed);
					} else {
						alert('구독 하는데 실패 했습니다.');
					}
				}
			);
		}
	};
	return (
		<div>
			<button
				style={{
					backgroundColor: `${Subscribed ? '#AAAAAA' : '#CC0000'}`,
					borderRadius: '4px',
					color: 'white',
					padding: '10px 16px',
					fontWeight: '500',
					fontSize: '1rem',
					textTransform: 'uppercase',
				}}
				onClick={onSubscribe}
			>
				{SubscribeNumber} {Subscribed ? 'Subscribed' : 'Subscribe'}
			</button>
		</div>
	);
};

export default Subscribe;
