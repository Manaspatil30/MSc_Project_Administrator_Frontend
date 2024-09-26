"use client"
import ProfileCard from '@components/ProfileCard';
import SettingsCard from '@components/SettingsCard';
import { Grid } from '@mui/material';
import axiosInstance from '@utils/axios';
import Cookies from 'js-cookie';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react'

const page = () => {
    // @ts-ignore
    const [text, setText] = useState("");
    const [user, setUser] = useState();

    const router = useRouter();

  if(!Cookies.get('token')){
    router.push('/login')
  }

    useEffect(()=>{
        axiosInstance.get("/api/v1/users/profile")
        .then((res) => {setUser(res.data)})
    },[])

    console.log("User Details",user)

  const mainUser = {
    // DEFAULT VALUES
    title: "CEO of Apple",
    dt1: 32,
    dt2: 40,
    dt3: 50,
    firstName: { text },
    lastName: "Doe",
    midName: "Baker",
    gender: "female",
    phone: "932-555-4247",
    email: "janedoe@gmail.com",
    pass: "password123"
  };

  // @ts-ignore
  const fullName = user&&`${user.firstname} ${user.lastname}`;
  return (
    <Grid container direction="column" sx={{ overflowX: "hidden" }}>
          <Grid item xs={12} md={6}>
            <img
              alt="avatar"
              style={{
                width: "100vw",
                height: "35vh",
                objectFit: "cover",
                objectPosition: "50% 50%",
                position: "relative"
              }}
              src="https://iris2.gettimely.com/images/default-cover-image.jpg"
            />
          </Grid>

          {/* COMPONENTS */}
          <Grid
            container
            direction={{ xs: "column", md: "row" }}
            spacing={3}
            sx={{
              position: "absolute",
              top: "20vh",
              px: { xs: 0, md: 7 }
            }}
          >
            {/* PROFILE CARD */}
            <Grid item md={3}>
              <ProfileCard
                name={fullName}
                // @ts-ignore
                role={user&&user.role}
                dt1={mainUser.dt1}
                dt2={mainUser.dt2}
                dt3={mainUser.dt3}
              ></ProfileCard>
            </Grid>

            {/* SETTINGS CARD */}
            <Grid item md={9}>
              <SettingsCard
                // expose={(v) => setText(v)}
                // @ts-ignore
                firstName={user&&user.firstname}
                // @ts-ignore
                lastName={user&&user.lastname}
                // midName={mainUser.midName}
                // phone={mainUser.phone}
                // @ts-ignore
                email={user&&user.email}
                // pass={mainUser.pass}
                // gender={mainUser.gender}
              ></SettingsCard>
            </Grid>
          </Grid>
        </Grid>
  )
}

export default page