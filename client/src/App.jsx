import {BrowserRouter,Navigate,Route,Routes} from 'react-router-dom';
import {AuthProvider} from './context/AuthContext';
import PublicLayout from './components/PublicLayout';
import AdminLayout from './components/AdminLayout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/public/Home';
import Services from './pages/public/Services';
import About from './pages/public/About';
import Contact from './pages/public/Contact';
import AdminLogin from './pages/admin/AdminLogin';
import Dashboard from './pages/admin/Dashboard';
import ContentManager from './pages/admin/ContentManager';
import ResourceManager from './pages/admin/ResourceManager';
import MessagesManager from './pages/admin/MessagesManager';
function NotFound(){return <main className="not-found"><span>404</span><h1>That page doesn’t exist.</h1><p>The link may be incorrect or the page may have moved.</p><a className="button button-primary" href="/">Return home</a></main>}
export default function App(){return <BrowserRouter><AuthProvider><Routes><Route element={<PublicLayout/>}><Route index element={<Home/>}/><Route path="services" element={<Services/>}/><Route path="about" element={<About/>}/><Route path="contact" element={<Contact/>}/></Route><Route path="/admin/login" element={<AdminLogin/>}/><Route element={<ProtectedRoute/>}><Route path="/admin" element={<AdminLayout/>}><Route index element={<Dashboard/>}/><Route path="content" element={<ContentManager/>}/><Route path="services" element={<ResourceManager/>}/><Route path="team" element={<ResourceManager/>}/><Route path="testimonials" element={<ResourceManager/>}/><Route path="faqs" element={<ResourceManager/>}/><Route path="messages" element={<MessagesManager/>}/></Route></Route><Route path="*" element={<NotFound/>}/></Routes></AuthProvider></BrowserRouter>}
