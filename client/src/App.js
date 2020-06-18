import React from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import Admin from './pages/admin/admin';
import Index from './pages/index/index';

/**
 * 应用根组件
 */
function App() {
  return (
    <HashRouter>
    {/* switch 只配一个 */}
      <Switch>
        <Route exact path="/" component={Index}></Route>
        <Route path="/admin" component={Admin}></Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
