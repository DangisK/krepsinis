import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles.css";

export const Player = ({ playerInfo, src, alt, onClick, teamId, teamName }) => {
  const navigateTo = useNavigate();

  const onPlayerClick = (playerId) => {
    navigateTo(`/komandos/${teamId}/zaidejas/${playerId}`);
  };
  // taking away played Id since we don't need to show it
  const playerWithoutId = (({ Id, ...o }) => o)(playerInfo);

  return (
    <article className="player" onClick={() => onPlayerClick(playerInfo.Id)}>
      <div className="img__container">
        <img src={src} alt={alt} />
      </div>
      <div className="player__info">
        <h2>{playerInfo.Name}</h2>
        <dl>
          {Object.entries(playerWithoutId).map((entry) => {
            const [key, value] = entry;
            if (key === "TeamName") return <React.Fragment key={key}></React.Fragment>;
            return (
              <React.Fragment key={key}>
                <dt>{key}</dt>
                <dd>{value}</dd>
              </React.Fragment>
            );
          })}
        </dl>
      </div>
    </article>
  );
};

const exampleResponseObject = {
  playerId: 1,
  name: "team1player",
  surname: "team1player",
  points: 0,
  assists: 0,
  rebounds: 0,
  totalGames: 0,
  teamId: 1,
  userId: null,
  user: null,
};
