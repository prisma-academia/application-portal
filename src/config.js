const getAbsoluteLogoUrl = (url) => {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `${process.env.PUBLIC_URL || ""}${url.startsWith("/") ? url : `/${url}`}`;
};

const config = {
  isDevelopment:
    process.env.REACT_APP_MODE === "development" ||
    process.env.NODE_ENV === "development",
  baseUrl:
    process.env.REACT_APP_API_URL || "http://localhost:4000",
  appName:
    process.env.REACT_APP_APP_NAME || "Almaarif College of Nursing",
  appDescription:
    process.env.REACT_APP_APP_DESCRIPTION ||
    "Almaarif College of Nursing launched in 2020",
  appTagline:
    process.env.REACT_APP_APP_TAGLINE || "Nursing Sciences, Potiskum",
  appAdmissionTitle:
    process.env.REACT_APP_APP_ADMISSION_TITLE || "2025-2026 Admissions",
  theme: {
    primary: process.env.REACT_APP_THEME_PRIMARY || "#DA0037",
    surface: process.env.REACT_APP_THEME_SURFACE || "#EDEDED",
    metaColor:
      process.env.REACT_APP_THEME_META_COLOR ||
      process.env.REACT_APP_THEME_PRIMARY ||
      "#000000",
  },
  logoUrl: getAbsoluteLogoUrl(process.env.REACT_APP_LOGO_URL),
  logoSecondaryUrl: getAbsoluteLogoUrl(
    process.env.REACT_APP_LOGO_SECONDARY_URL
  ),
  faviconUrl: getAbsoluteLogoUrl(process.env.REACT_APP_FAVICON_URL),
};

export default config;
