import React from "react";
import Typography from "@mui/material/Typography";
import "./styles.css";

export const Standings = () => {
  return (
    <>
      <div className="content__header">
        <Typography variant="h2">Turnyrinė lentelė</Typography>
      </div>
      <div className="table_container">
        <table className="standings">
          <thead className="standings__header">
            <tr className="standings__header_row">
              <th className="header_row__item">Vieta</th>
              <th className="header_row__item">Komanda</th>
              <th className="header_row__item">Viso</th>
              <th className="header_row__item">Perg.</th>
              <th className="header_row__item">Pral.</th>
              <th className="header_row__item">Tašk. vid.</th>
            </tr>
          </thead>
          <tbody className="standings__body">
            <tr>
              <td className="body_data__item gold">1</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/0/0e/BC_%C5%BDalgiris_logo.svg/800px-BC_%C5%BDalgiris_logo.svg.png"
                    alt="Zalgiris"
                  />
                  Žalgiris
                </div>
              </td>
              <td className="body_data__item">95</td>
              <td className="body_data__item win">95</td>
              <td className="body_data__item loss">0</td>
              <td className="body_data__item">
                <span className="win">85.7</span> / <span className="loss">60.6</span>
              </td>
            </tr>
            <tr>
              <td className="body_data__item silver">2</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/lt/3/35/Jonavos_CBetlg.png"
                    alt="CBet"
                  />
                  CBet
                </div>
              </td>
              <td className="body_data__item">94</td>
              <td className="body_data__item win">68</td>
              <td className="body_data__item loss">26</td>
              <td className="body_data__item">
                <span className="win">81</span> / <span className="loss">72.9</span>
              </td>
            </tr>
            <tr>
              <td className="body_data__item bronze">3</td>
              <td className="body_data__item">
                <div className="team_info">
                  <img
                    src="https://upload.wikimedia.org/wikipedia/en/thumb/8/8a/BC_Rytas_logo.svg/1200px-BC_Rytas_logo.svg.png"
                    alt="Rytas"
                  />
                  Rytas
                </div>
              </td>
              <td className="body_data__item">95</td>
              <td className="body_data__item win">37</td>
              <td className="body_data__item loss">58</td>
              <td className="body_data__item">
                <span className="win">74.1</span> / <span className="loss">82</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </>
  );
};
