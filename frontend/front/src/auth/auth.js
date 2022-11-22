import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState, useContext } from "react";
import { AppContext } from "../AppContext";
import "./styles.css";

export const Auth = () => {
  const [isSignup, setIsSignup] = useState(false);
  const { setUser } = useContext(AppContext);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [errors, setErrors] = useState({
    nameErrors: true,
    emailErrors: true,
    passwordErrors: true,
  });

  const headerText = isSignup ? "Signup" : "Login";

  const handleSubmit = (e) => {
    e.preventDefault();
    isSignup ? sendRegisterRequest() : sendLoginRequest();
  };

  const resetDetails = () => {
    setName("");
    setEmail("");
    setPassword("");
  };

  const sendLoginRequest = async () => {
    const userToLogIn = { userName: name, password };
    try {
      const response = await fetch("https://localhost:7116/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToLogIn),
      });
      const data = await response.json();
      const user = parseJwt(data.accessToken);
      const userRoles = user["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"];
      setUser({ user: data.accessToken, roles: [...userRoles] });
    } catch (e) {
      resetDetails();
      console.log(e);
    }
  };

  const sendRegisterRequest = async () => {
    const userToSignUp = { userName: name, email, password };
    try {
      const response = await fetch("https://localhost:7116/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userToSignUp),
      });
      const data = await response.json();
      setIsSignup(false);
    } catch (e) {
      console.log(e);
    }
  };

  const handleName = (name) => {
    const nameValidator = /[a-zA-Z\d]/gm;
    const matchedName = name.match(nameValidator);
    if (name === "" || !matchedName || matchedName.length !== name.length)
      setErrors({ ...errors, nameErrors: true });
    else {
      setErrors({ ...errors, nameErrors: false });
    }
  };

  const handleEmail = (email) => {
    const emailValidator =
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    const matchedEmail = email.match(emailValidator);
    if (email === "" || !matchedEmail || matchedEmail.length !== email.length)
      setErrors({ ...errors, emailErrors: true });
    else {
      setErrors({ ...errors, emailErrors: false });
    }
  };

  const handlePassword = (password) => {
    const passwordValidator = /[a-zA-Z\d]/gm;
    const matchedPassword = password.match(passwordValidator);
    if (password === "" || !matchedPassword || matchedPassword.length !== password.length)
      setErrors({ ...errors, passwordErrors: true });
    else {
      setErrors({ ...errors, passwordErrors: false });
    }
  };

  function parseJwt(token) {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      window
        .atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  }

  return (
    <div className="auth">
      <form className="auth-form" onSubmit={handleSubmit}>
        <Box
          maxWidth={400}
          margin={"auto"}
          padding={5}
          borderRadius={5}
          boxShadow={"0px 0px 2px 1px rgba(255,255,255,0.75)"}
          sx={{
            ":hover": {
              boxShadow: "0px 0px 4px 2px rgba(255,255,255,0.75)",
            },
            backgroundColor: "#FFFFEF",
          }}
        >
          <Typography variant="h2" padding={3} textAlign="center">
            {headerText}
          </Typography>
          <TextField
            name="name"
            value={name}
            type={"text"}
            variant="outlined"
            placeholder="Name"
            margin="normal"
            sx={{ width: "100%" }}
            onChange={(e) => {
              const newName = e.target.value;
              setName(newName);
              handleName(newName);
            }}
          />
          {isSignup && (
            <TextField
              name="email"
              value={email}
              type={"email"}
              variant="outlined"
              placeholder="Email"
              margin="normal"
              sx={{ width: "100%" }}
              onChange={(e) => {
                const newEmail = e.target.value;
                setEmail(newEmail);
                handleEmail(newEmail);
              }}
            />
          )}
          <TextField
            name="password"
            value={password}
            type={"password"}
            variant="outlined"
            placeholder="Password"
            margin="normal"
            sx={{ width: "100%" }}
            onChange={(e) => {
              const newPassword = e.target.value;
              setPassword(newPassword);
              handlePassword(newPassword);
            }}
          />
          <Button
            type="submit"
            variant="contained"
            color="warning"
            sx={{ marginTop: 3, borderRadius: 3, width: "100%" }}
          >
            {headerText}
          </Button>
          <Button
            onClick={() => setIsSignup(!isSignup)}
            sx={{ marginTop: 3, borderRadius: 3, width: "100%" }}
          >
            Change To {isSignup ? "Login" : "Signup"}
          </Button>
        </Box>
      </form>
    </div>
  );
};
