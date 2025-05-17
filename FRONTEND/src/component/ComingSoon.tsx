import { Paper, Typography } from "@mui/material";
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';

export default function ComingSoon() {
  return (
    <Paper elevation={0} sx={{
      background: 'none',
      boxShadow: 'none',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      p: 0,
      mt: 1
    }}>
      <HourglassEmptyIcon sx={{ fontSize: 40, color: '#BC6C25', mb: 1 }} />
      <Typography variant="body1" sx={{ color: '#BC6C25', fontWeight: 600 }}>
        추후 공개됩니다
      </Typography>
    </Paper>
  );
} 