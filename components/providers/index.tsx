import Header from "../layouts/Header";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className=" font-vazir">
      <Header />
      {children}
    </div>
  );
};

export default Providers;
