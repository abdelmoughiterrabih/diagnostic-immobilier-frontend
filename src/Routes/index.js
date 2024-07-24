import { BrowserRouter,Route,Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Facture from "../components/facture";
import DashBoard from "../components/DashBoard";
import Dossier from "../components/Dossier";
import Utilisateur from "../components/Utilisateur";
import Rapport from "../components/Rapport";


function AppRoutes(){
    const localtion= useLocation();
    return(
    <AnimatePresence>
     <Routes>
        
        <Route path='/facture' element={<Facture/>}/>
        <Route path='/dashboard' element={<DashBoard/>}/>
        <Route path='/dossier' element={<Dossier/>}/>
        <Route path='/utilisateur' element={<Utilisateur/>}/>
        <Route path='/rapport' element={<Rapport/>}/>
     </Routes>
     
     </AnimatePresence>
     );

}

export default AppRoutes;