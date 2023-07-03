import React, { useEffect } from "react";

const Login = () => {
  useEffect(() => {
    require("@passageidentity/passage-elements/passage-auth");
  }, []);

  return <passage-auth app-id={process.env.PASSAGE_APP_ID}></passage-auth>;
};

export default Login;
