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
// import { GetUserData } from "../../pages/auth";

export const TournamentAddModal = ({ onCreate }) => {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [tournamentName, setTournamentName] = useState("");
  const [tournamentDurationMonths, setTournamentDurationMonths] = useState(1);

  const createTournament = async () => {
    setIsLoading(true);
    const createdTournament = { name: tournamentName, monthsDuration: tournamentDurationMonths };
    try {
      const response = await fetch("https://localhost:7116/api/tournaments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(createdTournament),
      });
      const data = await response.json();
      onCreate(data);
      setOpen(false);
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
          setTournamentName("");
          setTournamentDurationMonths(1);
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
          <TextField
            sx={{ width: "100%", marginTop: "15px" }}
            label="Trukmė (mėnesiai)"
            placeholder="Mėnesiai"
            value={tournamentDurationMonths}
            InputLabelProps={{
              shrink: true,
            }}
            InputProps={{ inputProps: { min: 0, max: 100 } }}
            onChange={(e) => {
              const digitRegex = /^\d+$/;
              if (e.target.value === "" || digitRegex.test(e.target.value)) {
                if (e.target.value <= 100) setTournamentDurationMonths(e.target.value);
              }
            }}
          />
          <ButtonGroup variant="contained" fullWidth sx={{ width: "100%", marginTop: "15px" }}>
            <Button disabled={isLoading} onClick={createTournament}>
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
