import {
    createBrowserRouter,
} from "react-router";
import Home from "../screens/home";
import Pokemon from "../screens/pokemon";

let router = createBrowserRouter([
    {
        path: "/",
        Component: Home,
    },
    {
        path: "/pokemon/:id",
        Component: Pokemon,
    }
]);

export default router;