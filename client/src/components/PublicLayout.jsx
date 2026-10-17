
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/client';
import { fallbackContent } from '../data/defaultContent';
import Navbar from './Navbar';
import Footer from './Footer';

function mergeContent(data = {}) {
  return {
    ...fallbackContent,
    ...data,
    site: {
      ...fallbackContent.site,
      ...data.site,
    },
    hero: {
      ...fallbackContent.hero,
      ...data.hero,
    },
    home: {
      ...fallbackContent.home,
      ...data.home,
    },
    servicesPage: {
      ...fallbackContent.servicesPage,
      ...data.servicesPage,
    },
    about: {
      ...fallbackContent.about,
      ...data.about,
    },
    contact: {
      ...fallbackContent.contact,
      ...data.contact,
    },
  };
}

export default function PublicLayout() {
  const [content, setContent] = useState(fallbackContent);
  const location = useLocation();

  useEffect(() => {
    let active = true;

    async function loadContent() {
      try {
        const { data } = await api.get('/site-content', {
          params: {
            _fresh: Date.now(),
          },
          headers: {
            'Cache-Control': 'no-cache',
          },
        });

        if (active) {
          setContent(mergeContent(data));
        }
      } catch (error) {
        console.error('Failed to load saved website content:', error);
      }
    }

    loadContent();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'instant',
    });
  }, [location.pathname]);

  return (
    <div
      className="app-shell"
      style={{
        '--blue': content.site?.primaryColor || '#1746a2',
      }}
    >
      <Navbar site={content.site} />

      <main>
        <Outlet context={{ content, setContent }} />
      </main>

      <Footer site={content.site} />
    </div>
  );
}
