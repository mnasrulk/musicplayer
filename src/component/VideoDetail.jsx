import React, { Component } from "react";

class VideoDetail extends Component{
    componentDidMount = () => {
        if (!window.YT) {
            const tag = document.createElement("script");
            tag.src = "https://www.youtube.com/iframe_api";

            window.onYoutubeIframeAPIReady = this.loadVideo;

            const firstScriptTag = document.getElementsByTagName("script")[0];
            firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);
        } else{
            this.loadVideo();
        }
    };

    loadVideo = () => {
        const { video } = this.props;
        const id = video.id.videoId;

        this.player = new window.YT.Player(`youtube-player`, {
            videoId: id,
            events: {
                onReady: this.onPlayerReady,
            },
        });
    };

    onPlayerStateChange = (event) =>{};

    onPlayerReady = (event) => {
        event.target.playVideo();
        this.props.onVideoEvent(event);
    };

    render(){
        const { video } = this.props;

        if(!video) {
            return <div>Loading ...</div>;
        }
        const videoSrc = `https://www.youtube.com/embed/${video.id.videoId}`;
        return(
            <div>
                <div style={{ display: "none" }}>
                <iframe src={videoSrc} allowFullScreen title="Video player"/>
                <div id={`youtube-player`}></div>
                </div>
            </div>
        );
    }
}

export default VideoDetail;