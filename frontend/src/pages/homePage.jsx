import React from "react";
import Header from "../components/header";
import Footer from "../components/footer";

const homePage = () => {
  return (
    <div className="flex flex-col min-h-screen min-w-screen bg-sky-50 text-sky-900">
      <Header />

      {/* Main content area */}
      <main className="flex-grow p-6 flex items-center justify-center">
        <h1 className="text-3xl font-semibold">
          Welcome to our Bathroom Collection
        </h1>
      </main>

      <Footer />
    </div>
  );
};

export default homePage;
