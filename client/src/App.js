import React from "react";
import { Route, Switch } from "react-router-dom";
import ForgotPasswordScreen from "./components/screens/ForgotPasswordScreen";
import LoginScreen from "./components/screens/LoginScreen";
import RegisterScreen from "./components/screens/RegisterScreen";
import ResetPasswordScreen from "./components/screens/ResetPasswordScreen";
import PrivateScreen from "./components/screens/PrivateScreen";
import PrivateRoute from "./components/routing/PrivateRoute";
//Routing
import Private from "./components/routing/PrivateRoute";

const App = () => {
  return (
    <div className="app">
      <Switch>
        <PrivateRoute path="/" component={PrivateScreen} exact />
        <Route path="/login" component={LoginScreen} exact />
        <Route path="/register" component={RegisterScreen} exact />
        <Route path="/forgotpassword" component={ForgotPasswordScreen} exact />
        <Route
          path="/passwordreset/:id"
          component={ResetPasswordScreen}
          exact
        />
      </Switch>
    </div>
  );
};

export default App;
