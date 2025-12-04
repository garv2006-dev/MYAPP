import Home from "./component/main/Home";
import Contect from "./component/main/Contect";
import Header from "./component/header/header";
import Footer from "./component/footer/footer";
import Login from "./component/main/Login";
import Register from "./component/main/Register";
import Card from "./component/main/Card";
import Deshord from "./component/admin/deshord";
import Forgetpassword from "./component/main/Forgetpassword";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
    path: "/",
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <Home />,
      },
      {
        path: "/contact",
        element: <Contect />,
      },
      
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
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
    path: "/forgetpassword",
    element: <Forgetpassword />,
  },
]);

function App() {
  return (
    <>
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
    </>
  );
}

export default App;