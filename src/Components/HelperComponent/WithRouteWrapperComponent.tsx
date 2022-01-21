import React from "react";
import {
  useLocation,
  useNavigate,
  useParams
} from "react-router-dom";

interface Props {}

function withRouter(Component: React.ComponentType<any>) {
  function ComponentWithRouterProp(props: Props) {
    let location = useLocation();
    let navigate = useNavigate();
    let params = useParams();
    return (
      <Component
        {...props}
        router={{ location, navigate, params }}
      />
    );
  }

  return ComponentWithRouterProp;
}

export default withRouter