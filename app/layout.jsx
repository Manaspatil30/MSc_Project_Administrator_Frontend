import '@styles/globals.css'
import { AppRouterCacheProvider } from '@mui/material-nextjs/v13-appRouter';
import {ThemeProvider} from '@mui/material/styles';
import theme from '@utils/theam';
import SideNavbar from '@components/SideNavbar';
import Navbar from '@components/Navbar';
import axios from 'axios';
import { cookies } from 'next/headers';


export const metadata = {
    title : "MSc Project Administrator"
}


const cookieStore = cookies();

const RootLayout = ({children}) => {
    // axios.defaults.headers.common['authorization'] = cookieStore.get('jwtToken');
    // axios.defaults.baseURL = 'https://team3-backend.onrender.com/';
  return (
    <html lang='en'>
        <body>
            <ThemeProvider theme = {theme}>
                <Navbar/>
                <div>{children}</div>
            </ThemeProvider>
        </body>
    </html>
  )
}

export default RootLayout