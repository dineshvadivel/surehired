import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import Head from '../../components/head'
import Nav from '../../components/nav-dark'
import Footer from '../../components/footer'
import ReactLoading from 'react-loading';
import Router from 'next/router'
import FacebookLogin from 'react-facebook-login';
import Cookies from 'js-cookie'

const responseFacebook = (response) => {
    console.log(response);
}

class App extends Component {
    constructor(props) {
        super(props);

        this.handleFacebookClick = this.handleFacebookClick.bind(this);
        this.handleStartAnalytics = this.handleStartAnalytics.bind(this);

        this.state = {
            loading: false,
            name: Cookies.get('name'),
            userId: Cookies.get('userId'),
            jobId: Cookies.get('jobId'),
            done: false
        }
    }

    componentDidMount() {
        if (this.state.name == null || this.state.userId == null || this.state.jobId == null) {
            Router.push('/login');
        }
    }

    async handleStartAnalytics(event) {
        event.preventDefault();
        console.log("Start analytics clicked");

        // send job id
        const response = await fetch('/api/v1/jobs/start-analytics', {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                jobId: this.state.jobId
            })
        });

        console.log(response);
        Router.push('/app/dashboard');
    }

    handleFacebookClick(response) {
        console.log(response);
        // save access token userid
        fetch('/api/v1/jobs/' + this.state.jobId, {
            method: 'PATCH',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                socialMedia: {
                    type: "FACEBOOK",
                    authorization: {
                        token: response.accessToken,
                        userId: response.userID,
                        imageUrl: response.picture.data.url
                    }
                }
            })
        }).then(res => {
            console.log(res);
            res.json().then(json => {
                this.setState({
                    done: true
                })
            });
        });
    }

    render() {
        const isLoading = this.state.loading;
        return (
            <div>
                <Head title="Home" />
                <Nav isLoggedIn={true} />
                <div className="app-hero step-four filter-light">
                    <div className="container">
                        <div className="row step-1">
                            <div className="col-md-12">
                                <h2>Step 4 | Facebook Analysis (Optional)</h2>
                                <p>We're almost there!</p>
                                <p>Let's check how awesome is your Facebook. Entirely optional step!</p>
                                <p>We will analyse if there are any social posts which could be deemed as "bad" by your employers.</p>
                            </div>
                        </div>

                        <div className="row justify-content-center">
                            <div className="col-md-12">
                                <FacebookLogin
                                    appId="340465570008336"
                                    autoLoad={true}
                                    fields="name,email,picture"
                                    callback={this.handleFacebookClick}
                                />
                            </div>
                        </div>
                        <br />
                        <hr />
                        <div className="row text-center">
                            <div className="col-md-12">
                                <button type="button" className="btn btn-primary btn-lg" onClick={this.handleStartAnalytics}>Start Analytics</button>
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