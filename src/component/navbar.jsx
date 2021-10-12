import React, { Component } from "react";

class Navbar extends Component{
    navbarStyle = {
        margin: "auto",
    };
    render(){
        return(
            <div className="navbar" style={this.navbarStyle}>
                <h3 style={{margin:"10px"}}>
                    <span role="img">📻</span>
                    WebPod
                </h3>
            </div>
        );
    }
}

export default Navbar;