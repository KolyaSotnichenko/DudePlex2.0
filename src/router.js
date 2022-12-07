import { Route, Routes } from "react-router-dom";

import Explore from "./pages/Explore";
import Home from "./pages/Home";
import MovieInfo from "./pages/Movie/MovieInfo";
import MovieWatch from "./pages/Movie/MovieWatch";
import Search from "./pages/Search";
import TVInfo from "./pages/TV/TVInfo";
import TVWatch from "./pages/TV/TVWatch";

export default (
    <Routes>
      <Route index element={<Home />} />
      <Route path="movie/:id" element={<MovieInfo />} />
      <Route path="tv/:id" element={<TVInfo />} />
      <Route path="movie/:id/watch" element={<MovieWatch />} />
      <Route path="tv/:id/watch" element={<TVWatch />} />
      <Route path="explore" element={<Explore />} />
      <Route path="search" element={<Search />} />
    </Routes>
);