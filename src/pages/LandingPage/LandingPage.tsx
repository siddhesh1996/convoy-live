import "./LandingPage.css";

function LandingMapArt() {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 320 320"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <rect width="320" height="320" fill="var(--color-map-mock-bg)" />
      <pattern
        id="landing-grid"
        width="32"
        height="32"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M32 0L0 0 0 32"
          fill="none"
          stroke="var(--color-map-mock-grid)"
          strokeWidth="0.5"
        />
      </pattern>
      <rect width="320" height="320" fill="url(#landing-grid)" opacity="0.8" />
      <rect x="0" y="130" width="320" height="10" fill="var(--color-map-mock-road)" rx="2" />
      <rect
        x="0"
        y="134"
        width="320"
        height="3"
        fill="var(--color-accent-2)"
        rx="1"
        opacity="0.3"
      />
      <rect x="0" y="210" width="320" height="7" fill="var(--color-map-mock-road)" rx="2" />
      <rect x="110" y="0" width="7" height="320" fill="var(--color-map-mock-road)" rx="2" />
      <rect x="210" y="0" width="5" height="320" fill="var(--color-map-mock-road)" rx="2" />
      <path
        d="M 30 290 Q 60 240 80 200 Q 100 160 110 135 L 200 135"
        stroke="var(--color-accent)"
        strokeWidth="3"
        fill="none"
        strokeDasharray="8,5"
        opacity="0.8"
      />
      <path
        d="M 240 20 Q 245 60 250 100 Q 255 120 245 135 L 200 135"
        stroke="var(--color-accent-2)"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="7,5"
        opacity="0.7"
      />
      <path
        d="M 30 80 Q 60 100 80 115 Q 95 128 110 135 L 200 135"
        stroke="var(--color-info)"
        strokeWidth="2.5"
        fill="none"
        strokeDasharray="7,5"
        opacity="0.6"
      />
      <circle cx="248" cy="210" r="16" fill="var(--color-success)" opacity="0.12" />
      <circle cx="248" cy="210" r="9" fill="var(--color-success)" opacity="0.4" />
      <circle cx="248" cy="210" r="5" fill="var(--color-success)" />
      <polygon
        points="248,192 252,202 248,200 244,202"
        fill="var(--color-success)"
      />
      <circle cx="110" cy="160" r="10" fill="var(--color-accent)" opacity="0.2" />
      <circle cx="110" cy="160" r="6" fill="var(--color-accent)" />
      <circle cx="110" cy="160" r="2.5" fill="var(--color-marker-ring)" />
      <circle cx="240" cy="60" r="9" fill="var(--color-accent-2)" opacity="0.25" />
      <circle cx="240" cy="60" r="5.5" fill="var(--color-accent-2)" />
      <circle cx="30" cy="100" r="9" fill="var(--color-info)" opacity="0.25" />
      <circle cx="30" cy="100" r="5.5" fill="var(--color-info)" />
      <text
        x="122"
        y="157"
        className="landing__map-label"
        fontSize="8"
        fill="color-mix(in srgb, var(--color-accent) 70%, transparent)"
      >
        You
      </text>
      <text
        x="250"
        y="56"
        className="landing__map-label"
        fontSize="8"
        fill="color-mix(in srgb, var(--color-accent-2) 70%, transparent)"
      >
        Ravi
      </text>
      <text
        x="40"
        y="96"
        className="landing__map-label"
        fontSize="8"
        fill="color-mix(in srgb, var(--color-info) 70%, transparent)"
      >
        Priya
      </text>
      <text
        x="255"
        y="222"
        className="landing__map-label"
        fontSize="8"
        fontWeight="600"
        fill="color-mix(in srgb, var(--color-success) 80%, transparent)"
      >
        Alibaug
      </text>
    </svg>
  );
}

export default function LandingPage() {
  return (
    <div className="landing-page">
      <main className="landing">
        <div className="landing__bg" aria-hidden />

        <div className="landing__map">
          <LandingMapArt />
          <div className="landing__map-overlay" />
        </div>

        <div className="landing__content">
          <div className="landing__logo">
            <div className="landing__logo-icon" aria-hidden>
              🚗
            </div>
            <div className="landing__logo-text">
              Convoy<span>Live</span>
            </div>
          </div>

          <div>
            <h1 className="landing__headline">
              Drive together,
              <br />
              <em>arrive together.</em>
            </h1>
            <p className="landing__sub">
              Live location + navigation in one place. No more switching between
              WhatsApp and Maps.
            </p>
          </div>

          <div className="landing__live-strip" role="status">
            <span className="landing__live-dot" aria-hidden />
            <span className="landing__live-text">2 convoys active near Mumbai</span>
            <span className="landing__live-count">🚗 6 cars</span>
          </div>

          <div className="landing__btns">
            <button type="button" className="landing__btn-primary">
              🚀 Create a Convoy Room
            </button>
            <button type="button" className="landing__btn-secondary">
              🔗 Join with a Code
            </button>
          </div>

          <p className="landing__tagline">
            No sign-up needed · share a link · start navigating
          </p>
        </div>
      </main>
    </div>
  );
}
