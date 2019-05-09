import React from 'react'
import Link from 'next/link'
import Router from 'next/router'

class SignUpForm extends React.Component {
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

    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.state)
    });

    alert("Your sign up was successful!");
    Router.push('/login');
  }

  render() {
    return (
      <div className="container contact-form">
        <div className="row">
          <div className="col-md-8 offset-md-2">
            <form onSubmit={this.handleSubmit}>
              <div className="form-group">
                <label>First Name</label>
                <input
                  type="text"
                  name="firstName"
                  className="form-control"
                  placeholder="John"
                  required
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input
                  type="text"
                  name="lastName"
                  className="form-control"
                  placeholder="Doe"
                  required
                  onChange={this.handleInputChange}
                />
              </div>
              <div className="form-group">
                <label>Email address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  aria-describedby="emailHelp"
                  placeholder="Enter email"
                  required
                  onChange={this.handleInputChange}
                />
                <small id="emailHelp" className="form-text text-muted">
                  We'll never share your email with anyone else.
            </small>
              </div>
              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Password"
                  required
                  onChange={this.handleInputChange}
                />
              </div>
              <input type="submit" className="btn btn-primary" value="Sign Up" />
            </form>
          </div>
        </div>
      </div>
    )
  }
}

export default SignUpForm
