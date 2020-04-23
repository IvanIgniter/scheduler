import { useStaticRendering } from 'mobx-react'
import UserStore from './userStore'

const isServer = typeof window === 'undefined'
useStaticRendering(isServer)

let store = null

export default function initializeStore(
  initialData = {
    userStore: {},
    assistantStore: {
      industryCategory: [],
      purposeCategory: []
    },
    navigationStore: {},
    narrationStore: {
      narrations: [],
      modal: {}
    },
    movieStore: {},
    orderStore: {}
  }) {
  if (isServer) {
    return {
      userStore: new UserStore(initialData.userStore),
    }
  }
  if (store === null) {
    store = {
      userStore: new UserStore(initialData.userStore),
    }
  }

  return store
}
