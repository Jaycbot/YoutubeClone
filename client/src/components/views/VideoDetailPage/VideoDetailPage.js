import React, { useState, useEffect } from 'react';
import { Row, Col, List, Avatar } from 'antd';
import Axios from 'axios';
import SideVideo from './Sections/SideVideo';
import Subscribe from './Sections/Subscribe'
function VideoDetailPage(props) {
	const videoId = props.match.params.videoId; //routing 할 때, :videoId로 주었기 때문에 params를 이용해서 가져올 수 있음.
	const variable = {
		videoId: videoId,
	};
	const [VideoDetail, setVideoDetail] = useState([]);
	useEffect(() => {
		Axios.post('/api/video/getVideoDetail', variable).then((response) => {
			if (response.data.success) {
				setVideoDetail(response.data.videoDetail);
			} else {
				alert('비디오 정보를 가져오는데 실패했습니다.');
			}
		});
	}, []);

	if (VideoDetail.writer) {
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

						<List.Item actions={<Subscribe userTo={VideoDetail.writer._id} />}>
							<List.Item.Meta
								avatar={<Avatar src={VideoDetail.writer.image} />}
								title={VideoDetail.writer.name}
								description={VideoDetail.description}
							/>
							<div></div>
						</List.Item>
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
