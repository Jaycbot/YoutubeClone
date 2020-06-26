import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { useSelector } from 'react-redux';
import SingleComment from './SingleComment';
import ReplyComment from './ReplyComment';
function Comment(props) {
	const user = useSelector((state) => state.user);
	const [commentValue, setcommentValue] = useState('');
	const handleClick = (event) => {
		setcommentValue(event.currentTarget.value);
	};
	const onSubmit = (event) => {
		event.preventDefault();
		const variables = {
			content: commentValue,
			writer: user.userData._id,
			postId: props.postId,
		};
		Axios.post('/api/comment/saveComment', variables).then((response) => {
			if (response.data.success) {
				setcommentValue('');
				props.refreshFunction(response.data.result);
			} else {
				alert('Failed to save the comment');
			}
		});
	};
	return (
		<div>
			<br />
			<p>Replies</p>
			<hr />

			{/* Comment Lists */}
			{props.commentLists &&
				props.commentLists.map(
					(comment, index) =>
						!comment.responseTo && (
							<React.Fragment>
								<SingleComment
									refreshFunction={props.refreshFunction}
									key={index}
									comment={comment}
									postId={props.postId}
								/>
								<ReplyComment
									refreshFunction={props.refreshFunction}
									parentCommentId={comment._Id}
									postId={props.postId}
									commentLists={props.commentLists}
								/>
							</React.Fragment>
						)
				)}
			{/* Root Comment Form */}
			<form style={{ display: 'flex' }} onSubmit={onSubmit}>
				<textarea
					style={{ width: '100%', borderRadius: '5px' }}
					onChange={handleClick}
					value={commentValue}
					placeholder="코멘트를 작성해 주세요"
				/>
				<br />
				<button style={{ width: '20%', height: '52px' }} onClick={onSubmit}>
					Submit
				</button>
			</form>
		</div>
	);
}

export default Comment;
