import { createBrowserRouter } from "react-router";
import App from "./App.tsx";
import LandingPage from "./pages/LandingPage/LandingPage.tsx";

const router = createBrowserRouter([
  {
    path: "/accounts",
    element: <h1>Accounts redirect page</h1>
  },
  {
    path: "/",
    element: <LandingPage />,
  },
]);

export default router;
