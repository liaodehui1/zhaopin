import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './home'
import AddOrUpdateJob from './add-or-update-job'

function Publish() {
  return (
    <Switch>
      <Route exact path="/admin/recruitment/publish">
        <Home />
      </Route>
      <Route path="/admin/recruitment/publish/addorupdate">
        <AddOrUpdateJob />
      </Route>
    </Switch>
  )
}

export default Publish