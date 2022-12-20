import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Fab,
  FormControl,
  InputLabel,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
  Select,
  MenuItem,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/system";
import { useState } from "react";
import "./styles.css";
import { useParams } from "react-router-dom";
import LinearProgress from "@mui/material/LinearProgress";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import { useContext } from "react";
import { UserContext } from "../../context/user-context";
// import { GetUserData } from "../../pages/auth";

export const MatchAddModal = ({ onCreate }) => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [teams, setTeams] = useState([]);
  const [homeTeamScore, setHomeTeamScore] = useState(0);
  const [awayTeamScore, setAwayTeamScore] = useState(0);
  const [homeTeam, setHomeTeam] = useState("");
  const [awayTeam, setAwayTeam] = useState("");
  const [date, setDate] = useState(null);

  const { turnyroId } = useParams();

  useEffect(() => {
    fetchTeams();
  }, []);

  useEffect(() => {
    console.log(date);
  }, [date]);

  const clearInputs = () => {
    setHomeTeamScore(0);
    setAwayTeamScore(0);
    setHomeTeam("");
    setAwayTeam("");
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const fetchTeams = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`https://localhost:7116/api/teams`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      const data = await response.json();
      setTeams(data);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  const createMatch = async () => {
    setIsLoading(true);
    const createdMatch = {
      homeTeamScore,
      awayTeamScore,
      firstTeamId: homeTeam,
      secondTeamId: awayTeam,
      matchDate: date,
    };
    console.log(createdMatch);
    try {
      const response = await fetch(`https://localhost:7116/api/tournaments/${turnyroId}/matches`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(createdMatch),
      });
      const data = await response.json();
      onCreate(data);
      setOpen(false);
      clearInputs();
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false);
  };

  if (isLoading) return <LinearProgress sx={{ width: "100%" }} />;
  console.log(teams);

  return (
    <>
      <Tooltip
        onClick={(e) => setOpen(true)}
        title="Pridėti Rungtynes"
        sx={{ position: "fixed", bottom: 20, left: { xs: "calc(50% - 25px)", md: 30 } }}
      >
        <Fab color="primary">
          <Add />
        </Fab>
      </Tooltip>
      <StyledModal
        open={open}
        onClose={(e) => {
          setOpen(false);
          setHomeTeamScore(0);
          setAwayTeamScore(0);
        }}
      >
        <Box
          width={380}
          height={430}
          bgcolor={"white"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
        >
          <Typography variant="h6" textAlign="center">
            Sukurti Rungtynes
          </Typography>
          <UserBox sx={{ marginTop: "15px" }}>
            <Avatar
              src="http://t2.gstatic.com/licensed-image?q=tbn:ANd9GcR3LLHu8cDaKNV42I04lWq2FZjq0cCIB3NI1AKo1pGZ_J1RkxeXOcWsl4vo6jKqRW99fSL6763ia6VAgWM"
              sx={{ width: 30, height: 30 }}
            />
            <Typography fontWeight={500} variant="span">
              {user.name}
            </Typography>
          </UserBox>
          <div className="inputs">
            <TextField
              sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}
              label="Namų Taškai"
              placeholder="Namai"
              value={homeTeamScore}
              InputLabelProps={{
                shrink: true,
              }}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              onChange={(e) => {
                const digitRegex = /^\d+$/;
                if (e.target.value === "" || digitRegex.test(e.target.value)) {
                  if (e.target.value <= 300) setHomeTeamScore(e.target.value);
                }
              }}
            />
            <TextField
              sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}
              label="Svečių Taškai"
              placeholder="Svečiai"
              value={awayTeamScore}
              InputProps={{ inputProps: { min: 0, max: 100 } }}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                const digitRegex = /^\d+$/;
                if (e.target.value === "" || digitRegex.test(e.target.value)) {
                  if (e.target.value <= 300) setAwayTeamScore(e.target.value);
                }
              }}
            />
            <FormControl fullWidth sx={{ flex: "1 0 34%", marginTop: "5px" }}>
              <InputLabel>Namai</InputLabel>
              <Select
                value={homeTeam}
                label="Namai"
                onChange={(e) => {
                  setHomeTeam(e.target.value);
                }}
              >
                {teams.map((team) => {
                  return (
                    <MenuItem value={team.id} key={team.id}>
                      {team.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
            <FormControl fullWidth sx={{ flex: "1 0 34%", marginTop: "5px" }}>
              <InputLabel>Svečiai</InputLabel>
              <Select
                value={awayTeam}
                label="Svečiai"
                onChange={(e) => setAwayTeam(e.target.value)}
              >
                {teams.map((team) => {
                  return (
                    <MenuItem value={team.id} key={team.id}>
                      {team.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <FormControl sx={{ width: "100%", marginTop: "20px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Rungtynių data"
                value={date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <ButtonGroup variant="contained" fullWidth sx={{ width: "100%", marginTop: "25px" }}>
            <Button
              disabled={
                homeTeamScore === "" ||
                awayTeamScore === "" ||
                homeTeam === "" ||
                awayTeam === "" ||
                date === null ||
                homeTeam === awayTeam
              }
              onClick={createMatch}
            >
              Sukurti
            </Button>
          </ButtonGroup>
        </Box>
      </StyledModal>
    </>
  );
};

const StyledModal = styled(Modal)({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
});

const UserBox = styled(Box)({
  display: "flex",
  gap: "10px",
  alignItems: "center",
  marginBottom: "20px",
});

// const { token, roles } = GetUserData();

// const createPost = async () => {
//   const createdPost = { Name: postName, Body: postBody };
//   console.log(token);
//   try {
//     const response = await fetch("https://vlogapidankaz.azurewebsites.net/api/posts", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: `Bearer ${token}`,
//       },
//       body: JSON.stringify(createdPost),
//     });
//     const data = await response.json();
//     console.log(data);
//     setOpen(false);
//   } catch (e) {
//     console.log(e);
//   }
// };
