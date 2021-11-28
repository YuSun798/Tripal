import React from "react";
import "font-awesome/css/font-awesome.min.css";
import "./Login.css";








export default class Login extends React.Component {
  constructor(props) {
    super(props);
    // State maintained by this React component is the selected movie name,
    // and the list of recommended movies.

    this.formRef = React.createRef();
    this.state = {
      name: "",
      email: "",
      password: "",
    };


    this.loginUser = this.loginUser.bind(this);
    this.signUp = this.signUp.bind(this);
    this.changeToSignUp = this.changeToSignUp.bind(this);
    this.changeToLogin = this.changeToLogin.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handlePasswordChange = this.handlePasswordChange.bind(this);

  }

  
  handleEmailChange(e) {
    this.setState({
      email: e.target.value,
    });
  }
  handleNameChange(e) {
    this.setState({
      name: e.target.value,
    });
  }

  handlePasswordChange(e) {
    this.setState({
      password: e.target.value,
    });
  }

  changeToSignUp(e) {
    this.formRef.current.classList.add("bounceLeft");
    this.formRef.current.classList.remove("bounceRight");
  }

  changeToLogin(e) {
    this.formRef.current.classList.remove("bounceLeft");
    this.formRef.current.classList.add("bounceRight");
  }

  async loginUser(e) {
    e.preventDefault();
    const loginRequest = {};
    loginRequest.username = this.state.name;
    loginRequest.password = this.state.password;
    const token = await fetch("http://localhost:8080/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(loginRequest),
    })
      .then((data) => data.json())
      .catch((error) => {
        throw error;
      });
    if (token["message"]) {
      alert("username or password is not correct. Please try again");
    } else {
      this.props.setToken(token);
      window.location = "/dashboard";
    }
  }
  async signUp(e) {
    e.preventDefault();
    const requestBody = {};
    requestBody.username = this.state.name;
    requestBody.password = this.state.password;
    requestBody.email = this.state.email;
    const token = await fetch("http://localhost:8080/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    })
      .then((data) => data.json())
      .catch((error) => {
        throw error;
      });
    console.log("token:::" + token.toString());
  }






  render() {
    return (
      <section className="user">
        <header>
          <h2>
            <a href="/dashboard"> Home</a>
          </h2>
        </header>
        <div className="user_options-container">
          <div className="user_options-text">
            <div className="user_options-unregistered">
              <h2 className="user_unregistered-title">
                Don't have an account?
              </h2>
              <p className="user_unregistered-text">
                Click "sign up" to create an account.
              </p>
              <button
                className="user_unregistered-signup"
                id="signup-button"
                onClick={this.changeToSignUp}
              >
                Sign up
              </button>

            </div>
            <div className="user_options-registered">
              <h2 className="user_registered-title">Have an account?</h2>
              <p className="user_registered-text"> Click "login" to sign in.</p>
              <button
                className="user_registered-login"
                id="login-button"
                onClick={this.changeToLogin}
              >
                Login
              </button>
            </div>
          </div>
          <div
            className="user_options-forms"
            id="user_options-forms"
            ref={this.formRef}
          >
            <div className="user_forms-login">
              <h2 className="forms_title">Login</h2>
              <form className="forms_form">
                <fieldset className="forms_fieldset">
                  <div className="forms_field">
                    <input
                      type="text"
                      placeholder="Username"
                      className="forms_field-input"
                      value={this.state.name}
                      onChange={this.handleNameChange}
                      required
                      autofocus
                    />
                  </div>
                  <div className="forms_field">
                    <input
                      type="password"
                      placeholder="Password"
                      className="forms_field-input"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                      required
                    />
                  </div>
                </fieldset>
                <div className="forms_buttons">
                  <button type="button" className="forms_buttons-forgot">
                    Forgot password?
                  </button>
                  <input
                    type="submit"
                    value="Log In"
                    className="forms_buttons-action"
                    onClick={(e) => this.loginUser(e)}
                  />
                </div>
              </form>
            </div>
            <div className="user_forms-signup">
              <h2 className="forms_title">Sign Up</h2>
              <form className="forms_form">
                <fieldset className="forms_fieldset">
                  <div className="forms_field">
                    <input
                      type="text"
                      placeholder="Full Name"
                      className="forms_field-input"
                      value={this.state.name}
                      onChange={this.handleNameChange}
                      required
                    />
                  </div>
                  <div className="forms_field">
                    <input
                      type="email"
                      placeholder="Email"
                      className="forms_field-input"
                      value={this.state.email}
                      onChange={this.handleEmailChange}
                      required
                    />
                  </div>
                  <div className="forms_field">
                    <input
                      type="password"
                      placeholder="Password"
                      className="forms_field-input"
                      value={this.state.password}
                      onChange={this.handlePasswordChange}
                      required
                    />
                  </div>
                </fieldset>
                <div className="forms_buttons">
                  <input
                    type="submit"
                    value="Sign up"
                    className="forms_buttons-action"
                    onClick={(e) => this.signUp(e)}
                  />
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    );
  }

  s;
}
