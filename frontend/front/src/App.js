import "./App.css";
import React, { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Home } from "./home";
import { Routes, Route, useNavigate } from "react-router-dom";
import { Standings } from "./standings";
import { Schedule } from "./schedule";
import { Roster } from "./roster";
import { Player } from "./player";
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

function App() {
  const [user, setUser] = useState({ token: "", roles: "" });
  const isUserLoggedIn = user.token !== "";
  const navigateTo = useNavigate();

  useEffect(() => {
    if (isUserLoggedIn) {
      navigateTo("/");
    } else {
      navigateTo("/auth");
    }
  }, [isUserLoggedIn]);

  return (
    <>
      <AppContext.Provider value={{ user, setUser }}>
        {!isUserLoggedIn ? (
          <Routes>
            <Route path="/auth" element={<Auth />} />
          </Routes>
        ) : (
          <>
            <Navbar />
            <main>
              <div className="container">
                <Routes>
                  <Route index element={<Home />} />
                  <Route path="/turnyrine-lentele" element={<Standings />} />
                  <Route path="/tvarkarastis" element={<Schedule />} />
                  <Route path="/komandos-sudetis" element={<Roster />} />
                  <Route path="/zaidejas" element={<Player />} />
                  {user.roles.find((role) => role === "Admin") && (
                    <Route path="/db-lenteles" element={<AdminDashboard />}>
                      <Route index element={<TeamsTable />} />
                      <Route path="komandos" element={<TeamsTable />} />
                      <Route path="zaidejai" element={<PlayersTable />} />
                      <Route path="traumos" element={<InjuriesTable />} />
                      <Route path="rungtynes" element={<MatchesTable />} />
                      <Route path="turnyrai" element={<TournamentsTable />} />
                    </Route>
                  )}
                </Routes>
              </div>
            </main>
            <Footer />
          </>
        )}
      </AppContext.Provider>
    </>
  );
}

export default App;
