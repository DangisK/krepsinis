import "./App.css";
import React, { useEffect, useState } from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Home } from "./home";
import { Routes, Route, useNavigate } from "react-router-dom";
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

function App() {
  const [user, setUser] = useState({ token: "kazkas", roles: ["Admin"] });
  const isUserLoggedIn = user.token !== "";
  const navigateTo = useNavigate();

  // useEffect(() => {
  //   if (isUserLoggedIn) {
  //     navigateTo("/komandos");
  //   } else {
  //     navigateTo("/auth");
  //   }
  // }, [isUserLoggedIn]);

  return (
    <>
      <AppContext.Provider value={{ user, setUser }}>
        {!isUserLoggedIn ? (
          <Routes>
            <Route path="/auth" element={<Auth />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        ) : (
          <>
            <Navbar />
            <main>
              <div className="container">
                <Routes>
                  <Route index exact path="/" element={<Home />} />
                  <Route path="/turnyrine-lentele" element={<Standings />} />
                  <Route path="/tvarkarastis" element={<Schedule />} />
                  <Route path="/turnyrai" element={<Tournament />} />
                  <Route path="/turnyrai/:turnyroId" element={<Match />} />
                  <Route path="/komandos/:komandosId" element={<Roster />} />
                  <Route
                    path="/komandos/:komandosId/zaidejas/:zaidejoId"
                    element={<SelectedPlayer />}
                  />
                  <Route path="/komandos" element={<Team />} />
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
                  <Route path="*" element={<PageNotFound />} />
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
