import {Outlet,useLocation} from 'react-router-dom';
import {useEffect} from 'react';
import useCachedGet from '../hooks/useCachedGet';
import {fallbackContent} from '../data/defaultContent';
import Navbar from './Navbar';import Footer from './Footer';
const mergeContent=(data)=>({...fallbackContent,...data,site:{...fallbackContent.site,...data?.site},hero:{...fallbackContent.hero,...data?.hero},home:{...fallbackContent.home,...data?.home},servicesPage:{...fallbackContent.servicesPage,...data?.servicesPage},about:{...fallbackContent.about,...data?.about},contact:{...fallbackContent.contact,...data?.contact}});
export default function PublicLayout(){const [content]=useCachedGet('/site-content',fallbackContent,mergeContent);const location=useLocation();useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[location.pathname]);return <div className="app-shell" style={{'--blue':content.site?.primaryColor||'#1746a2'}}><Navbar site={content.site}/><main><Outlet context={{content}}/></main><Footer site={content.site}/></div>}