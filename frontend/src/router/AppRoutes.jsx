import { BrowserRouter, Routes, Route } from "react-router-dom"

import Home from "../pages/Home"
import BgRemove from "../pages/BgRemove"
import FaceDetection from "../pages/FaceDetection"
import PassportMaker from "../pages/PassportMaker"
import ImageReducer from "../pages/ImageReducer"

function AppRoutes() {
  return (
    <BrowserRouter>

      <Routes>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/bg-remove"
          element={<BgRemove />}
        />

        <Route
          path="/face-detection"
          element={<FaceDetection />}
        />

        <Route
          path="/passport-maker"
          element={<PassportMaker />}
        />
        <Route
  path="/image-reducer"
  element={<ImageReducer />}
/>

      </Routes>

    </BrowserRouter>
  )
}

export default AppRoutes