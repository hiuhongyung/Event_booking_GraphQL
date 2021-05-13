import React from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/navigation/MainNavigation";

function App() {
  return (
    <BrowserRouter className="App">
      <React.Fragment>
        <MainNavigation />

        <main className="main-content">
          <Switch>
            <Redirect from="/" to="/auth" exact />
            <Route path="/auth" component={AuthPage} />
            <Route path="/events" component={EventsPage} />
            <Route path="/bookings" component={BookingPage} />
          </Switch>
        </main>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
