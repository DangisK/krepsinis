import "./App.css";
import React, { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Home } from "./home";
import { Routes, Route, useNavigate, Navigate } from "react-router-dom";
import { Standings } from "./standings";
import { Schedule } from "./schedule";
import { Roster } from "./roster";
import { SelectedPlayer } from "./selected-player";
import {
  AdminDashboard,
  InjuriesTable,
  MatchesTable,
  PlayersTable,
  TeamsTable,
  TournamentsTable,
} from "./admin";
import { Auth } from "./auth";
import { AppContext } from "./AppContext";
import { Team } from "./team";
import { PageNotFound } from "./page-not-found";
import { Tournament } from "./tournament";
import { Match } from "./match";
import { UserContext } from "./context/user-context";

function App() {
  const localStorageData = JSON.parse(localStorage.getItem("basketballJWT"));
  const [user, setUser] = useState(
    localStorageData === null
      ? { token: "", roles: [], name: "" }
      : {
          token: localStorageData.token,
          roles: localStorageData.roles,
          name: localStorageData.name,
        }
  );
  const [isUserLoggedIn, setIsUserLoggedIn] = useState(user.token !== "");

  console.log(user, isUserLoggedIn);
  const navigateTo = useNavigate();

  const onLogout = () => {
    localStorage.removeItem("basketballJWT");
    setUser({ token: "", roles: [], name: "" });
    setIsUserLoggedIn(false);
  };

  useEffect(() => {
    if (isUserLoggedIn) {
      navigateTo("/");
    }
  }, [isUserLoggedIn]);

  useEffect(() => {
    setIsUserLoggedIn(user.token !== "");
  }, [user]);

  const ProtectedRoute = ({ children }) => {
    if (!isUserLoggedIn) {
      // user is not authenticated
      return <Navigate to="/auth" />;
    }
    return children;
  };

  return (
    <>
      <UserContext.Provider value={{ user, setUser }}>
        <>
          <Navbar onLogout={onLogout} />
          <main>
            <div className="container">
              <Routes>
                <Route path="/auth" element={<Auth />} />
                <Route
                  index
                  exact
                  path="/"
                  element={
                    <ProtectedRoute>
                      <Home />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/turnyrine-lentele"
                  element={
                    <ProtectedRoute>
                      <Standings />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/tvarkarastis"
                  element={
                    <ProtectedRoute>
                      <Schedule />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/turnyrai"
                  element={
                    <ProtectedRoute>
                      <Tournament />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/turnyrai/:turnyroId"
                  element={
                    <ProtectedRoute>
                      <Match />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/komandos/:komandosId"
                  element={
                    <ProtectedRoute>
                      <Roster />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/komandos/:komandosId/zaidejas/:zaidejoId"
                  element={
                    <ProtectedRoute>
                      <SelectedPlayer />
                    </ProtectedRoute>
                  }
                />
                <Route
                  path="/komandos"
                  element={
                    <ProtectedRoute>
                      <Team />
                    </ProtectedRoute>
                  }
                />
                {user.roles.find((role) => role === "Admin") && (
                  <Route
                    path="/db-lenteles"
                    element={
                      <ProtectedRoute>
                        <AdminDashboard />
                      </ProtectedRoute>
                    }
                  >
                    <Route index element={<TeamsTable />} />
                    <Route
                      path="komandos"
                      element={
                        <ProtectedRoute>
                          <TeamsTable />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="zaidejai"
                      element={
                        <ProtectedRoute>
                          <PlayersTable />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="traumos"
                      element={
                        <ProtectedRoute>
                          <InjuriesTable />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="rungtynes"
                      element={
                        <ProtectedRoute>
                          <MatchesTable />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="turnyrai"
                      element={
                        <ProtectedRoute>
                          <TournamentsTable />
                        </ProtectedRoute>
                      }
                    />
                  </Route>
                )}
                <Route path="*" element={<PageNotFound />} />
              </Routes>
            </div>
          </main>
          <Footer />
        </>
      </UserContext.Provider>
    </>
  );
}

export default App;
