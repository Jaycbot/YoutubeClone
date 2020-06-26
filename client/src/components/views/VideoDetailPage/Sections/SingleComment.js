import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Comment, Avatar, Button, Input } from 'antd';
import Axios from 'axios';
import LikeDislikes from './LikeDislikes';
const { TextArea } = Input;
function SingleComment(props) {
	const user = useSelector((state) => state.user);
	const [OpenReply, setOpenReply] = useState(false);
	const [CommentValue, setCommentValue] = useState('');
	const onClickReplyOpen = () => {
		setOpenReply(!OpenReply);
	};
	const onHandleChange = (event) => {
		setCommentValue(event.currentTarget.value);
	};
	const onSubmit = (event) => {
		event.preventDefault();
		const variables = {
			content: CommentValue,
			writer: user.userData._id,
			postId: props.postId,
			responseTo: props.comment._id,
		};
		Axios.post('/api/comment/saveComment', variables).then((response) => {
			if (response.data.success) {
				setCommentValue('');
				setOpenReply(false);
				props.refreshFunction(response.data.result);
			} else {
				alert('Failed to save the comment');
			}
		});
	};
	const actions = [
		<LikeDislikes
			userId={localStorage.getItem('userId')}
			commentId={props.comment._id}
		/>,
		<span onClick={onClickReplyOpen} key="comment-basic-reply-to">
			Reply to
		</span>,
	];
	return (
		<div>
			<Comment
				actions={actions}
				author={props.comment.writer.name}
				avatar={<Avatar src={props.comment.writer.image} alt="image" />}
				content={<p>{props.comment.content}</p>}
			/>
			{OpenReply && (
				<form style={{ display: 'flex' }} onSubmit={onSubmit}>
					<TextArea
						style={{ width: '100%', borderRadius: '5px' }}
						onChange={onHandleChange}
						value={CommentValue}
						placeholder="write some comments"
					/>
					<br />
					<Button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
						Submit
					</Button>
				</form>
			)}
		</div>
	);
}

export default SingleComment;
