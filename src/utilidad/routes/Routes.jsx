import { Navigate, Route, Routes } from "react-router-dom"
import { PageMain }                from "../pages/PageMain"
import { PageShow }                from "../pages/PageShow";

export const RoutesUtilidad = () => {
  return (
    <Routes>
        <Route path="/"                 element={ <PageShow /> } />
        <Route path="PageShow/:id"      element={ <PageShow />} />
        <Route path="/*"                element={ <Navigate to="/" /> } />
    </Routes>
  )
}
