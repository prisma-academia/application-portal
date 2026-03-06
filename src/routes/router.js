import * as React from "react";
import { createBrowserRouter, Outlet } from "react-router-dom";
import { lazy } from "react";
import PrivateLayout from "../layouts/main";
import FormsLayout from "../layouts/forms";
import AuthLayout from "../layouts/auth";
import StudentInfo from "../pages/student";
import AdminLayout from "../layouts/admin";


const ApplicationPage = lazy(() => import("../pages/homepage"));
const Admission = lazy(() => import("../pages/admission"));

const Login = lazy(() => import("../pages/login"));
const Verify = lazy(() => import("../pages/verify"));

const ForgotPassword = lazy(() => import("../pages/forgotpassword"));
const Register = lazy(() => import("../pages/register"));
const ResetPassword = lazy(() => import("../pages/resetpassword"));
const Biodata = lazy(() => import("../pages/biodata"));
const Examination = lazy(() => import("../pages/examination"));
const Olevels = lazy(() => import("../pages/o-levels"));
const RegistrationSuccess = lazy(() => import("../pages/registrationsuccess"));
const PreviewPage = lazy(() => import("../pages/previewpage"));
const AdminPage = lazy(() => import("../pages/admin"));
const Logout = lazy(() => import("../pages/logout"));
const NotFound = lazy(() => import("../pages/notfound"));
const ErrorPage = lazy(() => import("../pages/errorpage"));



const router = createBrowserRouter([
  {
    path: "auth",
    element: (
      <AuthLayout>
        <Outlet />
      </AuthLayout>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "forgot-password",
        element: <ForgotPassword />,
      },
      {
        path: "register",
        element: <Register />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "registration-success",
        element: <RegistrationSuccess />,
      },
      {
        path: "verify/redirect",
        element: <Verify />,
      }
    ]
  },

  {
    path: "/",
    element: (
      <PrivateLayout>
        <Outlet />
      </PrivateLayout>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <ApplicationPage />,
        errorElement: <ErrorPage />,
      },
      {
        path: "admin",
        element: <AdminLayout>
          <AdminPage />
        </AdminLayout>,
        errorElement: <ErrorPage />,
      },
      {
        path: "student",
        element: <StudentInfo />,
        errorElement: <ErrorPage />,
      },
      {
        path: "admission",
        element: <Admission />,
        errorElement: <ErrorPage />,
      },
      {
        path: "logout",
        element: <Logout />,
      },
      {
        path: "form",
        element: (
          <FormsLayout>
            <Outlet />
          </FormsLayout>),
        errorElement: <ErrorPage />,
        children: [
          {
            path: "Bio-Data",
            element: <Biodata />,
          },
          {
            path: "Examination",
            element: <Examination />,
          },
          {
            path: "O-levels",
            element: <Olevels />,
          },
          {
            path: "Preview",
            element: <PreviewPage />,
          },
        ]
      }
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

export default router
