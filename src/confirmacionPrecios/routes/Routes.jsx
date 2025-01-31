import { Navigate, Route, Routes } from "react-router-dom"
import { PageMain }                from "../pages/PageMain"
import { PageShow }                from "../pages/PageShow";

export const RoutesConfirmacionPrecios = () => {
  return (
    <Routes>
        <Route path="/"                 element={ <PageMain /> } />
        <Route path="PageShow/:id"      element={<PageShow />} />
        <Route path="/*"                element={ <Navigate to="/" /> } />
    </Routes>
  )
}
