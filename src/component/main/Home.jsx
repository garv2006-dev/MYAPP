import React from "react";
import { Link } from "react-router-dom";
import "../style/Home.css";

export default function Home() {
  return (
    <div className="home-container">

      {/* Hero Section */}
      <section className="hero-section">
        <h1 className="hero-title">
          Welcome to News Website
        </h1>

        <p className="hero-subtitle">
          Your satisfaction is our priority. Explore amazing features!
        </p>

        <Link
          to="/card"
          className="cta-button"
        >
          Get Started
        </Link>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="features-title">
          Our Features
        </h2>

        <div className="features-grid">

          {/* Card 1 */}
          <div className="feature-card">
            <h3 className="feature-card-title">Fast</h3>
            <p className="feature-card-description">
              Super-fast website performance optimized for users.
            </p>
          </div>

          {/* Card 2 */}
          <div className="feature-card">
            <h3 className="feature-card-title">Reliable</h3>
            <p className="feature-card-description">
              Trusted by thousands for secure and reliable service.
            </p>
          </div>

          {/* Card 3 */}
          <div className="feature-card">
            <h3 className="feature-card-title">Support</h3>
            <p className="feature-card-description">
              24/7 customer support anytime you need us.
            </p>
          </div>

        </div>
      </section>
    </div>
  );
}