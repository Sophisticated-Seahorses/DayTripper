import React from 'react';
import $ from 'jquery';
import GoogleLogin from 'react-google-login';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    $('body').addClass('loginPage');
  }
  componentWillUnmount() {
    $('body').removeClass('loginPage');
  }
  responseGoogle(response) {
    console.log(response);
    console.log(response.accessToken);
    $.ajaxSetup({
      beforeSend: function(xhr) {
        xhr.setRequestHeader('access_token', response.accessToken);
      }
    });
    // $.ajax({
    //   url: '/authenticate',
    //   type: 'GET',
    //   success: (data) => {
    //     console.log(data);
    //   },
    //   error: (err) => {
    //     console.log(err);
    //   }
    // });
    this.props.history.push('/homepage');
    this.props.setToken(response.accessToken);
  }
  render() {
    return (
      <div className='container-fluid'>
        <img className='center-block img-responsive' src='../../media-lib/day-tripper-logo-transparent.png' />
        <div className='center'>
          <GoogleLogin
          className='btn btn-lg btn-primary'
          clientId='898316907945-kk9tkv33a46v17qej06tfce8hmv88g44.apps.googleusercontent.com'
          buttonText="Login With Google"
          onSuccess={this.responseGoogle.bind(this)} />
        </div>
      </div>

    );
  }
}

export default Login;