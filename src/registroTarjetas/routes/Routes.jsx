import { Navigate, Route, Routes } from "react-router-dom"
import { PageMain }                from "../pages/PageMain"
import { PageShow }                from "../pages/PageShow";

export const RoutesTarjetas = () => {
  return (
    <Routes>
        <Route path="/"                   element={ <PageMain /> } />
        <Route path="totaldecadatarjeta"  element={  <PageShow />} />
        <Route path="/*"                  element={ <Navigate to="/" /> } />
    </Routes>
  )
}
