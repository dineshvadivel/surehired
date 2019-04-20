import React, { Component } from 'react';
import Dropzone from 'react-dropzone'
import Head from '../../components/head'
import Nav from '../../components/nav-dark'
import Footer from '../../components/footer'
import ReactLoading from 'react-loading';
import Router from 'next/router'
import Cookies from 'js-cookie'
import Charts from '../../components/charts'
import Jumbotron from '../../components/jumbotron'

const title = "Analytics Results"
const subtitle = "View the analysis here!"
const description = "Your documents have been processed!"

const emotionColorMap = {
    HAPPY: '#2b7c12',
    DISGUSTED: '#444135',
    SURPRISED: "#e6ef67",
    CALM: "#c4c4c2",
    ANGRY: "#9b0122",
    SAD: "#ad0d2d",
    CONFUSED: "#453e84"
}

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            name: Cookies.get('name'),
            userId: Cookies.get('userId'),
            jobId: this.props.jobId
        }
    }

    componentDidMount() {
        this.getJobDetails();
    }

    getJobDetails() {
        fetch('/api/v1/jobs?jobId=' + Cookies.get('jobId'), {
            method: 'GET'
        }).then((response => {
            return response.json();
        })).then(list => {
            // console.log(list);
            if (list.length > 0 && "scores" in list[0]) {
                if ("segmented" in list[0].scores) {
                    if ("resume" in list[0].scores.segmented) {
                        this.setState({
                            resume: list[0].scores.segmented.resume
                        });
                    }
                    if ("coverLetter" in list[0].scores.segmented) {
                        this.setState({
                            coverLetter: list[0].scores.segmented.coverLetter
                        })
                    }
                    if ("profilePicture" in list[0].scores.segmented) {
                        this.setState({
                            profilePicture: list[0].scores.segmented.profilePicture
                        })
                    }
                    if ("socialMedia" in list[0].scores.segmented) {
                        this.setState({
                            socialMedia: list[0].scores.segmented.socialMedia
                        })
                    }
                }
            }
        });
    }

    render() {
        const isLoading = this.state.loading;
        var resumeData = [];
        if (this.state.resume) {
            console.log(this.state.resume);
            resumeData = [
                {
                    value: this.state.resume.SentimentScore.Positive,
                    color: "#F7464A",
                    highlight: "#FF5A5E",
                    label: "Positive"
                },
                {
                    value: this.state.resume.SentimentScore.Negative,
                    color: "#22e214",
                    highlight: "#5AD3D1",
                    label: " Negative"
                },
                {
                    value: this.state.resume.SentimentScore.Neutral,
                    color: "#8e4e00",
                    highlight: "#FFC870",
                    label: "Neutral"
                },
                {
                    value: this.state.resume.SentimentScore.Mixed,
                    color: "#1c0de8",
                    highlight: "#FFC870",
                    label: "Mixed"
                }
            ];
        }

        var coverLetterData = [];
        if (this.state.coverLetter) {
            console.log(this.state.coverLetter);
            coverLetterData = [{
                value: this.state.coverLetter.SentimentScore.Positive,
                color: "#F7464A",
                highlight: "#FF5A5E",
                label: "Positive"
            },
            {
                value: this.state.coverLetter.SentimentScore.Negative,
                color: "#22e214",
                highlight: "#5AD3D1",
                label: " Negative"
            },
            {
                value: this.state.coverLetter.SentimentScore.Neutral,
                color: "#8e4e00",
                highlight: "#FFC870",
                label: "Neutral"
            },
            {
                value: this.state.coverLetter.SentimentScore.Mixed,
                color: "#1c0de8",
                highlight: "#FFC870",
                label: "Mixed"
            }];
        }

        var profilePictureData = [];
        var profilePictureEmotions = [];
        if (this.state.profilePicture) {
            console.log(this.state.profilePicture);
            if ("FaceDetails" in this.state.profilePicture && this.state.profilePicture.FaceDetails.length > 0) {
                profilePictureData = this.state.profilePicture.FaceDetails[0];
                profilePictureData.Emotions.map((emotion, index) => {
                    profilePictureEmotions.push({
                        value: emotion.Confidence,
                        color: emotionColorMap[emotion.Type],
                        highlight: "#FF5A5E",
                        label: emotion.Type
                    })
                });
            }
        }

        var facebookData = [];

        if (this.state.socialMedia) {
            console.log(this.state.socialMedia);

            if (this.state.socialMedia.length > 0) {
                var positive = 0.0, negative = 0.0, neutral = 0.0, mixed = 0.0;
                var totalPosts = this.state.socialMedia.length;

                this.state.socialMedia.map((post, index) => {
                    positive += post.SentimentScore.Positive;
                    negative += post.SentimentScore.Negative;
                    neutral += post.SentimentScore.Neutral;
                    mixed += post.SentimentScore.Mixed;
                });

                facebookData = [{
                    value: positive / totalPosts,
                    color: emotionColorMap.HAPPY,
                    highlight: "#FFC870",
                    label: "Postitive"
                }, {
                    value: negative / totalPosts,
                    color: emotionColorMap.SAD,
                    highlight: "#FFC870",
                    label: "Negative"
                }, {
                    value: neutral / totalPosts,
                    color: emotionColorMap.CALM,
                    highlight: "#FFC870",
                    label: "Neutral"
                }, {
                    value: mixed / totalPosts,
                    color: emotionColorMap.CONFUSED,
                    highlight: "#FFC870",
                    label: "Mixed"
                }]
            }
        }

        return (
            <div>
                <Head title="Home" />
                <Nav isLoggedIn={true} />
                <Jumbotron title={title} subtitle={subtitle} description={description} />
                <div className="">
                    <div className="container">
                        <div className="row step-1">
                            <div className="col-md-12">
                                <h2>Check out your analysis and results here!</h2>
                            </div>
                        </div>
                        <div className="row results-resume card">
                            <div className="col-md-12">
                                <h2>Resume Score</h2>
                                {this.state.resume ? <p>You seem to be a very {this.state.resume.Sentiment} person!</p> : null}
                                <Charts data={resumeData} options={{}} />
                            </div>
                        </div>
                        <div className="row results-cover-letter card">
                            <div className="col-md-12">
                                <h2>Cover Letter Score</h2>
                                {this.state.coverLetter ? <p>You seem to be a very {this.state.coverLetter.Sentiment} person!</p> : null}
                                <Charts data={coverLetterData} options={{}} />
                            </div>
                        </div>

                        <div className="row results-profile-picture card">
                            <div className="col-md-12">
                                <h2>Profile Picture Score</h2>
                                <Charts data={profilePictureEmotions} options={{}} />
                                {(this.state.profilePicture && this.state.profilePicture.FaceDetails) ?
                                    <div>
                                        <table className="table table-dark table-bordered table-striped">
                                            <thead>
                                                <tr>
                                                    <th scope="col">Age Range</th>
                                                    <th scope="col">Smile</th>
                                                    <th scope="col">Sunglasses</th>
                                                    <th scope="col">Eyes Open?</th>
                                                    <th scope="col">Mouth Open?</th>
                                                    <th scope="col">Brightness Check</th>
                                                    <th scope="col">Sharpness Check</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr>
                                                    <td>You look like you are around <b>{profilePictureData.AgeRange.Low}</b> to <b>{profilePictureData.AgeRange.High}</b> years old in the photo.</td>
                                                    <td>{profilePictureData.Smile.Value === true ? "Nice, you seem to be similing" : "Try smiling a little more in your picture"}</td>
                                                    <td>{profilePictureData.Sunglasses.Value === true ? "You seem to be wear sunglasses. Don't do that!" : "Nice! You don't seem to be wearing sunglasses!"}</td>
                                                    <td>{profilePictureData.EyesOpen.Value === true ? "Good job! Your eyes are open and clear in the photo" : "Oops, your eyes seems to be closed in the photo. Take another one!"}</td>
                                                    <td>{profilePictureData.MouthOpen.Value === true ? "Hmm, your mouth seems to be open in the photo. Try closing it!" : "Good job. Your mouth is closed in the photo."}</td>
                                                    <td>{profilePictureData.Quality.Brightness > 70.0 ? "That's a bright, nice photo! Awesome!" : "Hmm, we think you need a brighter photo."}</td>
                                                    <td>{profilePictureData.Quality.Sharpness > 70.0 ? "That's a sharp photo! Good job human!" : "Hmm, we think you need a sharper photo."}</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    : null}
                            </div>
                        </div>
                        <div className="row results-facebook card">
                            <div className="col-md-12">
                                <h3>Facebook Score</h3>
                                <Charts data={facebookData} options={{}} />
                            </div>
                        </div>
                    </div>
                </div>
                <Footer />
            </div >
        );
    }
}

export default App;