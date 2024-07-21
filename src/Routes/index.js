import { BrowserRouter,Route,Routes, useLocation } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import Test1 from "../components/test1";
import Test2 from "../components/test2";


function AppRoutes(){
    const localtion= useLocation();
    return(
    <AnimatePresence>
     <Routes>
        <Route path='/test1' element={<Test1/>}/>
        <Route path='/test2' element={<Test2/>}/>
     </Routes>
     
     </AnimatePresence>
     );

}

export default AppRoutes;