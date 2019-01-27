import React, { Component } from 'react';
import { get, find } from 'lodash'
import DataStore from './data-store'
import Store from './store'

export default class Wrapper extends Component {
  constructor (props) {
    super(props)
    let storeClasses = this.props.storeClass || Store
    if (storeClasses.constructor.name === 'Function') {
      storeClasses = [ { pattern: /.*/, class: storeClasses } ]
    }
    let StoreClass = get(find(storeClasses, storeClass => {
      return storeClass.pattern.test('')
    }), 'class')
    if (!StoreClass) {
      StoreClass = Store
    }
    const dataStore = new DataStore(this.props.initialState)
    const store = new StoreClass(dataStore, [], () => {
      this.setState({ store: store })
    }, storeClasses)
    this.state = {
      store
    }
  }

  render () {
    const children = React.Children.map(this.props.children, child => {
      return React.cloneElement(child, {
        store: this.state.store
      })
    })
    return children
  }
}
