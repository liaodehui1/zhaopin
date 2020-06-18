import { createStore, applyMiddleware } from 'redux'
import thunk from 'redux-thunk'
import { composeWithDevTools } from 'redux-devtools-extension'

import reducer from './reducer'

// export function getStore() {
//   return createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))
// }

export  default createStore(reducer, composeWithDevTools(applyMiddleware(thunk)))