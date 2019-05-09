import React from 'react'
import Link from 'next/link'
import Router from 'next/router'
import Cookies from 'js-cookie'

class LoginForm extends React.Component {
  constructor(props) {
    super(props);

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const value = target.type === 'checkbox' ? target.checked : target.value;
    const name = target.name;

    this.setState({
      [name]: value
    });
  }

  async handleSubmit(event) {
    event.preventDefault();
    console.log(this.state);

    const rawResponse = await fetch('/api/v1/auth/', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    });

    const content = await rawResponse.json();
    console.log(content);

    // perform transition to app page
    if (content.msg == "Success") {
      Router.push({
        pathname: '/app/dashboard'
      });
      Cookies.set("name", content.name);
      Cookies.set("userId", content.userId);
    } else {
      alert("Your credentials are wrong!");
    }
  }

  render() {
    return (
      <div className="container contact-form">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  onChange={this.handleInputChange}
                />
              </div>
              <input type="submit" className="btn btn-primary" value="Login" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default LoginForm
