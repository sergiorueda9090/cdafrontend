import { Navigate, Route, Routes } from "react-router-dom"
import { Page }                    from "../pages/PageMain"

export const Routes = () => {
  return (
    <Routes>
        <Route path="/verify"   element={ <Page /> } />
        <Route path="/*"        element={ <Navigate to="/" /> } />
    </Routes>
  )
}
