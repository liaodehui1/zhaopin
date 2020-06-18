import React from 'react'
import { Switch, Route } from 'react-router-dom'
import Home from './home'
import AddOrUpdateResume from './add-or-update-resume'
import ViewResume from './view-resume'

function Resume() {
  return (
    <Switch>
      <Route exact path="/admin/information/resume">
        <Home />
      </Route>
      <Route path="/admin/information/resume/addorupdate">
        <AddOrUpdateResume />
      </Route>
      <Route path="/admin/information/resume/view">
        <ViewResume />
      </Route>
    </Switch>
  )
}

export default Resume