import axios from 'axios';
const api=axios.create({baseURL:import.meta.env.VITE_API_URL||'http://localhost:5000/api',withCredentials:true,timeout:30000,headers:{'Content-Type':'application/json'}});

// Free hosting tiers (e.g. Render) put the API to sleep. The first request after a pause can time out or
// return 502/503/504. Retry safe GET requests a few times instead of giving up and showing stale defaults.
const sleep=(ms)=>new Promise((r)=>setTimeout(r,ms));
api.interceptors.response.use(undefined,async(error)=>{
  const config=error.config;
  if(!config||(config.method||'get').toLowerCase()!=='get')throw error;
  const status=error.response?.status;
  const retryable=!error.response||status===502||status===503||status===504||status===429;
  config.__retry=(config.__retry||0)+1;
  if(!retryable||config.__retry>4)throw error;
  await sleep(1000*config.__retry);
  return api(config);
});

export const getErrorMessage=(error,fallback='Something went wrong. Please try again.')=>error?.response?.data?.message||error?.message||fallback;

// Last successfully loaded server response is remembered, so a failed request shows the most recent
// saved data rather than the hard-coded defaults that ship with the app.
const CACHE_PREFIX='gfpo-cache:';
export function readCache(path){try{const raw=localStorage.getItem(CACHE_PREFIX+path);return raw?JSON.parse(raw):null}catch{return null}}
export function writeCache(path,data){try{localStorage.setItem(CACHE_PREFIX+path,JSON.stringify(data))}catch{}}
export default api;