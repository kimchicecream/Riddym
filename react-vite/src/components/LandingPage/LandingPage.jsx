import "./LandingPage.css";

function LandingPage() {
  return (
    <div className="landing-page-container">
      <div className="hero-container">
        <div className="hero-title">
          <h4>Now in Beta</h4>
          <h1 id="introducing">Feel the Riddym</h1>
          {/* <img src=""></img> */}
          {/* <h2>Your favorite rhythm game reimagined.</h2> */}
        </div>
        <div className="video-container">
          <video
            src="../../../public/background-video.mov"
            className="background-video"
            autoPlay
            muted
            playsInline
            loop
          />
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
