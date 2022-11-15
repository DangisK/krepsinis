import React from "react";
import Typography from "@mui/material/Typography";
import "./styles.css";

export const Player = () => {
  return (
    <>
      <div className="content__header">
        <Typography variant="h2">Budget Klay Thompson</Typography>
      </div>
      <div className="selected_player">
        <div className="selected_player__details">
          <img
            src="https://img.bleacherreport.net/img/images/photos/003/702/864/1a5d4db530f5166f4528eed4481df168_crop_exact.jpg?w=798&h=531&q=75"
            alt="Selected player"
            id="thompson"
          />
          <div className="selected_player__averages">
            <div className="stats_values">
              <ul>
                <li>29</li>
                <li>8.3</li>
                <li>10.1</li>
              </ul>
            </div>
            <div className="stats">
              <ul>
                <li>PPG</li>
                <li>APG</li>
                <li>RPG</li>
              </ul>
            </div>
          </div>
        </div>
        <div className="player__info details selected_details">
          <dl className="player__info--stats">
            <dt>Pozicija</dt>
            <dd>Suolas</dd>
            <dt>Kilmė</dt>
            <dd>USA</dd>
            <dt>Gimimo data</dt>
            <dd>1986-05-10</dd>
            <dt>Ūgis</dt>
            <dd>205 cm</dd>
            <dt>Svoris</dt>
            <dd>130 kg</dd>
          </dl>
        </div>
      </div>
    </>
  );
};
