import { useEffect } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import { Nav } from "@/components/Nav";
import { Footer } from "@/components/sections/Footer";
import { Home } from "@/pages/Home";
import { Studio } from "@/pages/Studio";
import { Cart } from "@/pages/Cart";
import { Confirmation } from "@/pages/Confirmation";
import { Legal } from "@/pages/Legal";
import { NotFound } from "@/pages/NotFound";

/** Scrolls to the #anchor on hash links, or to the top on page changes. */
function ScrollManager() {
  const { pathname, hash, key } = useLocation();

  useEffect(() => {
    if (hash) {
      // Wait a frame so the target section is mounted after a route change.
      const id = requestAnimationFrame(() =>
        document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }),
      );
      return () => cancelAnimationFrame(id);
    }
    window.scrollTo({ top: 0 });
  }, [pathname, hash, key]);

  return null;
}

export default function App() {
  return (
    <div className="grain min-h-screen">
      <ScrollManager />
      <Nav />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/creer" element={<Studio />} />
          <Route path="/panier" element={<Cart />} />
          <Route path="/commande/confirmation" element={<Confirmation />} />
          <Route path="/cgv" element={<Legal page="cgv" />} />
          <Route path="/mentions-legales" element={<Legal page="mentions" />} />
          <Route path="/confidentialite" element={<Legal page="confidentialite" />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}
