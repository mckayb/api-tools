import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import "./App.scss"
import Home from "./components/Home"
import About from "./components/About"
import FlexContainer from "./assets/js/FlexContainer"
import FlexColumn from "./assets/js/FlexColumn"
import FlexRow from "./assets/js/FlexRow"

// This site has 3 pages, all of which are rendered
// dynamically in the browser (not server rendered).
//
// Although the page does not ever refresh, notice how
// React Router keeps the URL up to date as you navigate
// through the site. This preserves the browser history,
// making sure things like the back button and bookmarks
// work properly.

export default function App() {
  return (
    <Router>
      <FlexContainer>
        <FlexRow size={1}>
          <FlexColumn size={1} style={{ borderRight: "1px solid red" }}>
            <div><Link to="/">Home</Link></div>
            <div><Link to="/about">About</Link></div>
            <div><Link to="/dashboard">Dashboard</Link></div>
          </FlexColumn>
          <FlexRow size={5}>
              {/*
                A <Switch> looks through all its children <Route>
                elements and renders the first one whose path
                matches the current URL. Use a <Switch> any time
                you have multiple routes, but you want only one
                of them to render at a time
              */}
              <Switch>
                <Route exact path="/">
                  <Home />
                </Route>
                <Route path="/about">
                  <About />
                </Route>
                <Route path="/dashboard">
                  <Dashboard />
                </Route>
              </Switch>
          </FlexRow>
        </FlexRow>
      </FlexContainer>
    </Router>
  );
}


function Dashboard() {
  return (
    <div>
      <h2>Dashboard</h2>
    </div>
  );
}
