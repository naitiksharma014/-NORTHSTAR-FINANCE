import {Navigate,Outlet,useLocation} from 'react-router-dom';
import {LoaderCircle} from 'lucide-react';
import {useAuth} from '../context/AuthContext';
export default function ProtectedRoute(){const {admin,checking}=useAuth();const location=useLocation();if(checking)return <div className="full-screen-loader"><LoaderCircle className="spin" size={30}/><span>Checking admin session…</span></div>;if(!admin)return <Navigate to="/admin/login" replace state={{from:location.pathname}}/>;return <Outlet/>}
