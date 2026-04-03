import React from "react";
import router from "next/router";
import { app } from "../config/firebase-config";
import { getAuth } from "firebase/auth";

const withAuth = (Component) => {
  // eslint-disable-next-line react/display-name
  return class extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        status: "LOADING",
      };
      this.unsubscribe = null;
    }

    componentDidMount() {
      const auth = getAuth(app);
      this.unsubscribe = auth.onAuthStateChanged((authUser) => {
        if (authUser) {
          this.setState({
            status: "SIGNED_IN",
          });
        } else {
          this.setState({
            status: "SIGNED_OUT",
          });
          router.push("/login");
        }
      });
    }

    componentWillUnmount() {
      if (this.unsubscribe) {
        this.unsubscribe();
      }
    }

    renderContent() {
      const { status } = this.state;
      if (status === "LOADING") {
        return <h1>Loading ......</h1>;
      } else if (status === "SIGNED_IN") {
        return <Component {...this.props} />;
      }

      return null;
    }

    render() {
      return <React.Fragment>{this.renderContent()}</React.Fragment>;
    }
  };
};
export default withAuth;
