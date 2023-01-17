import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(<App />)

# and file App.js looks like this

const App = () => (
  <div>
    <p>Hello world</p>
  </div>
)

export default App

## The files App.css, App.test.js, index.css, logo.svg, setupTests.js and reportWebVitals.js may be deleted as they are not needed in our application right now.
