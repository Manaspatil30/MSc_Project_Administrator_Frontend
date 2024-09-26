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
import { useEffect, useState } from "react";

const drawerWidth = 200;

// const list = 
// Cookies.get('user_role') == 'ACADEMIC' ?
// [
//   {
//     title : "Dashboard",
//     href : "/dashboard"
//   },
//   {
//     title : "Projects",
//     href : "/projects"
//   },
// ] : [
//   {
//     title : "Dashboard",
//     href : "/dashboard"
//   },
//   {
//     title : "Projects",
//     href : "/projects"
//   },
//   {
//     title : "Sessions",
//     href : "/session"
//   },
//   {
//     title : "Feedback",
//     href : "/feedback"
//   },
// ]

const SideNavbar = ({children}) => {
  const [isSupervisor, setIsSupervisor] = useState(Cookies.get('user_role'));
  const [userRole, setUserRole] = useState(null); // Set initial value to null
  const [list, setList] = useState([]); // Create a state for the list

  useEffect(() => {
    const role = Cookies.get('user_role');
    setUserRole(role);

    // Generate list based on role after the component mounts
    if (role === 'MOD_OWNER') {
      setList([
        { title: "Dashboard", href: "/mod_ownerDashboard" },
        { title: "Projects", href: "/projects" },
        {title: "Add Users", href : "/addUsers"}
      ]);
    } else if (role === 'ACADEMIC') {
      setList([
        { title: "Dashboard", href: "/dashboard" },
        { title: "Projects", href: "/projects" },
        {title: "Select Students", href : "/studentPref"},
        { title: "Sessions", href: "/session" },
      ]);
    } else {
      setList([
        { title: "Dashboard", href: "/dashboard" },
        { title: "Projects", href: "/projects" },
        { title: "Sessions", href: "/session" },
      ]);
    }
  }, []);
  
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
          </List>
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
