import { Suspense, useEffect } from "react";
import { RouterProvider } from "react-router-dom";
import routes from "./routes/router";
import Loader from "./components/loader";
import ErrorFeedback from "./components/errorfeedback";
import DevModeBanner from "./components/DevModeBanner";
import config from "./config";

function App() {
  useEffect(() => {
    document.title = config.appName;
    const desc = document.querySelector('meta[name="description"]');
    if (desc) desc.setAttribute("content", config.appDescription);
    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.setAttribute("content", config.theme.metaColor);
    if (config.faviconUrl) {
      let link = document.querySelector('link[rel="icon"]');
      if (!link) {
        link = document.createElement("link");
        link.rel = "icon";
        document.head.appendChild(link);
      }
      link.href = config.faviconUrl;
    }
  }, []);

  return (
    <>
      <DevModeBanner />
      <Suspense
        fallback={
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh' // Full viewport height
          }}>
            <Loader />
          </div>
        }
      >
        <RouterProvider router={routes} />
      </Suspense>
      
      {/* Global Error Feedback Modal */}
      <ErrorFeedback />
    </>
  );
}

export default App;
