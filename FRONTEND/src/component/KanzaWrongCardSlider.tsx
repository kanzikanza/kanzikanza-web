import React, { useState } from "react";
import { Box, Button, Typography } from "@mui/material";

const CARD_BG = "#FFF8F0"; // 기존 톤과 맞는 색상

export default function KanzaWrongCardSlider({ data, limit = 3 }) {
  // data: Array<{ kanzaLetter, kanzaSound, kanzaMean }>
  const [index, setIndex] = useState(0);

  const handlePrev = () => setIndex((prev) => Math.max(prev - 1, 0));
  const handleNext = () => setIndex((prev) => Math.min(prev + 1, data.length - 1));

  return (
    <Box sx={{ width: "100%", maxWidth: 600, mx: "auto" }}>
      {/* <SwipeableViews
        index={index}
        onChangeIndex={setIndex}
        enableMouseEvents
        style={{ minHeight: 300 }}
      > */}
        {data.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              background: CARD_BG,
              border: "2px solid #DDA15E",
              borderRadius: "2rem",
              minHeight: 300,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: 3,
              mx: 2,
              p: 4,
            }}
          >
            <Typography variant="h2" sx={{ color: "#BC6C25", fontWeight: 700 }}>
              {item.kanzaLetter}
            </Typography>
            <Typography variant="h5" sx={{ mt: 2, color: "#BC6C25" }}>
              {item.kanzaSound}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1, color: "#333" }}>
              {item.kanzaMean}
            </Typography>
          </Box>
        ))}
      {/* </SwipeableViews> */}
      <Box sx={{ display: "flex", justifyContent: "center", mt: 2, gap: 2 }}>
        <Button onClick={handlePrev} disabled={index === 0} variant="contained" sx={{ background: "#FFCC99", color: "#333" }}>
          ←
        </Button>
        <Button onClick={handleNext} disabled={index === data.length - 1} variant="contained" sx={{ background: "#FFCC99", color: "#333" }}>
          →
        </Button>
      </Box>
      <Typography align="center" sx={{ mt: 1, color: "#BC6C25" }}>
        {index + 1} / {data.length}
      </Typography>
    </Box>
  );
} 