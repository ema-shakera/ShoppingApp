import { useDispatch, useSelector } from "react-redux";
import { login, signup, logout } from "../redux/thunks/index.js";



export const useAuth = () => {
  const dispatch = useDispatch();
  const { loading, error, userData } = useSelector(
    (state) => state.auth
  );

  const loginUser = async (credentials) => {
    return await dispatch(login(credentials)).unwrap();
  };

  const signupUser = async (data) => {
    return await dispatch(signup(data)).unwrap();
  };

  const logoutUser = async () => {
    return await dispatch(logout()).unwrap();
  };

  return {
    loginUser,
    signupUser,
    logoutUser,
    loading,
    error,
    userData,
  };
};