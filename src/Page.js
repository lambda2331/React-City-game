import React, { Component } from 'react';
import './App.css';
import Word from './Word';
import SimpleMap from './Map';

class Page extends Component {
    constructor(props) {
        super(props);
        this.state = {isVisible: false, textButton:"Начать", userCoordinates:{lat:40.756795,lng:-73.954298}, robotCoordinates:{lat:40.756795,lng:-73.954298}};
        this.startPlay = this.startPlay.bind(this);
        this.createElement = this.createElement.bind(this);
        this.answerData = this.answerData.bind(this);
        this.addElement = this.addElement.bind(this);
        this.newGame = this.newGame.bind(this);
    }
    startPlay(){
        this.newGame();
        this.setState({ isVisible: !this.state.isVisible});
        this.state.isVisible ? this.setState({textButton:"Начать"}) :
            (this.setState({textButton:"Закончить"}), document.getElementById("cont").innerHTML='');

    }
    newGame(){
        return fetch('http://127.0.0.1:8080/newgame')
            .then((response) => {
                if(response.status === 200) console.log("NEW GAME!!!!");
                else console.log("ERROR");
            })
            .catch((error) => {
                console.error(error);
            });
    }
    answerData(nameCity){
        return fetch('http://127.0.0.1:8080/city', { method:'POST',headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }, body: 'name='+nameCity})
            .then((response) => {
                switch(response.status){
                    case 200: return Promise.resolve(response.json());
                    case 201: alert("Город "+nameCity+" не подходит!");
                        return Promise.reject(new Error(response.statusText));
                    case 202: alert("Город "+nameCity+" не существует!");
                        return Promise.reject(new Error(response.statusText));
                    case 203: alert("Город "+nameCity+" уже был!");
                        return Promise.reject(new Error(response.statusText));
                    case 204: alert("Вы ничего не ввели!");
                        return Promise.reject(new Error(response.statusText));
                }

            })
            .then((responseJson) => {
                this.setState({userCoordinates:{lat:parseFloat(responseJson.city1lat), lng:parseFloat(responseJson.city1lnt)},
                    robotCoordinates:{lat:parseFloat(responseJson.city2lat), lng:parseFloat(responseJson.city2lnt)}});
                this.addElement(responseJson.city1);
                this.addElement(responseJson.city2);
                return responseJson.city2;
            })
            .catch((error) => {
                console.error(error);
            });
    }

    addElement(text){
        let container = document.getElementById("cont");
        let word = document.createElement("p");
        word.className = "word";
        word.innerText = text;
        container.appendChild(word);
        document.getElementById('mainDiv').scrollTop = document.getElementById('mainDiv').scrollHeight;
    }

    createElement(){
        this.answerData(document.getElementById("input").value);
        document.getElementById("input").value = "";
    }


    render() {
        let isVisible = this.state.isVisible;
        let textButton = this.state.textButton;
        return (
            <div className="Page" id="main">
                <h1>Поиграй в "ГОРОДА"</h1>
                <tbody style={isVisible ? {display:"inline-block"} : {display:"none"}}>
                    <tr>
                    <th><SimpleMap lat={this.state.userCoordinates.lat} lng={this.state.userCoordinates.lng}/></th>
                    <th><div className="mainDiv" id="mainDiv" ><Word/></div></th>
                    <th><SimpleMap lat={this.state.robotCoordinates.lat} lng={this.state.robotCoordinates.lng}/></th>
                    </tr>
                </tbody>
                <br/>
                <input id="input" type="text" style={isVisible ? {display:"inline-block"} : {display:"none"}}/><br/>
                <a className="button" onClick={this.createElement} style={isVisible ? {display:"inline-block"} : {display:"none"}}>Отправить</a>
                <a className="button" onClick={this.startPlay}>{textButton}</a>
            </div>
        );
    }
}

export default Page;
