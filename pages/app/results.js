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
            jobId: props.url.query.jobId
        }
    }

    componentDidMount() {
        this.getJobDetails();
    }

    getJobDetails() {
        fetch('/api/v1/jobs?jobId=' + this.state.jobId, {
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
                    color: emotionColorMap.HAPPY,
                    highlight: "#FF5A5E",
                    label: "Positive"
                },
                {
                    value: this.state.resume.SentimentScore.Negative,
                    color: emotionColorMap.SAD,
                    highlight: "#5AD3D1",
                    label: " Negative"
                },
                {
                    value: this.state.resume.SentimentScore.Neutral,
                    color: emotionColorMap.CALM,
                    highlight: "#FFC870",
                    label: "Neutral"
                },
                {
                    value: this.state.resume.SentimentScore.Mixed,
                    color: emotionColorMap.CONFUSED,
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
                color: emotionColorMap.HAPPY,
                highlight: "#FF5A5E",
                label: "Positive"
            },
            {
                value: this.state.coverLetter.SentimentScore.Negative,
                color: emotionColorMap.ANGRY,
                highlight: "#5AD3D1",
                label: " Negative"
            },
            {
                value: this.state.coverLetter.SentimentScore.Neutral,
                color: emotionColorMap.CALM,
                highlight: "#FFC870",
                label: "Neutral"
            },
            {
                value: this.state.coverLetter.SentimentScore.Mixed,
                color: emotionColorMap.CONFUSED,
                highlight: "#FFC870",
                label: "Mixed"
            }];
        }

        var profilePictureData = [];
        var profilePictureEmotions = [];
        var highestEmotionIndex = 0.0, highestEmotion = null;
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
                    if (emotion.Confidence > highestEmotionIndex) {
                        highestEmotionIndex = emotion.Confidence;
                        highestEmotion = emotion.Type;
                    }
                });
            }
        }

        var facebookData = [];

        if (this.state.socialMedia) {
            console.log(this.state.socialMedia);

            var highestFacebookEmotion = null;
            var highFacebookIndex = 0.0;

            if (this.state.socialMedia.length > 0) {
                var positive = 0.0, negative = 0.0, neutral = 0.0, mixed = 0.0;
                var totalPosts = this.state.socialMedia.length;

                this.state.socialMedia.map((post, index) => {
                    positive += post.SentimentScore.Positive;
                    negative += post.SentimentScore.Negative;
                    neutral += post.SentimentScore.Neutral;
                    mixed += post.SentimentScore.Mixed;

                    if (positive > highFacebookIndex) {
                        highFacebookIndex = positive;
                        highestFacebookEmotion = "POSITIVE";
                    } else if (negative > highFacebookIndex) {
                        highFacebookIndex = negative;
                        highestFacebookEmotion = "NEGATIVE";
                    } else if (netural > highFacebookIndex) {
                        highFacebookIndex = neutral;
                        highestFacebookEmotion = "NEUTRAL";
                    } else if (mixed > highFacebookIndex) {
                        highFacebookIndex = mixed;
                        highestFacebookEmotion = "MIXED";
                    }
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

                        {this.state.resume ? <div className="row results-resume">
                            <div className="col-md-6">
                                <h2>Resume Score</h2>
                                {this.state.resume ? <p>You seem to be a very {this.state.resume.Sentiment} person!</p> : null}
                                {this.state.resume.Sentiment == "POSITIVE" ? <p>You have a very positive personality that's very good! It's something recruiters look out for in their ideal candidates.</p> : null}
                                {this.state.resume.Sentiment == "NEGATIVE" ? <p>You seem to come across as someone with a negative personality. We suggest that you should improve your resume to be more positive. Try using more keywords which also reflect your enthusiasm, leadership and other positive skill-sets.</p> : null}
                                {this.state.resume.Sentiment == "NEUTRAL" ? <p>You come across as a very neutral person. In a world of competition, being neutral might not be very useful to boost your chances of getting hired. Try using more keywords to add some positive vibes to your resume!</p> : null}
                                {this.state.resume.Sentiment == "MIXED" ? <p>You have a mixed persoanlity! Try to improve your resume to come across as a positive person! That is the ideal candidate recruiters look out for!</p> : null}
                            </div>
                            <div className="col-md-6">
                                <Charts data={resumeData} options={{}} />
                            </div>
                        </div> : null}

                        {this.state.coverLetter ? <div className="row results-cover-letter">
                            <div className="col-md-6">
                                <h2>Cover Letter Score</h2>
                                {this.state.coverLetter ? <p>You seem to be a very {this.state.coverLetter.Sentiment} person!</p> : null}
                                {this.state.coverLetter.Sentiment == "POSITIVE" ? <p>You have a very positive personality that's very good! It's something recruiters look out for in their ideal candidates.</p> : null}
                                {this.state.coverLetter.Sentiment == "NEGATIVE" ? <p>You seem to come across as someone with a negative personality. We suggest that you should improve your cover letter to be more positive. Try using more keywords which also reflect your enthusiasm, leadership and other positive skill-sets.</p> : null}
                                {this.state.coverLetter.Sentiment == "NEUTRAL" ? <p>You come across as a very neutral person. In a world of competition, being neutral might not be very useful to boost your chances of getting hired. Try using more keywords to add some positive vibes to your resume!</p> : null}
                                {this.state.coverLetter.Sentiment == "MIXED" ? <p>You have a mixed persoanlity! Try to improve your cover letter to come across as a positive person! That is the ideal candidate recruiters look out for!</p> : null}
                            </div>
                            <div className="col-md-6">
                                <Charts data={coverLetterData} options={{}} />
                            </div>
                        </div> : null}

                        {(this.state.profilePicture && this.state.profilePicture.FaceDetails) ?
                            <div className="results-profile-picture">
                                <div className="row">
                                    <div className="col-md-6">
                                        <h2>Profile Picture Score</h2>
                                        {highestEmotion === "HAPPY" ? <p>You seem happy in your photo! Good one!</p> : null}
                                        {highestEmotion === "DISGUSTED" ? <p>Your photo suggests you look disgusted at something. Hmm, we think you need a better photo!</p> : null}
                                        {highestEmotion === "SURPRISED" ? <p>You seem to be really surprised at something. We suggest a calm, happy photo for best results.</p> : null}
                                        {highestEmotion === "CALM" ? <p>You seem to be really calm in the photo. Good job! Maybe also try simling a little more?</p> : null}
                                        {highestEmotion === "ANGRY" ? <p>You seem really angry in the photo! Calm down and get a good shot!</p> : null}
                                        {highestEmotion === "SAD" ? <p>You seem to be sad in the photo! Cheer up!! Take's take a happy one!</p> : null}
                                        {highestEmotion === "CONFUSED" ? <p>You seem to be really confused about something. Try taking another photo!</p> : null}
                                    </div>
                                    <div className="col-md-6">
                                        <Charts data={profilePictureEmotions} options={{}} />
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-12">
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
                                    </div>
                                </div>
                            </div>
                            : null}

                        {this.state.socialMedia && this.state.socialMedia.length > 0 ?
                            <div className="row results-facebook">
                                <div className="col-md-6">
                                    <h3>Facebook Score</h3>
                                    {highestFacebookEmotion ? <p>You seem to be a very {highestFacebookEmotion} person!</p> : null}
                                    {highestFacebookEmotion === "POSITIVE" ? <p>You have a positive outlook from your Facebook posts! Excellent, you seem to be an ideal candidiate</p> : null}
                                    {highestFacebookEmotion === "NEGATIVE" ? <p>You have a negative outlook from the analysis of your Facebook posts. Cheer up, calm down and spread some love!</p> : null}
                                    {highestFacebookEmotion === "NEUTRAL" ? <p>You have a neutral outlook. That's good! </p> : null}
                                    {highestFacebookEmotion === "MIXED" ? <p>You seem to have a mixed personality. That's okay, but you can try to be more positive too! :)</p> : null}
                                </div>
                                <div className="col-md-6">
                                    <Charts data={facebookData} options={{}} />
                                </div>
                            </div> : null}

                    </div>
                </div>
                <Footer />
            </div >
        );
    }
}

export default App;