import React from "react";
import Typography from "@mui/material/Typography";
import "./styles.css";

export const Roster = () => {
  return (
    <>
      <div className="content__header">
        <Typography variant="h2">Komandos sudėtis</Typography>
      </div>
      <div className="team">
        <article className="player">
          <img
            src="https://www.biography.com/.image/ar_1:1%2Cc_fill%2Ccs_srgb%2Cfl_progressive%2Cq_auto:good%2Cw_1200/MTY2NzA3MjE1MzQyNzczNTQw/lebron-james-photo-by-streeter-lecka_getty-images.jpg"
            alt="Team player"
          />
          <div className="player__info">
            <h2>LeBron James</h2>
            <dl className="player__info--stats">
              <dt>Pozicija</dt>
              <dd>Puolėjas</dd>
              <dt>Kilmė</dt>
              <dd>Lietuva</dd>
              <dt>Gimimo data</dt>
              <dd>1971-04-22</dd>
              <dt>Ūgis</dt>
              <dd>210 cm</dd>
              <dt>Svoris</dt>
              <dd>103 kg</dd>
            </dl>
          </div>
        </article>
        <article className="player">
          <img
            src="https://imageio.forbes.com/specials-images/imageserve/627bdaec36beab21cd23ad21/0x0.jpg?format=jpg&crop=1003,1002,x921,y73,safe&height=416&width=416&fit=bounds"
            alt="Team player"
          />
          <div className="player__info">
            <h2>Stephen Curry</h2>
            <dl>
              <dt>Pozicija</dt>
              <dd>Centras</dd>
              <dt>Kilmė</dt>
              <dd>Latvija</dd>
              <dt>Gimimo data</dt>
              <dd>1999-09-06</dd>
              <dt>Ūgis</dt>
              <dd>187 cm</dd>
              <dt>Svoris</dt>
              <dd>80 kg</dd>
            </dl>
          </div>
        </article>
        <article className="player">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/d/dd/Robertas_Javtokas_by_Augustas_Didzgalvis.jpg"
            alt="Team player"
          />
          <div className="player__info">
            <h2>Robertas Javtokas</h2>
            <dl>
              <dt>Pozicija</dt>
              <dd>Centras</dd>
              <dt>Kilmė</dt>
              <dd>Lietuva</dd>
              <dt>Gimimo data</dt>
              <dd>1980-03-20</dd>
              <dt>Ūgis</dt>
              <dd>211 cm</dd>
              <dt>Svoris</dt>
              <dd>122 kg</dd>
            </dl>
          </div>
        </article>
        <article className="player">
          <img
            src="https://img.bleacherreport.net/img/images/photos/003/702/864/1a5d4db530f5166f4528eed4481df168_crop_exact.jpg?w=798&h=531&q=75"
            alt="Team player"
          />
          <div className="player__info">
            <h2>Budget Klay Thompson</h2>
            <dl>
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
        </article>
      </div>
    </>
  );
};
