import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import Head from '../../components/head'
import Nav from '../../components/nav-dark'
import Footer from '../../components/footer'
import ReactLoading from 'react-loading';
import Router from 'next/router'
import Cookies from 'js-cookie'

const title = "SureHired"
const subtitle = ""
const description = ""

class App extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.onDrop = this.onDrop.bind(this);

        console.log(Cookies.get('name'));

        this.state = {
            loading: false,
            name: Cookies.get('name'),
            userId: Cookies.get('userId'),
            title: 'Untitled'
        }
    }

    componentDidMount() {
        if (this.state.name == null || this.state.userId == null) {
            Router.push('/login');
        }
    }

    componentDidCatch(error, errorInfo) {
        console.log(errorInfo);
        Router.push('/login');
    }

    async onDrop(acceptedFiles) {
        this.setState({
            loading: true
        })

        console.log(acceptedFiles);

        const url = 'api/v1/resources';
        const formData = new FormData();
        formData.append('file', acceptedFiles[0]);
        formData.append('type', 'resume');
        formData.append('userId', this.state.userId);

        fetch('/api/v1/resources', {
            method: 'POST',
            body: formData
        }).then(results => {
            this.setState({
                loading: false
            });
            return results.json();
        }).then(json => {
            console.log(json);
            // store location in db
            fetch('/api/v1/jobs/', {
                method: 'POST',
                headers: {
                    'Accept': 'application/json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    resume: json.Location,
                    userId: this.state.userId,
                    title: this.state.title
                })
            }).then(res => {
                console.log(res);

                res.json().then(json => {
                    Cookies.set("jobId", json.jobId);

                    // navigate to next step
                    Router.push('/app/stepTwo');
                })
            });
        });
    }

    onChange(event) {
        this.setState({
            title: event.target.value
        })
    }

    render() {
        const isLoading = this.state.loading;
        return (
            <div>
                <Head title="Home" />
                <Nav isLoggedIn={true} />
                <div className="app-hero step-one filter-light">
                    <div className="container">
                        <div className="row step-1">
                            <div className="col-md-12">
                                <h1>Welcome {this.state.name}!</h1>
                                <h2>Step 1 | Resume</h2>
                                <p>You're taking the first step in boosting your chances of getting hired.</p>
                                <p>Simply enter a title for your analsis (e.g. the company you're planning to apply for). Next, drag and drop your resume
                                    onto the box or click on it to upload your resume in <b>readble PDF</b> format.</p>
                            </div>
                        </div>

                        <div className="row">
                            <div className="col-md-6">
                                <label>Enter a title for this analysis.</label>
                                <input type="text" className="form-control" id="title" placeholder="Google Application" onChange={this.onChange.bind(this)} />
                            </div>
                        </div>

                        <br />

                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <Dropzone onDrop={this.onDrop}>
                                    {({ getRootProps, getInputProps }) => (
                                        <div {...getRootProps()}>
                                            <input {...getInputProps()} />
                                            <div className="dropzone text-center">
                                                <p>Click me to upload a file!</p>
                                                <div className="row">
                                                    <div className="col-md-12 text-center">
                                                        <span className="loading-bar">{isLoading ? <ReactLoading className="text-center loading-bar" type={"bars"} height={"3em"} width={"3em"} /> : <span />}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                </Dropzone>
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }
}

export default App;