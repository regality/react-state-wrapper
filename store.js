import { find, get, map, set, toPath } from 'lodash'

export default class Store {
  constructor (dataStore, path = [], onSet, classes) {
    this.dataStore = dataStore
    this.path = toPath(path)
    this.onSet = onSet || (() => {})
    this.classes = classes
  }

  getStateMgmtClass (path) {
    const pathString = path.join('.')
    const StoreClass = get(find([ ...this.classes ].reverse(), storeClass => {
      return storeClass.pattern.test(pathString)
    }), 'class')
    if (!StoreClass) {
      StoreClass = Store
    }
    return StoreClass
  }

  map (path = [], cb) {
    const fullPath = [ ...this.path, ...toPath(path) ]
    return map(this.dataStore.get(fullPath), (item, i) => {
      const itemPath = [ ...fullPath, i ]
      const StoreClass = this.getStateMgmtClass(itemPath)
      return cb(new StoreClass(this.dataStore, itemPath, this.onSet), i)
    })
  }

  getStore (path = []) {
    const fullPath = [ ...this.path, ...toPath(path) ]
    const StoreClass = this.getStateMgmtClass(fullPath)
    return new StoreClass(this.dataStore, [ ...this.path, ...toPath(path) ], this.onSet)
  }

  set (path = [], value) {
    this.dataStore.set([ ...this.path, ...toPath(path) ], value)
    this.onSet()
  }

  remove (path = []) {
    const fullPath = [ ...this.path, ...toPath(path) ]
    this.dataStore.remove(fullPath)
    this.onSet()
  }

  get (path = []) {
    return this.dataStore.get([ ...this.path, ...toPath(path) ])
  }

  modify(path = [], fn) {
    const fullPath = [ ...this.path, ...toPath(path) ]
    this.dataStore.modify(fullPath, fn)
    this.onSet()
  }
}

