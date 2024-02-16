import { Box, BoxProps } from "@mui/material"; 
import { useChronometer } from "../../hooks/time";
import { FC } from "react";

export const Chronometer: FC<{ inputDate: string }> = ({ inputDate }: any) => {
 
  const timeArray = useChronometer(inputDate);

  const Item = (props: BoxProps) => {
    const { sx, ...other } = props;
    return (
      <Box  
        sx={{
          bgcolor: (theme) =>
            theme.palette.mode === "dark" ? "#101010" : "grey.100",
          color: (theme) =>
            theme.palette.mode === "dark" ? "grey.300" : "grey.800",
          border: "1px solid",
          borderColor: (theme) =>
            theme.palette.mode === "dark" ? "grey.800" : "grey.300",
          borderRadius: 2,
          fontSize: "0.875rem",
          fontWeight: "700",
          ...sx,
        }}
        {...other}
      />
    );
  };

  return (
    <Box
      sx={{
        display: "flex", 
        borderRadius: 1,
      }} 
    >
      <Item>{timeArray[0]}:</Item>
      <Item>{timeArray[1]}:</Item>
      <Item>{timeArray[2]}</Item>
    </Box>
  );
};
