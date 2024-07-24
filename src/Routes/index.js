import { BrowserRouter,Route,Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Facture from "../components/facture";
import DashBoard from "../components/DashBoard";



function AppRoutes(){
    const localtion= useLocation();
    return(
    <AnimatePresence>
     <Routes>
        
        <Route path='/facture' element={<Facture/>}/>
        <Route path='/dashboard' element={<DashBoard/>}/>
     </Routes>
     
     </AnimatePresence>
     );

}

export default AppRoutes;