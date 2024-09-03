import "@styles/globals.css";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import theme from "@utils/theam";
import SideNavbar from "@components/SideNavbar";
import Navbar from "@components/Navbar";
import axios from "axios";
import { cookies } from "next/headers";
import { Bounce, ToastContainer } from "react-toastify";

export const metadata = {
  title: "MSc Project Administrator",
};

const cookieStore = cookies();

const RootLayout = ({ children }) => {
  return (
    <html lang="en">
      <body>
        <ThemeProvider theme={theme}>
          <ToastContainer
            position="top-right"
            autoClose={5000}
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
            transition={Bounce}
          />
          <Navbar />
          <div>{children}</div>
        </ThemeProvider>
      </body>
    </html>
  );
};

export default RootLayout;
