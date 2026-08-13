import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/check-scam?query=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      navigate("/check-scam");
    }
  };

  return (
    <div className="home-page">
      {/* HERO SECTION */}
      <section className="hero-section">
        <div className="hero-content">
          <p className="tagline">🛡️ SMART SCAM PROTECTION</p>

          <h1>
            Stay Safe From
            <span> Online Scams</span>
          </h1>

          <p className="description">
            Detect suspicious phone numbers, links and messages. Report scams and help protect the community.
          </p>

          <form onSubmit={handleSearchSubmit} className="search-box">
            <input
              type="text"
              placeholder="Enter phone number, URL or message..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />

            <button type="submit" className="check-now-btn" style={{ border: "none" }}>
              CHECK NOW
            </button>
          </form>

          <p className="small-text">🔒 Your information is protected</p>
        </div>
      </section>

      {/* STATISTICS - ALL 4 CARDS ARE FULLY TOUCHABLE/CLICKABLE */}
      <section className="stats">
        <Link to="/reports" className="stat-card">
          <h2>1,245+</h2>
          <p>Scams Reported →</p>
        </Link>

        <Link to="/reports?filter=HIGH" className="stat-card">
          <h2>348+</h2>
          <p>High Risk Scams →</p>
        </Link>

        <Link to="/reports" className="stat-card">
          <h2>892+</h2>
          <p>Protected Users →</p>
        </Link>

        <Link to="/check-scam?type=Suspicious+Link" className="stat-card">
          <h2>527+</h2>
          <p>Links Checked →</p>
        </Link>
      </section>

      {/* CATEGORIES - ALL 4 CARDS ARE FULLY TOUCHABLE/CLICKABLE */}
      <section className="categories">
        <h2>What do you want to check?</h2>
        <p>Quickly identify suspicious online activity</p>

        <div className="category-container">
          <Link to="/check-scam?type=Phone+Number" className="category-card">
            <div className="category-icon">📱</div>
            <h3>Phone Number</h3>
            <p>Check if a phone number has been reported as a scam.</p>
            <span className="category-button">Check Number →</span>
          </Link>

          <Link to="/check-scam?type=Suspicious+Link" className="category-card">
            <div className="category-icon">🔗</div>
            <h3>Suspicious Link</h3>
            <p>Analyze suspicious websites and URLs.</p>
            <span className="category-button">Check Link →</span>
          </Link>

          <Link to="/check-scam?type=Scam+Message" className="category-card">
            <div className="category-icon">💬</div>
            <h3>Scam Message</h3>
            <p>Check messages for possible scam indicators.</p>
            <span className="category-button">Check Message →</span>
          </Link>

          <Link to="/check-scam?type=Scam+Message" className="category-card">
            <div className="category-icon">💼</div>
            <h3>Job Scam</h3>
            <p>Verify suspicious job offers and recruitment messages.</p>
            <span className="category-button">Check Job →</span>
          </Link>
        </div>
      </section>
    </div>
  );
}

export default Home;