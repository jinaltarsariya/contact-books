import "./App.css";
import Contact_page from "./components/Contact_page";
import Fill_user_otp from "./components/Fill_user_otp";
import Group_Page from "./components/Group_Page";
import Reset_password from "./components/Reset_password";
import User_Dashboard from "./components/User_Dashboard";
import User_Signup from "./components/User_Signup";
import User_forgot_password from "./components/User_forgot_password";
import User_login from "./components/User_login";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

function App() {
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={User_login} />
          <Route path="/signup" exact component={User_Signup} />
          <Route path="/contact" component={Contact_page} />
          <Route path="/group" component={Group_Page} />
          <Route path="/user/forgotpassword" component={User_forgot_password} />
          <Route path="/user/request" component={Fill_user_otp} />
          <Route path="/user/reset/password" component={Reset_password} />
          <Route path="/dashboard" component={User_Dashboard} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
