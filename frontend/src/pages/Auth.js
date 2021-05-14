import React, { useRef, useState, useContext } from "react";
import "./Auth.css";
import AuthContext from "../context/auth-context";

function Auth() {
  const [isLogin, setisLogin] = useState(true);

  const contextType = useContext(AuthContext);

  const switchModeHandler = () => {
    setisLogin(!isLogin);
  };

  const enteredEmail = useRef("");
  const enteredPassword = useRef("");
  const submitHandler = (event) => {
    event.preventDefault();
    const submittedEmail = enteredEmail.current.value;
    const submittedPassword = enteredPassword.current.value;

    if (
      submittedEmail.trim().length === 0 ||
      submittedPassword.trim().length === 0
    ) {
      return;
    }
    let requestBody = {
      query: `
        query {
          login(email: "${submittedEmail}", password: "${submittedPassword}") {
            userId
            token
            tokenExpiration
          }
        }
      `,
    };
    if (!isLogin) {
      requestBody = {
        query: `
    mutation {
      createUser(userInput: {email: "${submittedEmail}" , password: "${submittedPassword}"}){
        _id
        email
      }
    }
    `,
      };
    }

    fetch("http://localhost:3000/graphql", {
      method: "POST",
      body: JSON.stringify(requestBody),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error("Failed");
        }
        return res.json();
      })
      .then((resData) => {
        if (resData.data.login.token) {
          contextType.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <div>
      <form onSubmit={submitHandler} className="auth-form">
        <div className="form-control">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" ref={enteredEmail} />
        </div>
        <div className="form-control">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" ref={enteredPassword} />
        </div>
        <div className="form-actions">
          <button type="button" onClick={switchModeHandler}>
            Switch to {isLogin ? "SignUp" : "Login"}
          </button>
          <button type="submit"> Submit </button>
        </div>
      </form>
    </div>
  );
}

export default Auth;
