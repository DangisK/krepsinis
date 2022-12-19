import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import "./styles.css";

export const Schedule = () => {
  return (
    <div className="schedule">
      <div className="content__header">
        <Typography variant="h2">Tvarkaraštis</Typography>
      </div>
      <div className="table_container">
        <table className="standings">
          <thead className="standings__header">
            <tr className="standings__header_row">
              <th className="header_row__item">Data</th>
              <th className="header_row__item">Namų komanda</th>
              <th className="header_row__item">Laikas</th>
              <th className="header_row__item">Svečių komanda</th>
              <th className="header_row__item">Vieta</th>
            </tr>
          </thead>
          <tbody className="standings__body">
            <tr>
              <td className="body_data__item">2022-10-25, Antradienis</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/BC_%C5%BDalgiris_logo.svg/800px-BC_%C5%BDalgiris_logo.svg.png"
                    alt="Zalgiris"
                  />
                  Žalgiris
                </div>
              </td>
              <td className="body_data__item">17:00</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/lt/3/35/Jonavos_CBetlg.png"
                    alt="CBet"
                  />
                  CBet
                </div>
              </td>
              <td className="body_data__item">Žalgirio arena</td>
            </tr>
            <tr>
              <td className="body_data__item">2022-10-26, Trečiadienis</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/lt/3/35/Jonavos_CBetlg.png"
                    alt="CBet"
                  />
                  CBet
                </div>
              </td>
              <td className="body_data__item">18:30</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/BC_Rytas_logo.svg/1200px-BC_Rytas_logo.svg.png"
                    alt="Rytas"
                  />
                  Rytas
                </div>
              </td>
              <td className="body_data__item">Pieno žvaigždžių arena</td>
            </tr>
            <tr>
              <td className="body_data__item">2022-10-27, Ketvirtadienis</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/BC_Rytas_logo.svg/1200px-BC_Rytas_logo.svg.png"
                    alt="Rytas"
                  />
                  Rytas
                </div>
              </td>
              <td className="body_data__item">18:00</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/BC_%C5%BDalgiris_logo.svg/800px-BC_%C5%BDalgiris_logo.svg.png"
                    alt="Zalgiris"
                  />
                  Žalgiris
                </div>
              </td>
              <td className="body_data__item">Jeep arena</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
