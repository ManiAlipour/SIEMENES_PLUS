import Footer from "../layouts/Footer";
import Header from "../layouts/Header";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" font-vazir">
      <Header />
      {children}
      <Footer />
    </div>
  );
};

export default Providers;
