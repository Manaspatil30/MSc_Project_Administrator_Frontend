"use client"
import {
  AppBar,
  Box,
  CssBaseline,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Toolbar,
  Typography,
} from "@mui/material";
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';
import Cookies from "js-cookie";
import { useState } from "react";

const drawerWidth = 200;

const list = [
  {
    title : "Dashboard",
    href : "/dashboard"
  },
  {
    title : "Projects",
    href : "/projects"
  },
  {
    title : "Sessions",
    href : "/session"
  },
  {
    title : "Feedback",
    href : "/feedback"
  },
  

]

const SideNavbar = ({children}) => {
  const [isSupervisor, setIsSupervisor] = useState(Cookies.get('user_role'));
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: "auto" }}>
          <List>
            {list.map((text, index) => (
              <ListItem key={text.title} disablePadding>
                <ListItemButton href={text.href}>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text.title} />
                </ListItemButton>
              </ListItem>
            ))}
            {/* {isSupervisor == 'ACADEMIC' && 
            <ListItem disablePadding>
              <ListItemButton href="/addproject">
                <ListItemIcon>
                  <InboxIcon/>
                </ListItemIcon>
                <ListItemText primary={'Add project'} />
              </ListItemButton>
            </ListItem>
            } */}
          </List>
          {/* <Divider />
          <List>
            {["All mail", "Trash", "Spam"].map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                  </ListItemIcon>
                  <ListItemText primary={text} />
                </ListItemButton>
              </ListItem>
            ))}
          </List> */}
        </Box>
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        {children}
      </Box>
    </Box>
  );
};

export default SideNavbar;
