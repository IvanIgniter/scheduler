import React, {PureComponent, Fragment} from 'react'
import Router, { withRouter }  from 'next/router'
import Layout from '../components/Layout';
import http from '../lib/http'
import {inject, observer} from 'mobx-react'

@inject('userStore') @observer
class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      credentials: {
        email: '',
        password: ''
      }
    }
  }

  handleOnChange = async (e) => {
    const {name, value} = e.target
    this.setState({credentials: { ...this.state.credentials, [name]: value }})
  }

  handleSubmit = async () => {
    // try {
      console.log("cred",this.state.credentials)
      let form = new FormData();
      form.append(`email`, this.state.credentials.email)
      form.append(`password`, this.state.credentials.password)
      const user = await http().post('/api/auth/login', form)
      this.props.userStore.token = user.data.access_token
      this.props.userStore.loggedIn = true
      this.props.userStore.user = user.data.user
      localStorage.setItem('access_token', user.data.access_token)
      const returnPageHref = sessionStorage.getItem('returnPageHref');
      const returnPageAs = sessionStorage.getItem('returnPageAs');

      if (typeof this.props.router.query !== 'undefined' && typeof this.props.router.query.returnPage !== 'undefined') {
        const returnPage = "/plan?autoSave=true";
        const returnPageAs = this.props.router.query.returnPage;
        Router.push(returnPage, returnPageAs)
      } else if (returnPageHref) {
        sessionStorage.removeItem('returnPageHref');
        sessionStorage.removeItem('returnPageAs');
        Router.push(returnPageHref, returnPageAs)
      } else {
        Router.push('/mypage')
      }
    // } catch (error) {
    //   errors.add('email', ' ');
    //   errors.add('password', 'メールアドレスもしくはパスワードが正しくありません')
    //   this.setState({errors, toUpdate: !this.state.toUpdate})
    // }
  }

  render() {

    return (
        <div>
          <div className="row">
            <div className="col-lg-12">
              <div className="page-header">
                <h1 id="forms">Login</h1>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-4"> 
              
                <fieldset>
                  <div className="form-group">
                    <input type="email" className="form-control" id="exampleInputEmail1" aria-describedby="emailHelp" placeholder="Enter email" 
                      name="email" onChange={this.handleOnChange} />
                  </div>
                  <div className="form-group">
                    <input type="password" className="form-control" id="exampleInputPassword1" placeholder="Password" 
                      name="password" onChange={this.handleOnChange}/>
                  </div>
                  <button type="button" className="btn btn-primary" onClick={this.handleSubmit}>Submit</button>
                </fieldset> 
             
            </div>
          </div>
        </div>
    )
  }

}

export default withRouter(Login);
