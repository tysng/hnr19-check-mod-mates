import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import { all } from 'q';

// const key = get_token()[0]; // key is constant
//***REMOVED*** = get_token()[1];

/* this code doesn't really work 


function getModules() {
    // returns an array of modules 
}

*/
// function getObject(url) {
//     request(url, function (error, response, body) {
//         console.log('error:', error); // Print the error if one occurred
//         console.log('statusCode:', response && response.statusCode); // Print the response status code if a response was received
//         console.log('body:', body); // Print the HTML for the Google homepage.
//     });
// }



const key = "EKCnWpNMgPfzGr9psFhqq"; // key is constant
const token = "5ADC923208A41CDD38E28F8D97383F3B261C7CCDCB69BE826B9F51361BF9404FC9E5E524CA57B3D573D084E642AF16BE5311FE0229D135E00F26244B4FC3C8BE23D365DA846ABD06F24CE7405BE9A1D4B3EEF513DD0EF0782AB019995E1230B3DAC6D087A12F11464AC8BA5ADF98E3478CA2CB9E77969FB83609BFBC9FEE2826A6855D3CFE4FEF5F39A4AA8764FEAD03639EFDD76A2179F0FB118F8A40D16BE734D73C8F4EF99C5E2A4C1371918C1D064EE587C68AEDBD5F5982B44ABEB9980BF29FA6764A9802F4C6A8B9170320B97C209F233A9DC9F2C09DD469B4CD0B004F8044213AB39D35A52CD1D69E3923F948";

const module_call = "https://ivle.nus.edu.sg/api/Lapi.svc/Modules?APIKey=" +
    key + "&AuthToken=" +
    token + "&Duration=10&IncludeAllInfo=false";


// getObject(module_call);



// Assume we already have a list of modules
const module_list = [
    'MA1521',
    'CS1101S',
    'CS1231',
];

// Assume we also have the namelist which has the same order as module_list
const name_lists = [
    [
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
    ],
    [
        "1",
        "2",
        "5",
        "6",
        "7",
    ],
    [
        "1",
        "3",
        "4",
        "6",
    ],
]

function Toggle(props) {
    return (
        <button onClick={props.onClick}>
            {props.content} {props.isToggleOn ? 'ON' : 'OFF'}
        </button>

    );
}

class Content extends Component {


    findIntersection() {
        // refer to the global name_list var, and compare with buttonState
        // return the intersection in an array
        const selectedLists = []
        for (let i = 0; i < this.props.buttonState.length; i++) {
            if (this.props.buttonState[i]) {
                selectedLists.push(name_lists[i]);
            }
        }

        try {
            return selectedLists.reduce(
                (accum, current) => accum.filter(x => current.includes(x))
            )
        }

        catch (TypeError) {
            return "Type Error";
        }

    }

    render() {

        const module_buttons = this.props.courseCode.map(
            (value, index) => {
                return (
                    // <button key={index}>{value}</button>
                    <Toggle

                        onClick={() => this.props.onClick(index)}
                        isToggleOn={this.props.buttonState[index]}
                        content={this.props.courseCode[index]}
                    />
                )
            }
        );

        return (
            <div>
                <div className="buttons">
                    {module_buttons}
                </div>
                <div>
                    {/* list of namesd here */}
                    {this.findIntersection()}
                </div>
                <div>
                    <a href={module_call}>Press here for magic</a>
                    {/* {this.state.moduleResponse.Results.length} */}
                </div>
            </div>
        )

    };

}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isInitiated: false,
            buttonState: null,
            moduleID: null,
            courseCode: null,
            moduleResponse: null,
        }
    }

    initialize(url) {
        console.log(url);
        return fetch(url)
            .then(resp => resp.json())
            .then(data => {
                console.log(data);
                console.log(data.Results.length);
                this.setState(
                    {
                        isInitiated: true,
                        buttonState: Array(data.Results.length).fill(false),
                        courseCode: data.Results.map(obj => obj.CourseCode)
                        // moduleID: ,

                    });
            }
            );
    }

    handlesClick(i) {
        const buttonState_copy = this.state.buttonState.slice();

        // update buttonState
        buttonState_copy[i] = !buttonState_copy[i];

        this.setState(
            { buttonState: buttonState_copy });
    }

    render() {
        return (
            <div>
                <div className="main">
                    <button onClick={() => this.initialize(module_call)}>Refresh</button>
                </div>


                <div>
                    {(this.state.isInitiated)
                        ? <Content
                            buttonState={this.state.buttonState}
                            courseCode={this.state.courseCode}
                            onClick={i => this.handlesClick(i)}
                        />
                        : null}
                </div>
            </div>
        );
    }

}



export default App;
