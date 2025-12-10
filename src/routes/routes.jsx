import { createBrowserRouter } from "react-router";
import { MainLayout } from "../Layouts/MainLayout";
import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Authlayouts from "../Layouts/Authlayouts";
import Dashboard from "../pages/Dashboard";
import Clublayouts from "../Layouts/Clublayouts";
import AllClubspages from "../components/AllCLubs/AllClubspages";
import ClubDetailsPage from "../pages/ClubDetailsPage";
import Eventlayout from "../Layouts/Eventlayout";
import Allevents from "../components/Allevents/Allevents";
import About from "../pages/About";
import Aboutlayouts from "../Layouts/Aboutlayouts";
import PrivateRoute from "./PrivateRoute";

export const router =createBrowserRouter([
    {
        path: '/',
        element :<MainLayout></MainLayout>,
        children: [
            {
                index: true,
                element: <Home></Home>
            }
        ]
    },
{
    path:'auth',
    element : <Authlayouts></Authlayouts>,
    children :[
        {
         index : true,
         element : <Register></Register>
        },
        {
            path:"login",
            element:<Login></Login>
        }
    ]
},
{
    path:'dashboard',
    element:<Dashboard></Dashboard>
},
{
    path:'clubs',
    element:<Clublayouts></Clublayouts>,
    children:[
        {
            index:true,
            element:<AllClubspages></AllClubspages>
        },
        {
            path: ':id',
            element:<PrivateRoute><ClubDetailsPage></ClubDetailsPage></PrivateRoute> 
        }
    ]
},
{
    path: 'events',
    element:<Eventlayout></Eventlayout>,
    children:[
        {
            index:true,
            element:<PrivateRoute>
                <Allevents></Allevents>
            </PrivateRoute>
        }
    ]
},
{
    path : 'about',
    element:<Aboutlayouts></Aboutlayouts>,
    children:[
        {
            index:true,
            element:<About></About>
        }
    ]
}
])