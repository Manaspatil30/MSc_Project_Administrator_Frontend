// IMPORTS
import Card from "@mui/material/Card";
import Typography from "@mui/material/Typography";
import { Grid } from "@mui/material";
import Avatar from "@mui/material/Avatar";
import PhotoCameraIcon from "@mui/icons-material/PhotoCamera";
import Badge from "@mui/material/Badge";
import Button from "@mui/material/Button";

// STYLES
const styles = {
  details: {
    padding: "1rem",
    borderTop: "1px solid #e1e1e1"
  },
  value: {
    padding: "1rem",
    borderTop: "1px solid #e1e1e1",
    color: "#899499"
  }
};

//APP
export default function ProfileCard(props) {
  return (
    <Card variant="outlined">
      <Grid
        container
        direction="column"
        justifyContent="center"
        alignItems="center"
      >
        {/* CARD HEADER START */}
        <Grid item sx={{ p: "1.5rem 0rem", textAlign: "center" }}>
          {/* PROFILE PHOTO */}
            <Avatar
              sx={{ width: 100, height: 100, mb: 1.5 }}
            ></Avatar>

          {/* DESCRIPTION */}
          <Typography variant="h6">{props.name}</Typography>
          <Typography color="text.secondary">{props.role}</Typography>
        </Grid>
        {/* CARD HEADER END */}

        {/* DETAILS */}
        <Grid container>
          <Grid item xs={3}>
            <Typography style={styles.details}>Supervisor </Typography>
            <Typography style={styles.details}>Project</Typography>
            <Typography style={styles.details}>Course</Typography>
          </Grid>
          {/* VALUES */}
          <Grid item xs={9} sx={{ textAlign: "end", overflow:'hidden' }}>
            <Typography style={styles.value}>Dr Shun ha Sylvia Wong</Typography>
            <Typography style={styles.value}>Msc Project Administrator</Typography>
            <Typography style={styles.value}>Msc Computer Science</Typography>
          </Grid>
        </Grid>

        {/* BUTTON */}
        {/* <Grid item style={styles.details} sx={{ width: "100%" }}>
          <Button
            variant="contained"
            color="secondary"
            sx={{ width: "99%", p: 1, my: 2 }}
          >
            View Public Profile
          </Button>
        </Grid> */}
      </Grid>
    </Card>
  );
}
