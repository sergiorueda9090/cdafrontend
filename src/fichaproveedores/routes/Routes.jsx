import { Navigate, Route, Routes } from "react-router-dom"
import { PageMain }                from "../pages/PageMain"
import { PageShow }                from "../pages/PageShow";

export const RoutesFichaProveedores = () => {
  return (
    <Routes>
        <Route path="/"                 element={ <PageMain /> } />
        <Route path="PageShow/:id"      element={ <PageShow />} />
        <Route path="/*"                element={ <Navigate to="/" /> } />
        {/*<Route path="/clientes" element={ <Page /> } />
        <Route path="/*"       element={ <Navigate to="/" /> } />*/}
    </Routes>
  )
}


/*
 import { Navigate, Route, Routes } from "react-router-dom"
 import { Page }                    from "../pages/PageMain"
 import { PageMain }                from "../pages/PageMain"
 import { PageShow }                from "../pages/PageShow";
 
 export const RoutesBancos = () => {
   return (
     <Routes>
         <Route path="/"                 element={ <PageMain /> } />
         <Route path="PageShow/:id"      element={ <PageShow />} />
         <Route path="/*"                element={ <Navigate to="/" /> } />
     </Routes>
   )
 }

 */