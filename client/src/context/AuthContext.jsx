import {createContext,useCallback,useContext,useEffect,useMemo,useState} from 'react';
import api from '../api/client';
const AuthContext=createContext(null);
export function AuthProvider({children}){
 const [admin,setAdmin]=useState(null),[checking,setChecking]=useState(true);
 const refreshSession=useCallback(async()=>{try{const {data}=await api.get('/auth/me');setAdmin(data.admin);return data.admin;}catch{setAdmin(null);return null;}finally{setChecking(false);}},[]);
 useEffect(()=>{refreshSession();},[refreshSession]);
 const value=useMemo(()=>({admin,checking,setAdmin,refreshSession}),[admin,checking,refreshSession]);
 return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
export function useAuth(){const value=useContext(AuthContext);if(!value)throw new Error('useAuth must be used inside AuthProvider');return value;}
