import Navbar from "./components/common/Navbar";
import Footer from "./components/common/Footer";
import AppRoutes from "./routes/AppRoutes";
// import CTA from "./components/common/CTA";
import { useLocation } from "react-router-dom";

function App() {
  const location = useLocation();
  const isContactUsPage = location.pathname === "/contact-us" || location.pathname === "/login" || location.pathname === "/signup"; 

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="">
        <AppRoutes />
      </main>
      {/* {!isAboutUsPage && !isMediaEntertainmentPage && (
        <div id="cta-section">
          <CTA />
        </div>
      )} */}
      {!isContactUsPage && <Footer /> }
    </div>
  );
}

export default App;
