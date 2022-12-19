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
import FormControl from "@mui/material/FormControl/FormControl";
import "./styles.css";
import { isStartDateEarlier } from "../utils";
import { useContext } from "react";
import { UserContext } from "../../context/user-context";
// import { GetUserData } from "../../pages/auth";

export const TournamentAddModal = ({ onCreate }) => {
  const { user } = useContext(UserContext);
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);

  const handleStartChange = (newValue) => {
    setStartDate(newValue);
  };

  const handleEndChange = (newValue) => {
    setEndDate(newValue);
  };

  const clearInputs = () => {
    setTournamentName("");
    setStartDate(null);
    setEndDate(null);
  };

  const createTournament = async () => {
    setIsLoading(true);
    const createdTournament = { name: tournamentName, startDate, endDate };
    try {
      const response = await fetch("https://localhost:7116/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(createdTournament),
      });
      const data = await response.json();
      console.log(data);
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
        title="Pridėti Turnyrą"
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
          width={440}
          height={330}
          bgcolor={"white"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
        >
          <Typography variant="h6" textAlign="center">
            Sukurti Turnyrą
          </Typography>
          <UserBox sx={{ marginTop: "15px" }}>
            <Avatar
              src="http://t2.gstatic.com/licensed-image?q=tbn:ANd9GcR3LLHu8cDaKNV42I04lWq2FZjq0cCIB3NI1AKo1pGZ_J1RkxeXOcWsl4vo6jKqRW99fSL6763ia6VAgWM"
              sx={{ width: 30, height: 30 }}
            />
            <Typography fontWeight={500} variant="span">
              Dangis
            </Typography>
          </UserBox>
          <TextField
            sx={{ width: "100%" }}
            label="Turnyro Pavadinimas"
            multiline
            maxRows={1}
            value={tournamentName}
            placeholder="Pavadinimas"
            onChange={(e) => {
              setTournamentName(e.target.value);
            }}
          />
          <div className="dates">
            <FormControl sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Pradžia"
                  value={startDate}
                  onChange={handleStartChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
            <FormControl sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}>
              <LocalizationProvider dateAdapter={AdapterDayjs}>
                <DateTimePicker
                  label="Pabaiga"
                  value={endDate}
                  onChange={handleEndChange}
                  renderInput={(params) => <TextField {...params} />}
                />
              </LocalizationProvider>
            </FormControl>
          </div>
          <ButtonGroup variant="contained" fullWidth sx={{ width: "100%", marginTop: "20px" }}>
            <Button
              disabled={isLoading || !isStartDateEarlier(startDate, endDate)}
              onClick={createTournament}
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
