import React, { useEffect } from 'react';

const TOP100_PROJECT_ID = 7749163;

const Footer = () => {
  useEffect(() => {
    if (!window._top100q) {
      window._top100q = [];
    }

    if (!window.__top100CounterInitialized) {
      window._top100q.push(function () {
        const options = {
          project: TOP100_PROJECT_ID,
        };
        try {
          window.top100Counter = new window.top100(options);
        } catch (error) {
          // Silently ignore initialization errors
        }
      });
      window.__top100CounterInitialized = true;
    }

    if (!document.querySelector('script[data-top100-counter]')) {
      const script = document.createElement('script');
      script.type = 'text/javascript';
      script.async = true;
      script.setAttribute('data-top100-counter', 'true');
      script.src =
        (document.location.protocol === 'https:' ? 'https:' : 'http:') +
        '//st.top100.ru/top100/top100.js';
      document.body.appendChild(script);
    }
  }, []);

  return (
    <footer className="site-footer">
      <div className="container footer-inner">
        <div className="footer-copy">
          © {new Date().getFullYear()} Университетские клубы интересов
        </div>
        <div
          className="footer-counters"
          dangerouslySetInnerHTML={{
            __html:
              '<noscript><img src="//counter.rambler.ru/top100.cnt?pid=7749163" alt="Топ-100" /></noscript>',
          }}
        />
      </div>
    </footer>
  );
};

export default Footer;
