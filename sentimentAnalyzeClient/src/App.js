import './bootstrap.min.css';
import './App.css';
import EmotionTable from './EmotionTable.js';
import React from 'react';


const TITLE = 'Sentiment Analyzer'


class App extends React.Component {
  state = {innercomp:<textarea rows="4" cols="50" id="textinput"/>,
            mode: "text",
          sentimentOutput:[],
          sentiment:true
        }

  
  renderTextArea = ()=>{
    console.log("MENSAJE")
    document.getElementById("textinput").value = "";
    if(this.state.mode === "url") {
      this.setState({innercomp:<textarea rows="4" cols="50" id="textinput"/>,
      mode: "text",
      sentimentOutput:[],
      sentiment:true
    })
    } 
  }

  renderTextBox = ()=>{
    document.getElementById("textinput").value = "";
    if(this.state.mode === "text") {
      this.setState({innercomp:<textarea rows="1" cols="50" id="textinput"/>,
      mode: "url",
      sentimentOutput:[],
      sentiment:true
    })
    }
  }

  sendForSentimentAnalysis = () => {
      console.log("MENSAJE3")
    this.setState({sentiment:true});
    let url = ".";

    if(this.state.mode === "url") {
      url = url+"/url/sentiment?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/sentiment?text="+document.getElementById("textinput").value;
    }
    fetch(url).then((response)=>{
        response.text().then((data)=>{
        this.setState({sentimentOutput:data});
        let output = data;
        let dataJASON = JSON.parse(data)
        let label = dataJASON.label;
        console.log('data: ')
        console.log(dataJASON)
        console.log('data.label: ')
        console.log(dataJASON.label)

        if(label === "positive") {
          output = <div style={{color:"green",fontSize:20}}>{"score: " + dataJASON.score + ", label: " + dataJASON.label}</div>
        } else if (label === "negative"){
          output = <div style={{color:"red",fontSize:20}}>{"score: " + dataJASON.score + ", label: " + dataJASON.label}</div>
        } else {
          output = <div style={{color:"yellow",fontSize:20}}>{"score: " + dataJASON.score + ", label: " + dataJASON.label}</div>
        }
        this.setState({sentimentOutput:output});
      })});
  }



  sendForEmotionAnalysis = () => {
    console.log("MENSAJE2")
    this.setState({sentiment:false});
    let url = ".";
    if(this.state.mode === "url") {
      url = url+"/url/emotion?url="+document.getElementById("textinput").value;
    } else {
      url = url+"/text/emotion/?text="+document.getElementById("textinput").value;
    }
    fetch(url).then((response)=>{
      response.json().then((data)=>{
      this.setState({sentimentOutput:<EmotionTable emotions={data}/>});
  })})  ;
  }
  

  render() {
    return (  
        <div>
        <title>{ TITLE }</title>
        <div className="App">
            <button className="btn btn-info" onClick={this.renderTextArea}>Text</button>
            <button className="btn btn-dark"  onClick={this.renderTextBox}>URL</button>
            <br/><br/>
            {this.state.innercomp}
            <br/>
            <button className="btn-primary" onClick={this.sendForSentimentAnalysis}>Analyze Sentiment</button>
            <button className="btn-primary" onClick={this.sendForEmotionAnalysis}>Analyze Emotion</button>
            <br/>
                {this.state.sentimentOutput}
        </div>
        </div>
    );
    }


}



export default App;