import React, { Component } from "react";
import "./App.css";
import _ from "lodash";

import { ThemeProvider } from "styled-components";
import { lightTheme, darkTheme } from "./services/theme";
import { GlobalStyle } from "./services/global";

import Navbar from "./component/navbar";
import Player from "./component/player";
import Instructions from "./component/instructions/index";
import Command from "./component/command";

import youtube, { baseTerms} from "./services/youtube";

require("dotenv").config();

class App extends Component {
  state = {
    inputTerm: "",
    commands: [],
    videos: [],
    selectedVideo: null,
    instruction: "",
    vdoEvent: null,
    vdoPauseTime: 0,
    theme: "dark",
  };

  handleVideoEvent = (c) => {
    this.setState({
      vdoEvent: c,
    });
  };

  handleInputChange = (event) => {
    this.setState({
      inputTerm: event.target.value,
    });
  };

  handleCommandSubmit = async (event) => {
    event.preventDefault();

    let commands = [...this.state.commands];
    let selectedVideo = [...this.state.selectedVideo];
    let videos = [...this.state.videos];
    const vdoEvent = this.state.vdoEvent;
    let instruction = "";
    let searchTerm = "";

    const inputTerm = this.state.inputTerm.toLowerCase();

    if(!isNaN(inputTerm) && !_.isEmpty(videos)) {
      if (!_.isEmpty(selectedVideo)){
        this.stopVideo();
      }
      let index = parseInt(inputTerm);
      if (index > videos.length) index = videos.length;
      selectedVideo = {...videos[index - 1]};
      videos = [];
      if (!_.isEmpty(vdoEvent)){
        vdoEvent.target.loadVideoById(selectedVideo.id.videoId);
      }
      commands.push(`Playing ${selectedVideo.snippet.title}`);
      instruction = "";
      searchTerm = "";
    } else {
      instruction = inputTerm.match(/!\w+/g);
      if (instruction)
        instruction = instruction.length > 0 ? instruction[0]: "";
      
      searchTerm = instruction
        ? inputTerm.toLowerCase().split(instruction)[1].trim()
        : "";
    }

    if (instruction === "!volume") {
      this.setVolume(parseInt(searchTerm));
      commands.push(`Volume set to: ${searchTerm}%`);
    } else if (instruction === "!play" || instruction === "!search") {
      if (searchTerm !== "") videos = await this.searchVideo(searchTerm);
    }

    switch(instruction){
      case "!play":
        if(searchTerm === ""){
          const videoResumed = this.resumeVideo();
          const msg = videoResumed
            ? `Resuming ${selectedVideo.snippet.title}`
            : "No music on the list.";
            commands.push(msg);
        } else {
          if (!_.isEmpty(selectedVideo)) {
            this.stopVideo();
          }
          selectedVideo = { ...videos[0] };
          videos = [];
          if (!_.isEmpty(vdoEvent)) {
            vdoEvent.target.loadVideoById(selectedVideo.id.videoId);
          }
          commands.push(`Playing ${selectedVideo.snippet.title}`);
        }
        break;
      case "!pause":
        this.pauseVideo();
        break;
      case "!resume":
        const videoResumed = this.resumeVideo();
        const resumeMsg = videoResumed
          ? `Resuming ${selectedVideo.snippet.title}`
          : "No music on the list.";
        commands.push(resumeMsg);
        break;
      case "!stop":
        const stoppedVideo = this.stopVideo();
        if (stoppedVideo) {
          commands.push(`Stopped playing ${selectedVideo.snippet.title}`);
          selectedVideo = null;
        } else {
          commands.push("No music to stop.");
        }
        break;
      default:
        break;
    }

    commands = commands.reverse();

    this.setState({
      inputTerm: "",
      commands,
      videos,
      selectedVideo,
    });
  };

  searchVideo = async (searchTerm) => {
    console.log("Process key: ", process.env);
    const response = await youtube.get("/search", {
      params: {
        ...baseTerms,
        q: searchTerm,
      },
    });
    return response.data.items;
  };

  setVolume = (volume) => {
    const { vdoEvent } = this.state;
    if (!_.isEmpty(vdoEvent)) {
      vdoEvent.target.setVolume(volume);
      this.setState({
        vdoPauseTime: vdoEvent.target.getDuration(),
      });
    }
  };

  pauseVideo = () => {
    const { vdoEvent } = this.state;
    if (!_.isEmpty(vdoEvent)) {
      vdoEvent.target.pauseVideo();
      this.setState({
        vdoPauseTime: vdoEvent.target.getDuration(),
      });
    }
  };

  resumeVideo = () => {
    const { vdoEvent } = this.state;
    if(!_.isEmpty(vdoEvent)){
      vdoEvent.target.stopVideo();
      this.setState({
        vdoEvent:null,
      });
      return 1;
    }
    return 0;
  };

  toggleTheme = () => {
    if(this.state.theme === "light"){
      this.setState({theme : "dark"});
    }else {
      this.setState({ theme: "light" });
    }
  };

  render(){
    const { inputTerm, videos, selectedVideo, commands, theme } = this.state;

    return(
      <ThemeProvider theme={theme === "light" ? lightTheme: darkTheme}>
        <>
        <GlobalStyle />
        <main className="container-fluid d-flex h-100 flex-column">
          <Navbar />
          <div className="row main-container flex-fill">
            <div className="col-3 main-instructions-column">
              <Instructions theme={theme} onToggleTheme={this.toggleTheme} />
            </div>
            <div className="col-6 main-player-column">
              <Player
                video={selectedVideo}
                onVideoEvent={(c) =>this.handleVideoEvent(c)}/>
            </div>
            <div className="col-3 main-command-column">
              <Command
                inputTerm={inputTerm}
                videos={videos}
                commands={commands}
                onInputChange={this.handleInputChange}
                onCommandSubit={this.handleCommandSubmit}/>
            </div>
          </div>
        </main>
        </>
      </ThemeProvider>
    );
  }
}

export default App;
