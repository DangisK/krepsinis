import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import "./styles.css";
import { Player } from "../player";
import { LinearProgress } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";

export const Roster = () => {
  const { komandosId } = useParams();
  const navigateTo = useNavigate();

  const [team, setTeam] = useState(null);
  const [players, setPlayers] = useState([]);
  const [images, setImages] = useState([]);
  const [isFetching, setIsFetching] = useState(true);

  useEffect(() => {
    setImages(mockData);
    // fetchImages();
    fetchPlayers();
    fetchTeam();
  }, []);

  const fetchImages = async () => {
    setIsFetching(true);
    const response = await fetch(
      "https://api.unsplash.com/search/photos?query=basketball&client_id=dE2uZwZjrsYoLBH1GDqaNNd5ku4W7KJo4VyNTX4OROY"
    );
    const data = await response.json();
    console.log(data.results);
    const photos = data.results.map((img) => ({ src: img.urls.small, alt: img.alt_description }));
    setImages(photos);
    setIsFetching(false);
  };

  const fetchPlayers = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`https://localhost:7116/api/teams/${komandosId}/players`);
      const data = await response.json();
      if (data.status === 404) {
        navigateTo("/komandos");
        return;
      }
      const mappedData = data.map((player) => ({
        Id: player.playerId,
        Name: player.name,
        Surname: player.surname,
        Points: player.points,
        Assists: player.assists,
        Rebounds: player.rebounds,
        GamesPlayed: player.totalGames,
        TeamName: player.team.name,
      }));
      setPlayers(mappedData);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  const fetchTeam = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`https://localhost:7116/api/teams/${komandosId}`);
      const data = await response.json();
      console.log(data);
      if (data.status === 404) {
        navigateTo("/komandos");
        return;
      }
      setTeam(data);
      setIsFetching(false);
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      {isFetching || team === null ? (
        <LinearProgress sx={{ width: "100%" }} />
      ) : (
        <>
          <div className="content__header">
            <Typography variant="h2">{team.name} komandos sudėtis</Typography>
          </div>
          <div className="team">
            {players.map((player, id) => {
              return (
                <Player
                  playerInfo={player}
                  src={images[id]["src"]}
                  alt={images[id]["alt"]}
                  key={id}
                  teamId={komandosId}
                  teamName={player.TeamName}
                />
              );
            })}
          </div>
        </>
      )}
    </>
  );
};

// const exampleResponseObject = {
//   playerId: 1,
//   name: "team1player",
//   surname: "team1player",
//   points: 0,
//   assists: 0,
//   rebounds: 0,
//   totalGames: 0,
//   teamId: 1,
//   userId: null,
//   user: null,
// };

const mockData = [
  {
    src: "https://images.unsplash.com/photo-1546519638-68e109498ffc?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHwxfHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "ball under basketball ring",
  },
  {
    src: "https://images.unsplash.com/photo-1515523110800-9415d13b84a8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHwyfHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "basketball on ring",
  },
  {
    src: "https://images.unsplash.com/photo-1574623452334-1e0ac2b3ccb4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHwzfHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "brown Spalding basketball lot",
  },
  {
    src: "https://images.unsplash.com/photo-1627627256672-027a4613d028?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHw0fHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "brown and black basketball ball",
  },
  {
    src: "https://images.unsplash.com/photo-1608245449230-4ac19066d2d0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHw1fHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "2 boys playing basketball on basketball court",
  },
  {
    src: "https://images.unsplash.com/photo-1590227632180-80a3bf110871?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHw2fHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "person walking on basketball court",
  },
  {
    src: "https://images.unsplash.com/photo-1519861531473-9200262188bf?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHw3fHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "Spalding basketball in court",
  },
  {
    src: "https://images.unsplash.com/photo-1577471488278-16eec37ffcc2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHw4fHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "people playing basketball inside court",
  },
  {
    src: "https://images.unsplash.com/photo-1542652694-40abf526446e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHw5fHxiYXNrZXRiYWxsfGVufDB8fHx8MTY2OTQwMDY1NQ&ixlib=rb-4.0.3&q=80&w=400",
    alt: "basketball ball photography",
  },
  {
    src: "https://images.unsplash.com/photo-1518063319789-7217e6706b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwzODM2Njl8MHwxfHNlYXJjaHwxMHx8YmFza2V0YmFsbHxlbnwwfHx8fDE2Njk0MDA2NTU&ixlib=rb-4.0.3&q=80&w=400",
    alt: "low angle photography of basketball hoop",
  },
];
