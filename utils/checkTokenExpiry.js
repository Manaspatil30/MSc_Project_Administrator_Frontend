import jwt from 'jsonwebtoken';
import Cookies from 'js-cookie';
import { redirect } from 'next/navigation';

const checkTokenExpiry = () => {
  const token = Cookies.get('token');

  if(!token) {
    redirect("/login");
  }
  if (token) {
    const decoded = jwt.decode(token);
    // @ts-ignore
    if (decoded.exp * 1000 < Date.now()) {
      // Token is expired
      Cookies.remove('token');
      Cookies.remove('userId');
      Cookies.remove('user_role');
      redirect('/login');
    }
  }
};

export default checkTokenExpiry;