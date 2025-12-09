import Home from "./component/main/Home";
import Contect from "./component/main/Contect";
import Header from "./component/header/header";
import Footer from "./component/footer/footer";
import Login from "./component/main/Login";
import Register from "./component/main/Register";
import Card from "./component/main/Card";
import Deshord from "./component/admin/deshord";
import Forgetpassword from "./component/main/Forgetpassword";
import CreateNews from "./component/main/CreateNews";
import ProtectedRoute from "./component/auth/ProtectedRoute";
import Setting from "./component/main/Setting";
import UserProfile from "./component/main/UserProfile";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
const Layout = () => {
  return (
    <div className="">
      <Header />
      <main className=" bg-gray-100">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
};

const router = createBrowserRouter([
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/forgetpassword",
    element: <Forgetpassword />,
  },
  {
    path: "/",
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Contect />,
      },
      {
        path: "/card",
        element: <Card />,
      },
      {
        path: "/deshord",
        element: <Deshord />,
      },
      {
        path: "/createnews",
        element: <CreateNews />,
      },
      {
        path: "/setting",
        element: <Setting />,
      },
      {
        path: "/userprofile",
        element: <UserProfile />,
      }
    ],
  },
]);


const queryClient = new QueryClient();
function App() {
  return (
    <QueryClientProvider client={queryClient}>
     
      <RouterProvider router={router} />
      <ToastContainer 
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
      <ReactQueryDevtools initialIsOpen={true} />
    </QueryClientProvider>
  );
}

export default App;