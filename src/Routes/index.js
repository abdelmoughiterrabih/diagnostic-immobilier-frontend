import { BrowserRouter,Route,Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import DashBoard from "../components/DashBoard";
import Dossier from "../components/Dossier";
import Utilisateur from "../components/Utilisateur";
import Rapport from "../components/Rapport";
import Facture from "../components/Facture";
import Client from "../components/Client";
import VoirDossier from "../components/Dossier/VoirDossier";
import ListeDossier from "../components/Dossier/ListeDossier";
import ListeRapport from "../components/Rapport/ListeRapport";

function AppRoutes(){
    const localtion= useLocation();
    return(
    <AnimatePresence>
     <Routes>
        
        
        <Route path='/dashboard' element={<DashBoard/>}/>
        <Route path='/dossier' element={<Dossier/>}/>
        <Route path='/facture' element={<Facture/>}/>
        <Route path='/utilisateur' element={<Utilisateur/>}/>
        <Route path='/rapport' element={<Rapport/>}/>
        <Route path='/client' element={<Client/>}/>
        <Route path='/dossier/voir' element={<VoirDossier/>}/>
        <Route path='/dossier/ListeDossier' element={<ListeDossier/>}/>
        <Route path='/rapport/ListeRapport' element={<ListeRapport/>}/>
     </Routes>
     
     </AnimatePresence>
     );

}

export default AppRoutes;