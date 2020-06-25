import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe';
import Comment from './Sections/Comment';
function VideoDetailPage(props) {
	const videoId = props.match.params.videoId; //routing 할 때, :videoId로 주었기 때문에 params를 이용해서 가져올 수 있음.
	const variable = {
		videoId: videoId,
	};
	const [VideoDetail, setVideoDetail] = useState([]);
	const [Comments, setComments] = useState([]);
	useEffect(() => {
		Axios.post('/api/video/getVideoDetail', variable).then((response) => {
			if (response.data.success) {
				setVideoDetail(response.data.videoDetail);
			} else {
				alert('비디오 정보를 가져오는데 실패했습니다.');
			}
		});
		Axios.post('/api/comment/getComments', variable).then((response) => {
			if (response.data.success) {
				setComments(response.data.comments);
			} else {
				alert('Fail to get comment information');
			}
		});
	}, []);
	const refreshFunction = (newComment) => {
		setComments(Comments.concat(newComment));
	};
	if (VideoDetail.writer) {
		const subscribeButton = VideoDetail.writer._id !==
			localStorage.getItem('userId') && (
			<Subscribe
				userTo={VideoDetail.writer._id}
				userFrom={localStorage.getItem('userId')}
			/>
		);
		return (
			<Row gutter={[16, 16]}>
				<Col lg={18} xs={24}>
					<div
						className="postPage"
						style={{ width: '100%', padding: '3rem 4em' }}
					>
						<video
							style={{ width: '100%' }}
							src={`http://localhost:5000/${VideoDetail.filePath}`}
							controls
						></video>

						<List.Item actions={[subscribeButton]}>
							<List.Item.Meta
								avatar={<Avatar src={VideoDetail.writer.image} />}
								title={VideoDetail.writer.name}
								description={VideoDetail.description}
							/>
							<div></div>
						</List.Item>
						<Comment
							refreshFunction={refreshFunction}
							commentLists={Comments}
							postId={videoId}
						/>
					</div>
				</Col>
				<Col lg={6} xs={24}>
					<SideVideo />
				</Col>
			</Row>
		);
	} else {
		return <div>...Loading</div>;
	}
}
export default VideoDetailPage;
