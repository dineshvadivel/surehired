import Head from '../components/head'
import Nav from '../components/nav-dark'
import Hero from '../components/hero'
import Footer from '../components/footer'
import SignUpForm from '../components/signUpForm'
import Jumbotron from '../components/jumbotron'

const title = 'Sign Up'
const subtitle = 'Create an account on SureHired and boost your career search right away!'
const description = 'Submit the below form to create an account.'

const SignUp = () => (
    <div>
        <Head title="Sign Up" />
        <Nav />
        <div className="app-hero">
            <div className="container">
                <div className="row">
                    <div className="col-md-10 offset-md-1">
                        <Jumbotron title={title} subtitle={subtitle} description={description} form={<SignUpForm />} />
                    </div>
                </div>
            </div>
        </div>
        <Footer />
    </div>
)

export default SignUp
