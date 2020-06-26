import React, { useState, useEffect } from 'react';
import { Tooltip, Icon } from 'antd';
import Axios from 'axios';

const LikeDislikes = (props) => {
	const [Likes, setLikes] = useState(0);
	const [Dislikes, setDislikes] = useState(0);
	const [LikeAction, setLikeAction] = useState(null);
	const [DislikeAction, setDislikeAction] = useState(null);
	let variable = {};

	if (props.video) {
		variable = {
			videoId: props.videoId,
			userId: props.userId,
			//video로부터  props를 받은게 아니라면 댓글에서 받은것
		};
	} else {
		variable = {
			commentId: props.commentId,
			userId: props.userId,
		};
	}

	useEffect(() => {
		Axios.post('/api/like/getLikes', variable).then((response) => {
			if (response.data.success) {
				//1 얼마나 많은 좋아요를 받았는지
				setLikes(response.data.likes.length);
				//2 내가 이미 그 좋아요를 눌렀는지
				response.data.likes.map((like) => {
					if (like.userId === props.userId) {
						setLikeAction('liked');
					}
				});
			} else {
				alert('Failed to get Likes');
			}
		});
		Axios.post('/api/like/getDislikes', variable).then((response) => {
			if (response.data.success) {
				//1 얼마나 많은 싫어요를 받았는지
				setDislikes(response.data.dislikes.length);
				//2 내가 이미 그 싫어요를 눌렀는지
				response.data.dislikes.map((dislike) => {
					if (dislike.userId === props.userId) {
						setLikeAction('disliked');
					}
				});
			} else {
				alert('Failed to get Dislikes');
			}
		});
	}, []);

	const onLike = () => {
		//아직 클릭이 안 된 경우
		if (LikeAction === null) {
			Axios.post('/api/like/upLike', variable).then((response) => {
				if (response.data.success) {
					setLikes(Likes + 1);
					setLikeAction('liked');

					//If dislike button is already clicked

					if (DislikeAction !== null) {
						setDislikeAction(null);
						setDislikes(Dislikes - 1);
					}
				} else {
					alert('Failed to increase the like');
				}
			});
		} else {
			Axios.post('/api/like/unLike', variable).then((response) => {
				if (response.data.success) {
					setLikes(Likes - 1);
					setLikeAction(null);
				} else {
					alert('Failed to decrease the like');
				}
			});
		}
	};
	const onDislike = () => {
		if (DislikeAction !== null) {
			Axios.post('/api/like/unDislike', variable).then((response) => {
				if (response.data.success) {
					setDislikes(Dislikes - 1);
					setDislikeAction(null);
				} else {
					alert('dislike을 지우지 못했습니다.');
				}
			});
		} else {
			Axios.post('/api/like/upDislike', variable).then((response) => {
				if (response.data.success) {
					setDislikes(Dislikes + 1);
					setDislikeAction('disliked');
					if (LikeAction !== null) {
						setLikeAction(null);
						setLikes(Likes - 1);
					}
				} else {
					alert('dislike을 올리지 못했습니다.');
				}
			});
		}
	};
	return (
		<React.Fragment>
			<span key="comment-basic-like">
				<Tooltip title="Like">
					<Icon
						type="like"
						theme={LikeAction === 'liked' ? 'filled' : 'outlined'}
						onClick={onLike}
					/>
				</Tooltip>
				<span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Likes}</span>
			</span>
			&nbsp;&nbsp;
			<span key="comment-basic-dislike">
				<Tooltip title="Dislike">
					<Icon
						type="dislike"
						theme={DislikeAction === 'disliked' ? 'filled' : 'outlined'}
						onClick={onDislike}
					/>
				</Tooltip>
				<span style={{ paddingLeft: '8px', cursor: 'auto' }}>{Dislikes}</span>
			</span>
		</React.Fragment>
	);
};

export default LikeDislikes;
