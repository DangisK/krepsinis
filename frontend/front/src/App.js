import "./App.css";
import React from "react";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { Home } from "./home";
import { Routes, Route } from "react-router-dom";
import { Standings } from "./standings";
import { Schedule } from "./schedule/schedule";
import { Roster } from "./roster/roster";
import { Player } from "./player/player";
import {
  AdminDashboard,
  InjuriesTable,
  MatchesTable,
  PlayersTable,
  TeamsTable,
  TeamTournamentsTable,
  TournamentsTable,
} from "./admin";

function App() {
  return (
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
            <Route path="/db-lenteles" element={<AdminDashboard />}>
              <Route index element={<TeamsTable />} />
              <Route path="komandos" element={<TeamsTable />} />
              <Route path="zaidejai" element={<PlayersTable />} />
              <Route path="traumos" element={<InjuriesTable />} />
              <Route path="rungtynes" element={<MatchesTable />} />
              <Route path="turnyrai" element={<TournamentsTable />} />
              <Route path="turnyru-komandos" element={<TeamTournamentsTable />} />
            </Route>
          </Routes>
        </div>
      </main>
      <Footer />
    </>
  );
}

export default App;
