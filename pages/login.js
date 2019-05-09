import Head from '../components/head'
import Nav from '../components/nav-dark'
import Footer from '../components/footer'
import LoginForm from '../components/loginForm'
import Jumbotron from '../components/jumbotron'

const title = 'Login'
const subtitle = 'Login to your SureHired account below to view your status.'
const description = "Don't have an account? Click Sign Up on the navigation to create one"

const Login = () => (
  <div>
    <Head title="Login" />
    <Nav />
    <div className="app-hero">
      <div className="container">
        <div className="row">
          <div className="col-md-10 offset-md-1">
            <Jumbotron title={title} subtitle={subtitle} description={description} form={<LoginForm />} />
          </div>
        </div>
      </div>
    </div>
    <Footer />
  </div>
)

export default Login
