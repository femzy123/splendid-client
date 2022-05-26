import React from "react";
import router from "next/router";
import { app } from "../config/firebase-config";
import { getAuth } from "firebase/auth";

const withAuth = (Component) => {
  const auth = getAuth(app);
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        status: null,
      };
    }

    componentDidMount() {
      auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          this.setState({
            status: "SIGNED_IN",
          });
        } else {
          router.push("/login");
        }
      });
    }

    renderContent() {
      const { status } = this.state;
      if (status == "LOADING") {
        return <h1>Loading ......</h1>;
      } else if (status == "SIGNED_IN") {
        return <Component {...this.props} />;
      }
    }
    render() {
      return <React.Fragment>{this.renderContent()}</React.Fragment>;
    }
  };
};
export default withAuth;
