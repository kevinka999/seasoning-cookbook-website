import { BrowserRouter, Routes, Route } from "react-router-dom";
import { PageLayout } from "./components/PageLayout";
import { Home } from "./pages/Home";
import { CreateRecipe } from "./pages/CreateRecipe";

export const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<PageLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/create" element={<CreateRecipe />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};
