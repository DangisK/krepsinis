import React, { useEffect } from "react";
import {
  Avatar,
  Button,
  ButtonGroup,
  Fab,
  Modal,
  styled,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Box } from "@mui/system";
import { useState } from "react";
import { DateTimePicker } from "@mui/x-date-pickers";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs, { Dayjs } from "dayjs";
import FormControl from "@mui/material/FormControl";
import { useContext } from "react";
import { UserContext } from "../../context/user-context";
// import { GetUserData } from "../../pages/auth";

export const PlayerAddModal = ({ onCreate, teamId }) => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [surname, setSurname] = useState("");
  const [points, setPoints] = useState(0);
  const [assists, setAssists] = useState(0);
  const [rebounds, setRebounds] = useState(0);
  const [totalGames, setTotalGames] = useState(0);

  const clearInputs = () => {
    setName("");
    setSurname("");
    setPoints(0);
    setAssists(0);
    setRebounds(0);
    setTotalGames(0);
  };

  const createPlayer = async () => {
    setIsLoading(true);
    const createdPlayer = { name, surname, points, assists, rebounds, totalGames };
    try {
      const response = await fetch(`https://localhost:7116/api/teams/${teamId}/players`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(createdPlayer),
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

  return (
    <>
      <Tooltip
        onClick={(e) => setOpen(true)}
        title="Prid??ti ??aid??j??"
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
          clearInputs();
        }}
      >
        <Box
          width={460}
          height={430}
          bgcolor={"white"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
        >
          <Typography variant="h6" textAlign="center">
            Sukurti ??aid??j??
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
              label="Vardas"
              placeholder="Vardas"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
              }}
            />
            <TextField
              sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}
              label="Pavard??"
              placeholder="Pavard??"
              value={surname}
              onChange={(e) => {
                setSurname(e.target.value);
              }}
            />
            <TextField
              sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}
              label="Ta??kai"
              placeholder="Ta??kai"
              value={points}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                const digitRegex = /^\d+$/;
                if (e.target.value === "" || digitRegex.test(e.target.value)) {
                  if (e.target.value <= 100000) setPoints(e.target.value);
                }
              }}
            />
            <TextField
              sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}
              label="Rez. Perdavimai"
              placeholder="Perdavimai"
              value={assists}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                const digitRegex = /^\d+$/;
                if (e.target.value === "" || digitRegex.test(e.target.value)) {
                  if (e.target.value <= 100000) setAssists(e.target.value);
                }
              }}
            />
            <TextField
              sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}
              label="Atkovota K."
              placeholder="Atkovota"
              value={rebounds}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                const digitRegex = /^\d+$/;
                if (e.target.value === "" || digitRegex.test(e.target.value)) {
                  if (e.target.value <= 100000) setRebounds(e.target.value);
                }
              }}
            />
            <TextField
              sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}
              label="??aid?? Rungtyni??"
              placeholder="Rungtyn??s"
              value={totalGames}
              InputLabelProps={{
                shrink: true,
              }}
              onChange={(e) => {
                const digitRegex = /^\d+$/;
                if (e.target.value === "" || digitRegex.test(e.target.value)) {
                  if (e.target.value <= 10000) setTotalGames(e.target.value);
                }
              }}
            />
          </div>
          <ButtonGroup variant="contained" fullWidth sx={{ width: "100%", marginTop: "20px" }}>
            <Button disabled={name === "" || surname === ""} onClick={createPlayer}>
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
