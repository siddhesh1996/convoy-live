import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";

const router = createBrowserRouter([
//   {
//     path: "/",
//     element: <App />,
//   },
  {
    path: "/",
    element: <LandingPage />,
  },
]);

export default router;
