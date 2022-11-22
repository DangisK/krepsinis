import React from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { Button, ButtonGroup, Typography } from "@mui/material";
import "./index.css";

export const AdminDashboard = () => {
  const navigateTo = useNavigate();
  const navigateToAdminPage = (page) => navigateTo(`/db-lenteles/${page}`);

  return (
    <>
      <div className="content__header">
        <Typography variant="h2">Admin Dashboard</Typography>
      </div>
      <div className="admin__buttons">
        <ButtonGroup variant="contained">
          <Button onClick={() => navigateToAdminPage("komandos")}>Komandos</Button>
          <Button onClick={() => navigateToAdminPage("zaidejai")}>Žaidėjai</Button>
          <Button onClick={() => navigateToAdminPage("traumos")}>Traumos</Button>
          <Button onClick={() => navigateToAdminPage("rungtynes")}>Rungtynės</Button>
          <Button onClick={() => navigateToAdminPage("turnyrai")}>Turnyrai</Button>
        </ButtonGroup>
      </div>
      <Outlet />
    </>
  );
};
