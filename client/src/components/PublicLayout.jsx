import {Outlet,useLocation} from 'react-router-dom';
import {useEffect,useState} from 'react';
import api from '../api/client';
import {fallbackContent} from '../data/defaultContent';
import Navbar from './Navbar';import Footer from './Footer';
export default function PublicLayout(){const [content,setContent]=useState(fallbackContent);const location=useLocation();useEffect(()=>{api.get('/site-content').then(({data})=>setContent({...fallbackContent,...data,site:{...fallbackContent.site,...data.site},hero:{...fallbackContent.hero,...data.hero},home:{...fallbackContent.home,...data.home},servicesPage:{...fallbackContent.servicesPage,...data.servicesPage},about:{...fallbackContent.about,...data.about},contact:{...fallbackContent.contact,...data.contact}})).catch(()=>{});},[]);useEffect(()=>{window.scrollTo({top:0,behavior:'instant'});},[location.pathname]);return <div className="app-shell" style={{'--blue':content.site?.primaryColor||'#1746a2'}}><Navbar site={content.site}/><main><Outlet context={{content,setContent}}/></main><Footer site={content.site}/></div>}
