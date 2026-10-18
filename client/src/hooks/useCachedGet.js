import {useEffect,useState} from 'react';
import api,{readCache,writeCache} from '../api/client';
// Stale-while-revalidate: show the last known server data immediately (or the built-in fallback the very
// first time), then replace it with fresh data. A failed request never reverts the page to the fallback.
export default function useCachedGet(path,fallback,transform=(d)=>d){
  const [data,setData]=useState(()=>{const cached=readCache(path);return cached?transform(cached):fallback});
  const [loading,setLoading]=useState(true);
  useEffect(()=>{
    let alive=true;setLoading(true);
    api.get(path).then(({data:fresh})=>{writeCache(path,fresh);if(alive)setData(transform(fresh))}).catch(()=>{}).finally(()=>alive&&setLoading(false));
    return()=>{alive=false};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[path]);
  return [data,loading];
}