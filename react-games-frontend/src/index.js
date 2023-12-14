import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { ChakraProvider, extendTheme } from "@chakra-ui/react";
import {
  Navigate,
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from "react-router-dom";
import PageNotFound from "./components/PageNotFound";
import Home from "./pages/Home/Home";
import MagicMemory from "./pages/MagicMemory/MagicMemory";
import Game2048 from "./pages/2048/Game2048";
import Snake from "./pages/Snake/Snake";
import TicTacToe from "./pages/Tic-Tac-Toe/TicTacToe";
import Login from "./pages/Login/Login";
const theme = extendTheme({
  styles: {
    global: () => ({
      body: {
        bg: "",
      },
    }),
  },
});

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route>
      <Route path="games" element={<App />}>
        <Route path="home" element={<Home />} />
        <Route path="magic-memory" element={<MagicMemory />} />
        <Route path="2048" element={<Game2048 />} />
        <Route path="snake" element={<Snake />} />
        <Route path="tic-tac-toe" element={<TicTacToe />} />
        <Route path="" element={<Navigate to="/react-games/games/home" />} />
      </Route>
      <Route path="" element={<Navigate to="/react-games/games/home" />} />
      <Route path="login" element={<Login />} />
      <Route path="*" element={<PageNotFound />} />
    </Route>
  ),
  {
    basename: "/react-games",
  }
);

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
);
