import React from "react";
import { Outlet, Link } from "react-router-dom";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <nav>
        <ul>
          <li><Link to="/">Home</Link></li>
          
        </ul>
      </nav>

      <main className="flex-grow">
        <Outlet />
      </main>

      <footer>
        <p>© {new Date().getFullYear()} JustParkIt</p>
      </footer>
    </div>
  );
};

export default MainLayout;
