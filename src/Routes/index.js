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
import Unauthorized from "../components/unauthorized";

function AppRoutes(){
    const localtion= useLocation();
    const role = localStorage.getItem('role');
    return(
    <AnimatePresence>
     <Routes>
        
        
        <Route path='/dashboard' element={<DashBoard/>}/>
        {(role.includes("admin") || (role.includes("gestionnaire") ))  && (
          <>
 <Route path='/dossier' element={<Dossier/>}/>

          </>
        )}
         {(role.includes("admin") || (role.includes("coordinateur") ))  && (
          <>
    <Route path='/facture' element={<Facture/>}/>

          </>
        )}
        
       
     
        {(role.includes("admin")) && (
          <>
            <Route path="/utilisateur" element={<Utilisateur />} />

          </>
        )}
           {(role.includes("admin") || (role.includes("expert") ))  && (
          <>
     <Route path='/rapport' element={<Rapport/>}/>

          </>
        )}
         {(role.includes("admin") || (role.includes("gestionnaire") ))  && (
          <>
    <Route path='/client' element={<Client/>}/>

          </>
        )}
        <Route path="*" element={<Unauthorized />} />
        <Route path='/dossier/voir' element={<VoirDossier/>}/>
        <Route path='/dossier/ListeDossier' element={<ListeDossier/>}/>
        <Route path='/rapport/ListeRapport' element={<ListeRapport/>}/>
     </Routes>
     
     </AnimatePresence>
     );

}

export default AppRoutes;