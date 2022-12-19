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

export const InjuryAddModal = ({ onCreate, close, player }) => {
  const { user } = useContext(UserContext);
  const [name, setName] = useState("");
  const [date, setDate] = useState(null);

  const clearInputs = () => {
    setName("");
    setDate(null);
  };

  const handleDateChange = (newValue) => {
    setDate(newValue);
  };

  const createInjury = async () => {
    const createdInjury = {
      name,
      injuryDate: date,
    };
    console.log(createdInjury);
    try {
      const response = await fetch(`https://localhost:7116/api/players/${player.id}/injuries`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(createdInjury),
      });
      const data = await response.json();
      onCreate(data);
      close();
      clearInputs();
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <>
      <StyledModal open={true} onClose={close}>
        <Box
          width={430}
          height={360}
          bgcolor={"white"}
          color={"text.primary"}
          p={3}
          borderRadius={5}
        >
          <Typography variant="h6" textAlign="center">
            Įtraukti Traumą
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
            sx={{ width: "100%", marginTop: "15px", flex: "1 0 34%" }}
            label="Traumos Pavadinimas"
            placeholder="Trauma"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
            }}
          />
          <FormControl sx={{ width: "100%", marginTop: "20px" }}>
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DateTimePicker
                label="Data"
                value={date}
                onChange={handleDateChange}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <ButtonGroup variant="contained" fullWidth sx={{ width: "100%", marginTop: "25px" }}>
            <Button disabled={date === null || name === ""} onClick={createInjury}>
              Įtraukti
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
