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
import Read from "./component/main/Read";
import "./App.css";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { Cloudinary } from '@cloudinary/url-gen';
import { auto } from '@cloudinary/url-gen/actions/resize';
import { autoGravity } from '@cloudinary/url-gen/qualifiers/gravity';
import { AdvancedImage } from '@cloudinary/react';
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
    path: "/read/:id",
    element: <Read />,
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
      },

    ],
  },
]);


const queryClient = new QueryClient();
function App() {
  const cld = new Cloudinary({ cloud: { cloudName: 'dnnx2sedu' } });
  // const img = cld
  //   .image('')
  //   .format('auto') // Optimize delivery by resizing and applying auto-format and auto-quality// cldImg={img}
  //   .quality('auto')
  //   .resize(auto().gravity(autoGravity()).width(500).height(500)); // Transform the image: auto-crop to square aspect_ratio
  return (
    <QueryClientProvider client={queryClient}>
      {/* <AdvancedImage  />    */}
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