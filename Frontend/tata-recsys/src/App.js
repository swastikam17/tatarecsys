import { useState, useEffect, useRef } from "react";

const API = process.env.REACT_APP_API_URL || "http://localhost:5000/api";

function StarRating({ rating }) {
  const stars = [];
  for (let i = 1; i <= 5; i++) {
    stars.push(
      <span key={i} style={{ color: i <= Math.round(rating) ? "#b8956a" : "#2a2a2a", fontSize: 12 }}>★</span>
    );
  }
  return (
    <span style={{ display: "flex", alignItems: "center", gap: 2 }}>
      {stars}
      <span style={{ color: "#555", marginLeft: 5, fontSize: 11, fontFamily: "'DM Mono', monospace" }}>{rating.toFixed(1)}</span>
    </span>
  );
}

const GrainRect = ({ borderRadius = 14 }) => (
  <svg style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", borderRadius }} aria-hidden="true">
    <rect width="100%" height="100%" filter="url(#grain-global)" opacity="0.065"/>
  </svg>
);

function CustomSelect({ value, onChange, options, placeholder }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const selected = options.find(o => o === value);

  return (
    <div ref={ref} style={{ position: "relative", userSelect: "none" }}>
      <div
        onClick={() => setOpen(o => !o)}
        style={{
          height: 42, padding: "0 14px",
          background: "rgba(255,255,255,0.05)",
          border: open ? "1px solid rgba(255,255,255,0.25)" : "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          color: selected ? "#d2d2d2" : "#3a3a3a",
          fontSize: 13, cursor: "pointer",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          transition: "border .15s",
          fontFamily: "'Poppins', sans-serif",
        }}
      >
        <span>{selected || placeholder}</span>
        <span style={{
          color: "#3a3a3a", fontSize: 10,
          transform: open ? "rotate(180deg)" : "rotate(0deg)",
          transition: "transform .2s",
          display: "inline-block",
        }}>▼</span>
      </div>
      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 9999,
          background: "#141414",
          border: "1px solid rgba(255,255,255,0.1)",
          borderRadius: 10,
          boxShadow: "0 8px 32px rgba(0,0,0,0.6)",
          maxHeight: 220, overflowY: "auto",
          scrollbarWidth: "none",
        }}>
          {options.map(o => (
            <div
              key={o}
              onClick={() => { onChange(o); setOpen(false); }}
              style={{
                padding: "9px 12px",
                fontSize: 13,
                color: o === value ? "#e2e2e2" : "#888",
                background: o === value ? "rgba(255,255,255,0.07)" : "transparent",
                cursor: "pointer",
                borderRadius: 8,
                margin: "3px 4px",
                transition: "background .12s, color .12s",
                fontFamily: "'Poppins', sans-serif",
              }}
              onMouseEnter={e => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.color = "#d2d2d2";
              }}
              onMouseLeave={e => {
                e.currentTarget.style.background = o === value ? "rgba(255,255,255,0.07)" : "transparent";
                e.currentTarget.style.color = o === value ? "#e2e2e2" : "#888";
              }}
            >{o}</div>
          ))}
        </div>
      )}
    </div>
  );
}

function ProductCard({ product, onSelect, selected }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onClick={() => onSelect(product["Sub_Category"])}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: selected ? "rgba(184,149,106,0.07)" : "rgba(255,255,255,0.04)",
        border: selected
          ? "1px solid rgba(184,149,106,0.55)"
          : hovered
          ? "1px solid rgba(255,255,255,0.45)"
          : "1px solid rgba(255,255,255,0.08)",
        boxShadow: selected
          ? "0 0 0 1px rgba(184,149,106,0.15), 0 0 20px rgba(184,149,106,0.14)"
          : hovered
          ? "0 0 0 1px rgba(255,255,255,0.08), 0 0 18px rgba(255,255,255,0.12), 0 0 40px rgba(255,255,255,0.06)"
          : "none",
        borderRadius: 14, padding: "20px 22px", cursor: "pointer",
        transition: "border .18s, box-shadow .18s, background .18s",
        overflow: "hidden", minHeight: 160,
      }}
    >
      <GrainRect borderRadius={14} />
      {selected && (
        <div style={{
          position: "absolute", top: 12, right: 14,
          background: "rgba(184,149,106,0.12)", border: "1px solid rgba(184,149,106,0.35)",
          borderRadius: 20, fontSize: 9, padding: "3px 9px",
          color: "#b8956a", letterSpacing: 1, fontWeight: 600,
          textTransform: "uppercase", fontFamily: "'DM Mono', monospace",
        }}>selected</div>
      )}
      <div style={{ fontSize: 10, color: "#555", marginBottom: 6, letterSpacing: 0.6, fontFamily: "'DM Mono', monospace" }}>{product["Brand"]}</div>
      <div style={{ fontSize: 17, fontWeight: 600, color: "#e2e2e2", marginBottom: 4, lineHeight: 1.25, letterSpacing: -0.2 }}>{product["Sub_Category"]}</div>
      <div style={{ fontSize: 10, color: "#444", marginBottom: 16, fontFamily: "'DM Mono', monospace" }}>{product["Grade"]}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
        <div>
          <div style={{ fontSize: 9, color: "#484848", marginBottom: 3, letterSpacing: 0.8, textTransform: "uppercase" }}>Price / Tonne</div>
          <div style={{ fontSize: 16, fontWeight: 600, color: "#b8956a", fontFamily: "'DM Mono', monospace" }}>
            ₹{product["Selling_Price_per_Tonne_INR"].toLocaleString("en-IN")}
          </div>
        </div>
        <StarRating rating={product["Customer_Rating"]} />
      </div>
      <div style={{ marginTop: 14, height: 1.5, borderRadius: 99, background: "rgba(255,255,255,0.05)" }}>
        <div style={{
          height: "100%", borderRadius: 99,
          background: "linear-gradient(90deg, rgba(184,149,106,0.55), rgba(184,149,106,0.1))",
          width: `${Math.round(product["popularity_score"] * 100)}%`,
          transition: "width .4s ease",
        }} />
      </div>
    </div>
  );
}

function SimilarCard({ product }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        position: "relative",
        background: "rgba(255,255,255,0.04)",
        border: hovered ? "1px solid rgba(255,255,255,0.45)" : "1px solid rgba(255,255,255,0.08)",
        boxShadow: hovered ? "0 0 0 1px rgba(255,255,255,0.07), 0 0 18px rgba(255,255,255,0.1), 0 0 38px rgba(255,255,255,0.05)" : "none",
        borderRadius: 12, padding: "16px 18px", overflow: "hidden",
        transition: "border .18s, box-shadow .18s",
      }}
    >
      <GrainRect borderRadius={12} />
      <div style={{ fontSize: 10, color: "#484848", marginBottom: 5, letterSpacing: 0.5, fontFamily: "'DM Mono', monospace" }}>{product["Brand"]}</div>
      <div style={{ fontSize: 14, fontWeight: 500, color: "#d2d2d2", marginBottom: 4, letterSpacing: -0.1 }}>{product["Sub_Category"]}</div>
      <div style={{ fontSize: 10, color: "#383838", marginBottom: 12, fontFamily: "'DM Mono', monospace" }}>{product["Grade"]}</div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <span style={{ fontSize: 13, fontWeight: 600, color: "#b8956a", fontFamily: "'DM Mono', monospace" }}>
          ₹{product["Selling_Price_per_Tonne_INR"].toLocaleString("en-IN")}
        </span>
        <StarRating rating={product["Customer_Rating"]} />
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column" }}>
      <label style={{ fontSize: 10, color: "#484848", marginBottom: 8, letterSpacing: 1.2, textTransform: "uppercase", fontFamily: "'DM Mono', monospace" }}>{label}</label>
      {children}
    </div>
  );
}

export default function App() {
  const [options, setOptions]       = useState({});
  const [segment, setSegment]       = useState("");
  const [region, setRegion]         = useState("");
  const [sector, setSector]         = useState("");
  const [volume, setVolume]         = useState("");
  const [loading, setLoading]       = useState(false);
  const [recs, setRecs]             = useState([]);
  const [selected, setSelected]     = useState(null);
  const [similar, setSimilar]       = useState([]);
  const [simLoading, setSimLoading] = useState(false);
  const [error, setError]           = useState("");

  useEffect(() => {
    fetch(`${API}/options`)
      .then(r => r.json())
      .then(setOptions)
      .catch(() => setError("Cannot reach Flask API. Make sure app.py is running on port 5000."));
  }, []);

  const handleSubmit = async () => {
    if (!segment || !region || !sector || !volume) { setError("Please fill all fields."); return; }
    setError(""); setLoading(true); setRecs([]); setSelected(null); setSimilar([]);
    try {
      const res = await fetch(`${API}/recommend`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ customer_segment: segment, region, application_sector: sector, sales_volume: parseFloat(volume) }),
      });
      const data = await res.json();
      setRecs(data.recommendations);
    } catch { setError("API error. Is Flask running?"); }
    setLoading(false);
  };

  const handleSelect = async (subcategory) => {
    if (selected === subcategory) { setSelected(null); setSimilar([]); return; }
    setSelected(subcategory); setSimLoading(true);
    try {
      const res = await fetch(`${API}/similar`, {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ subcategory }),
      });
      const data = await res.json();
      setSimilar(data.similar);
    } catch { setError("Could not fetch similar products."); }
    setSimLoading(false);
  };

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(180deg, #141414 0%, #0f0f0f 30%, #0a0a0a 60%, #060606 85%, #030303 100%)", color: "#e2e2e2", fontFamily: "'Poppins', sans-serif" }}>
      <svg style={{ position: "fixed", width: 0, height: 0 }} aria-hidden="true">
        <defs>
          <filter id="grain-global">
            <feTurbulence type="fractalNoise" baseFrequency="0.72" numOctaves="4" stitchTiles="stitch"/>
            <feColorMatrix type="saturate" values="0"/>
            <feBlend in="SourceGraphic" mode="overlay"/>
          </filter>
        </defs>
      </svg>

      <div style={{ padding: "26px 52px", borderBottom: "1px solid rgba(255,255,255,0.05)", display: "flex", alignItems: "baseline", gap: 10 }}>
        <span style={{ fontSize: 20, fontWeight: 700, color: "#e2e2e2", letterSpacing: -0.3 }}>Tata Steel</span>
        <span style={{ fontSize: 20, fontWeight: 300, color: "#404040", letterSpacing: -0.2 }}>Product Recommender</span>
      </div>

      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "40px 52px" }}>
        <div style={{ position: "relative", background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 20, padding: "28px 32px", marginBottom: 40 }}>
          <div style={{ position: "absolute", inset: 0, borderRadius: 20, overflow: "hidden", pointerEvents: "none" }}><GrainRect borderRadius={20} /></div>
          <div style={{ fontSize: 10, color: "#484848", letterSpacing: 1.5, textTransform: "uppercase", marginBottom: 22, fontFamily: "'DM Mono', monospace" }}>Customer Profile</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 20, alignItems: "start", marginBottom: 24 }}>
            <Field label="Segment">
              <CustomSelect value={segment} onChange={setSegment} options={options.segments || []} placeholder="Select" />
            </Field>
            <Field label="Region">
              <CustomSelect value={region} onChange={setRegion} options={options.regions || []} placeholder="Select" />
            </Field>
            <Field label="Application Sector">
              <CustomSelect value={sector} onChange={setSector} options={options.sectors || []} placeholder="Select" />
            </Field>
            <Field label="Sales Volume (Tonnes)">
              <input
                type="number" value={volume} placeholder="e.g. 2000"
                onChange={e => setVolume(e.target.value)}
                style={{
                  width: "100%", padding: "10px 14px", boxSizing: "border-box",
                  background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: 10, color: "#d2d2d2", fontSize: 13, outline: "none",
                  fontFamily: "'Poppins', sans-serif", height: 42,
                }}
              />
            </Field>
          </div>
          {error && <div style={{ color: "#b85555", fontSize: 11, marginBottom: 14, fontFamily: "'DM Mono', monospace" }}>{error}</div>}
          <button
            onClick={handleSubmit} disabled={loading}
            style={{
              background: loading ? "rgba(255,255,255,0.03)" : "rgba(184,149,106,0.1)",
              border: `1px solid ${loading ? "rgba(255,255,255,0.06)" : "rgba(184,149,106,0.28)"}`,
              borderRadius: 10, padding: "10px 28px",
              color: loading ? "#3a3a3a" : "#b8956a",
              fontSize: 12, fontWeight: 500, cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: 0.4, fontFamily: "'Poppins', sans-serif", transition: "all .2s",
            }}
          >{loading ? "Searching…" : "Get Recommendations →"}</button>
        </div>

        {recs.length > 0 && (
          <>
            <div style={{ fontSize: 10, color: "#404040", letterSpacing: 1.2, marginBottom: 18, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
              Click any card to see similar products
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(210px, 1fr))", gap: 14, marginBottom: 40 }}>
              {recs.map((p, i) => <ProductCard key={i} product={p} onSelect={handleSelect} selected={selected === p["Sub_Category"]} />)}
            </div>
          </>
        )}

        {selected && (
          <div style={{ position: "relative", background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 20, padding: "24px 28px", overflow: "hidden" }}>
            <GrainRect borderRadius={20} />
            <div style={{ fontSize: 10, color: "#484848", letterSpacing: 1.2, marginBottom: 18, fontFamily: "'DM Mono', monospace", textTransform: "uppercase" }}>
              Similar to <span style={{ color: "#b8956a" }}>{selected}</span>
            </div>
            {simLoading ? (
              <div style={{ color: "#383838", fontSize: 11, fontFamily: "'DM Mono', monospace" }}>Loading…</div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(190px, 1fr))", gap: 12 }}>
                {similar.map((p, i) => <SimilarCard key={i} product={p} />)}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
