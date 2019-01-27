import { filter, get, isArray, unset, set } from 'lodash'
import produce from 'immer'

export default class DataStore {
  constructor (data = {}) {
    this.data = data
  }

  get (path) {
    if (!path || !path.length) {
      return this.data
    } else {
      return get(this.data, path)
    }
  }

  set (path, value) {
    this.data = produce(this.data, draft => {
      set(draft, path, value)
    })
  }

  remove (path) {
    console.log('this.data before remove', this.data)
    this.data = produce(this.data, draft => {
      unset(draft, path)
      let parentPath = [ ...path ]
      parentPath.pop()
      if (isArray(get(draft, parentPath))) {
        set(draft, parentPath, filter(get(draft, parentPath)))
      }
    })
    console.log('this.data after remove', this.data)
  }

  modify(path, fn) {
    this.data = produce(this.data, draft => {
      let v = get(draft, path)
      const newV = fn(v)
      if (typeof newV !== 'undefined') v = newV
      set(draft, path, v)
    })
  }
}

