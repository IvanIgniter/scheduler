import { observable, action } from 'mobx'

const DEFAULT_INQUIRY_FORM = {
  companyName: '',
  lastName: '',
  firstName: '',
  postalNumber: '',
  address: '',
  phoneNumber: '',
  mailAddress: '',
  content: '',
}

class UserStore {
  @observable user = null
  @observable tempUser = null
  @observable loggedIn = null
  @observable token = null
  @observable messages = null

  constructor(initialData = {}) {
    this.user = initialData.user
    this.tempUser = initialData.tempUser
    this.loggedIn = initialData.loggedIn
    this.token = initialData.token
    this.inquiryForm = DEFAULT_INQUIRY_FORM
    this.messages = initialData.messages
  }

  @action setUser(user) {
    this.user = user
  }

  @action setToken(token) {
    this.token = token
  }

  @action setLoggedIn(bool) {
    this.loggedIn = bool
  }

  @action setTempUser(data) {
    this.tempUser = data
  }

  @action setInquiryForm(data) {
    this.inquiryForm = data
  }

  @action resetInquiryForm() {
    this.inquiryForm = DEFAULT_INQUIRY_FORM
  }

  @action setMessages(data) {
    this.messages = data
  }
}

export default UserStore
