// IMPORTS
import React, { useState } from "react";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import InputAdornment from "@mui/material/InputAdornment";
import MenuItem from "@mui/material/MenuItem";
import IconButton from "@mui/material/IconButton";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import Visibility from "@mui/icons-material/Visibility";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import { Grid, TextField } from "@mui/material";
import FormControl from "@mui/material/FormControl";
import Button from "@mui/material/Button";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import CustomInput from "./CustomInput";


export default function SettingsCard(props) {
 
  const [disabled, setDisabled] = useState(true)

  return (
    <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
        <form>
            <CardContent sx={{
            p: 3,
            maxHeight: { md: "40vh" },
            textAlign: { xs: "center", md: "start" }
          }}>
            <Grid container direction={{ xs: "column", md: "row" }}
              columnSpacing={5}
              rowSpacing={3}>
                <Grid item xs={6}>
                <label style={{ fontWeight: "bold" }}>First Name</label>
                    <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    name="First Name"
                    disabled = {disabled}
                    defaultValue={props.firstName}
                    />
                </Grid>
                <Grid item xs={6}>
                <label style={{ fontWeight: "bold" }}>Last Name</label>
                    <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    name="First Name"
                    disabled = {disabled}
                    defaultValue={props.lastName}
                    />
                </Grid>
                <Grid item xs={6}>
                <label style={{ fontWeight: "bold" }}>Email</label>
                    <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    name="First Name"
                    disabled = {disabled}
                    defaultValue={props.email}
                    />
                </Grid>
                <Grid item xs={6}>
                <label style={{ fontWeight: "bold" }}>Phone number</label>
                    <TextField
                    fullWidth
                    margin="dense"
                    size="small"
                    name="First Name"
                    disabled = {disabled}
                    />
                </Grid>
                <Grid
                container
                justifyContent={{ xs: "flex-end", md: "flex-end" }}
                item
                xs={6}
              >
                {
                    disabled ? 
                <Button
                  sx={{ p: "1rem 2rem", my: 2, height: "3rem" }}
                  component="button"
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={()=>setDisabled(!disabled)}
                >
                  Edit
                </Button>
                :
                <Button
                  sx={{ p: "1rem 2rem", my: 2, height: "3rem" }}
                  component="button"
                  size="large"
                  variant="contained"
                  color="secondary"
                  onClick={()=>setDisabled(!disabled)}
                >
                  Update
                </Button>
                }
              </Grid>
            </Grid>
            </CardContent>
        </form>
    </Card>
    // <Card variant="outlined" sx={{ height: "100%", width: "100%" }}>
    //     <form>
    //   {/* TABS */}
    //   <br></br>
    //   <Tabs
    //     value={value}
    //     onChange={handleChange}
    //     textColor="secondary"
    //     indicatorColor="secondary"
    //   >
    //     <Tab label="Account" {...a11yProps(0)}/>
    //     <Tab label="Tab 2" {...a11yProps(1)}/>
    //     <Tab label="Tab 3" {...a11yProps(2)}/>
    //   </Tabs>
    //   <Divider></Divider>

    //   <CustomTabPanel value={value} index={0}>
    //   {/* MAIN CONTENT CONTAINER */}
    //     <CardContent
    //       sx={{
    //         p: 3,
    //         maxHeight: { md: "40vh" },
    //         textAlign: { xs: "center", md: "start" }
    //       }}
    //     >
    //       {/* FIELDS */}
    //       <FormControl fullWidth>
    //         <Grid
    //           container
    //           direction={{ xs: "column", md: "row" }}
    //           columnSpacing={5}
    //           rowSpacing={3}
    //         >
    //           {/* ROW 1: FIRST NAME */}
    //           <Grid item xs={6}>
    //             <CustomInput
    //               id="firstName"
    //               name="firstName"
    //               value={user.firstName}
    //               onChange={changeField}
    //               title="First Name"
    //               dis={disabled}
    //             ></CustomInput>
    //           </Grid>

    //           {/* ROW 1: LAST NAME */}
    //           <Grid item xs={6}>
    //             <CustomInput
    //               id="lastName"
    //               name="lastName"
    //               value={user.lastName}
    //               onChange={changeField}
    //               title="Last Name"
    //               dis={disabled}
    //             ></CustomInput>
    //           </Grid>

    //           {/* ROW 2: MIDDLE NAME */}
    //           <Grid item xs={6}>
    //             <CustomInput
    //               id="midName"
    //               name="midName"
    //               value={user.midName}
    //               onChange={changeField}
    //               title="Middle Name"
    //               dis={disabled}
    //             ></CustomInput>
    //           </Grid>

    //           {/* ROW 2: GENDER */}
    //           <Grid item xs={6}>
    //             <CustomInput
    //               select
    //               id="gender"
    //               name="gender"
    //               value={user.gender}
    //               onChange={changeField}
    //               title="Gender"
    //               dis={disabled}
    //               //MAP THRU OPTIONS
    //               content={genderSelect.map((option) => (
    //                 <MenuItem value={option.value}>{option.label}</MenuItem>
    //               ))}
    //             ></CustomInput>
    //           </Grid>

    //           {/* ROW 3: PHONE */}
    //           <Grid item xs={6}>
    //             <CustomInput
    //               id="phone"
    //               name="phone"
    //               value={user.phone}
    //               onChange={changeField}
    //               title="Phone Number"
    //               dis={disabled}
    //               //DIALING CODE
    //               InputProps={{
    //                 startAdornment: (
    //                   <InputAdornment position="start">63+</InputAdornment>
    //                 )
    //               }}
    //             ></CustomInput>
    //           </Grid>

    //           {/* ROW 3: EMAIL */}
    //           <Grid item xs={6}>
    //             <CustomInput
    //               type="email"
    //               id="email"
    //               name="email"
    //               value={user.email}
    //               onChange={changeField}
    //               title="Email Address"
    //               dis={disabled}
    //             ></CustomInput>
    //           </Grid>

    //           {/* ROW 4: PASSWORD */}
    //           <Grid item xs={6}>
    //             <CustomInput
    //               id="pass"
    //               name="pass"
    //               value={user.pass}
    //               onChange={changeField}
    //               title="Password"
    //               dis={disabled}
    //               type={user.showPassword ? "text" : "password"}
    //               // PASSWORD ICON
    //               InputProps={{
    //                 endAdornment: (
    //                   <InputAdornment position="end">
    //                     <IconButton
    //                       onClick={handlePassword}
    //                       edge="end"
    //                       disabled={disabled}
    //                     >
    //                       {user.showPassword ? (
    //                         <VisibilityOff />
    //                       ) : (
    //                         <Visibility />
    //                       )}
    //                     </IconButton>
    //                   </InputAdornment>
    //                 )
    //               }}
    //             ></CustomInput>
    //           </Grid>

    //           {/* BUTTON */}
    //           <Grid
    //             container
    //             justifyContent={{ xs: "center", md: "flex-end" }}
    //             item
    //             xs={6}
    //           >
    //             {
    //                 disabled ?
    //             <Button
    //               sx={{ p: "1rem 2rem", my: 2, height: "3rem" }}
    //               component="button"
    //               size="large"
    //               variant="contained"
    //               color="secondary"
    //               onClick={() => setDisabled(!disabled)}
    //             >
    //               Edit
    //             </Button>
    //             :
    //             <Button
    //               sx={{ p: "1rem 2rem", my: 2, height: "3rem" }}
    //               component="button"
    //               size="large"
    //               variant="contained"
    //               color="secondary"
    //               onClick={() => setDisabled(!disabled)}
    //             >
    //               Update
    //             </Button>
    //             }
    //           </Grid>
    //         </Grid>
    //       </FormControl>
    //     </CardContent>
    //   </CustomTabPanel>
    //   </form>
    // </Card>
  );
}
