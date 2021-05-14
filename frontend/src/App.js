import React, { useState } from "react";
import { BrowserRouter, Route, Redirect, Switch } from "react-router-dom";
import "./App.css";
import AuthPage from "./pages/Auth";
import BookingPage from "./pages/Booking";
import EventsPage from "./pages/Events";
import MainNavigation from "./components/navigation/MainNavigation";
import AuthContext from "./context/auth-context";

function App() {
  const [state, setState] = useState({
    token: null,
    userId: null,
  });

  const islogin = (token, userId, tokenExpiration) => {
    setState({ token: token, userId: userId });
  };

  const islogout = () => {
    setState({ token: null, userId: null });
  };
  return (
    <BrowserRouter className="App">
      <React.Fragment>
        <AuthContext.Provider
          value={{
            token: state.token,
            userId: state.userId,
            login: islogin,
            logout: islogout,
          }}
        >
          <MainNavigation />

          <main className="main-content">
            <Switch>
             {!state.token && <Redirect from="/" to="/auth" exact />} 
             {state.token && <Redirect from="/" to="/events" exact />} 
             {state.token && <Redirect from="/auth" to="/events" exact />} 
             {!state.token &&  <Route path="/auth" component={AuthPage} />}
              <Route path="/events" component={EventsPage} />
              {state.token &&  <Route path="/bookings" component={BookingPage} />}
            </Switch>
          </main>
        </AuthContext.Provider>
      </React.Fragment>
    </BrowserRouter>
  );
}

export default App;
