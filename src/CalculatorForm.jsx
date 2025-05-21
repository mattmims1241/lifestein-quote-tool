import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { companyLogos } from "./data/companyLogos.js";
import axios from "axios";
import './index.css';

// Check if environment variable is working
console.log('API key available:', import.meta.env.VITE_BREVO_API_KEY ? 'Yes' : 'No');

// Add keyframes for spinner animation
const spinAnimation = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;

// Create a component to safely inject styles
const StyleInjector = () => {
  useEffect(() => {
    // Only add keyframes in browser environment
    const styleSheet = document.createElement('style');
    styleSheet.type = 'text/css';
    styleSheet.innerText = spinAnimation;
    document.head.appendChild(styleSheet);

    // Cleanup on unmount
    return () => {
      if (styleSheet && document.head.contains(styleSheet)) {
        document.head.removeChild(styleSheet);
      }
    };
  }, []);
  
  return null;
};

// Premium styles directly in component
const styles = {
  container: {
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "2rem",
    background: "linear-gradient(135deg, #f5f7fa 0%, #e4edf5 100%)",
    fontFamily: "'Segoe UI', Roboto, 'Helvetica Neue', sans-serif",
    '@media (max-width: 768px)': {
      padding: "1rem"
    }
  },
  card: {
    width: "100%",
    maxWidth: "850px",
    padding: "2.5rem",
    borderRadius: "1.2rem",
    boxShadow: "0 20px 60px rgba(0, 0, 0, 0.1), 0 1px 2px rgba(0, 0, 0, 0.05)",
    background: "rgba(255, 255, 255, 0.95)",
    backdropFilter: "blur(10px)",
    border: "1px solid rgba(255, 255, 255, 0.2)",
    overflow: "hidden",
    position: "relative",
    '@media (max-width: 768px)': {
      padding: "1.5rem"
    },
    '@media (max-width: 480px)': {
      padding: "1.25rem"
    }
  },
  cardAccent: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "8px",
    background: "linear-gradient(90deg, #0a855c, #34d399)"
  },
  header: {
    textAlign: "center",
    marginBottom: "2.5rem",
    '@media (max-width: 768px)': {
      marginBottom: "1.5rem"
    }
  },
  title: {
    fontSize: "2.5rem",
    fontWeight: "800",
    color: "#0a855c",
    marginBottom: "0.75rem",
    '@media (max-width: 768px)': {
      fontSize: "2rem"
    },
    '@media (max-width: 480px)': {
      fontSize: "1.75rem"
    }
  },
  subtitle: {
    fontSize: "1.1rem",
    color: "#64748b",
    fontWeight: "500",
    '@media (max-width: 480px)': {
      fontSize: "1rem"
    }
  },
  form: {
    display: "grid",
    gridTemplateColumns: "repeat(2, 1fr)",
    gap: "1.5rem",
    '@media (max-width: 768px)': {
      gridTemplateColumns: "1fr",
      gap: "1rem"
    }
  },
  fullWidth: {
    gridColumn: "span 2",
    '@media (max-width: 768px)': {
      gridColumn: "1"
    }
  },
  formGroup: {
    display: "flex",
    flexDirection: "column",
    gap: "0.5rem"
  },
  label: {
    fontWeight: "600",
    color: "#334155",
    fontSize: "0.95rem"
  },
  input: {
    padding: "0.75rem 1rem",
    borderRadius: "0.75rem",
    border: "1.5px solid #e2e8f0",
    fontSize: "1rem",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    outline: "none",
    width: "100%",
    boxSizing: "border-box"
  },
  inputFocus: {
    border: "1.5px solid #0a855c",
    boxShadow: "0 0 0 4px rgba(10, 133, 92, 0.15)"
  },
  select: {
    padding: "0.75rem 1rem",
    borderRadius: "0.75rem", 
    border: "1.5px solid #e2e8f0",
    fontSize: "1rem",
    backgroundColor: "#f8fafc",
    transition: "all 0.2s ease",
    outline: "none",
    width: "100%",
    appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23475569'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7' /%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 1rem center",
    backgroundSize: "1rem",
    paddingRight: "2.5rem"
  },
  flexRow: {
    display: "flex",
    gap: "1rem",
    '@media (max-width: 480px)': {
      flexDirection: "column",
      gap: "0.5rem"
    }
  },
  button: {
    gridColumn: "span 2",
    marginTop: "1.5rem",
    padding: "1rem",
    backgroundColor: "#0a855c",
    color: "white",
    fontWeight: "600",
    fontSize: "1.1rem",
    borderRadius: "0.75rem",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    boxShadow: "0 4px 12px rgba(10, 133, 92, 0.15)",
    outline: "none",
    '@media (max-width: 768px)': {
      gridColumn: "1",
      marginTop: "1rem",
      fontSize: "1rem"
    }
  },
  buttonHover: {
    backgroundColor: "#056c4a",
    transform: "translateY(-2px)",
    boxShadow: "0 6px 16px rgba(10, 133, 92, 0.25)"
  },
  buttonDisabled: {
    backgroundColor: "#9ca3af",
    transform: "none",
    boxShadow: "none",
    cursor: "not-allowed",
    opacity: "0.7"
  },
  resultCard: {
    padding: "1.5rem",
    borderRadius: "1rem",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.05)",
    border: "1px solid rgba(226, 232, 240, 0.8)",
    display: "flex", 
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    backgroundColor: "white",
    transition: "all 0.3s ease",
    '@media (max-width: 480px)': {
      padding: "1rem"
    }
  },
  resultCardHover: {
    transform: "translateY(-5px)",
    boxShadow: "0 12px 24px rgba(0, 0, 0, 0.1)"
  },
  resultsTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    textAlign: "center",
    marginBottom: "1.5rem",
    color: "#0f172a",
    '@media (max-width: 480px)': {
      fontSize: "1.25rem",
      marginBottom: "1rem"
    }
  },
  price: {
    fontSize: "1.25rem",
    fontWeight: "700",
    color: "#0a855c",
    margin: "0.75rem 0",
    '@media (max-width: 480px)': {
      fontSize: "1.1rem",
      margin: "0.5rem 0"
    }
  },
  ctaButton: {
    backgroundColor: "#0a855c",
    color: "white",
    padding: "0.5rem 1rem",
    borderRadius: "0.5rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    marginTop: "0.5rem",
    transition: "all 0.2s ease"
  },
  ctaButtonHover: {
    backgroundColor: "#056c4a"
  },
  modal: {
    position: "fixed",
    inset: "0",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: "9999",
    backdropFilter: "blur(5px)",
    padding: "1rem",
    boxSizing: "border-box"
  },
  modalContent: {
    backgroundColor: "white",
    padding: "2rem",
    borderRadius: "1rem",
    maxWidth: "450px",
    width: "100%",
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
    '@media (max-width: 480px)': {
      padding: "1.5rem"
    }
  },
  modalTitle: {
    fontSize: "1.5rem",
    fontWeight: "700",
    marginBottom: "1rem",
    color: "#0f172a",
    '@media (max-width: 480px)': {
      fontSize: "1.25rem"
    }
  },
  modalInput: {
    width: "100%",
    padding: "0.75rem 1rem",
    marginBottom: "1rem",
    borderRadius: "0.5rem",
    border: "1.5px solid #e2e8f0",
    fontSize: "1rem",
    boxSizing: "border-box"
  },
  buttonGroup: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "1rem",
    marginTop: "1rem",
    '@media (max-width: 480px)': {
      flexDirection: "column",
      gap: "0.5rem"
    }
  },
  cancelButton: {
    padding: "0.75rem 1rem",
    backgroundColor: "#e2e8f0",
    color: "#475569",
    borderRadius: "0.5rem",
    fontWeight: "600",
    border: "none",
    cursor: "pointer",
    transition: "all 0.2s ease",
    '@media (max-width: 480px)': {
      order: "2"
    }
  },
  cancelButtonHover: {
    backgroundColor: "#cbd5e1"
  },
  errorMessage: {
    marginTop: "1.25rem",
    color: "#dc2626",
    textAlign: "center",
    fontSize: "0.875rem",
    fontWeight: "500"
  },
  resultsGrid: {
    display: "grid", 
    gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", 
    gap: "1.5rem", 
    marginTop: "1.5rem",
    '@media (max-width: 768px)': {
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "1rem"
    },
    '@media (max-width: 480px)': {
      gridTemplateColumns: "1fr",
      gap: "1rem"
    }
  }
};

const termLengthToCategory = {
  "10": "3",
  "15": "4",
  "20": "5",
  "25": "6",
  "30": "7",
  "35": "9",
  "40": "0"
};

const companyLogoMap = companyLogos.reduce((acc, item) => {
  acc[item.Name] = item.Logos?.Medium;
  return acc;
}, {});

const fallbackLogo = "https://static.wixstatic.com/media/586e34_2f4819e07ef240dfaaaa4cd81f4ad4d2~mv2.png";

// Custom focus hook
const useFocus = (initialState = false) => {
  const [isFocused, setIsFocused] = useState(initialState);
  
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);
  
  return { isFocused, handleFocus, handleBlur };
};

// Since inline media queries don't work with React's inline styles, let's implement a simple responsive solution
const useResponsiveStyles = () => {
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);
  
  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  
  const getResponsiveStyle = (styleObj) => {
    let finalStyle = {...styleObj};
    delete finalStyle['@media (max-width: 768px)'];
    delete finalStyle['@media (max-width: 480px)'];
    
    if (windowWidth <= 768 && styleObj['@media (max-width: 768px)']) {
      finalStyle = {...finalStyle, ...styleObj['@media (max-width: 768px)']};
    }
    
    if (windowWidth <= 480 && styleObj['@media (max-width: 480px)']) {
      finalStyle = {...finalStyle, ...styleObj['@media (max-width: 480px)']};
    }
    
    return finalStyle;
  };
  
  return { getResponsiveStyle };
};

const CalculatorForm = () => {
  const { getResponsiveStyle } = useResponsiveStyles();
  const [formData, setFormData] = useState({
    zipCode: "35243",
    age: "",
    faceAmount: "500000",
    sex: "M",
    smoker: "N",
    nicotinePouch: "N",
    termLength: "20",
    heightFeet: "",
    heightInches: "",
    weight: "",
    alcoholUse: "N"
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [userContact, setUserContact] = useState({ name: "", email: "" });
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [hoverIndex, setHoverIndex] = useState(null);
  const resultsRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    const age = parseInt(formData.age) || 30;
    const feet = parseInt(formData.heightFeet) || 5;
    const inches = parseInt(formData.heightInches) || 10;
    const weight = parseInt(formData.weight) || 180;
    const heightInInches = (feet * 12) + inches;
    const birthYear = new Date().getFullYear() - age;

    let health = "PP";
    const bmi = (weight / (heightInInches * heightInInches)) * 703;
    if (formData.nicotinePouch === "Y") {
      health = bmi < 30 ? "RP" : "R";
    } else {
      health = bmi < 25 ? "PP" : bmi < 30 ? "P" : bmi < 35 ? "RP" : "R";
    }

    // Format the payload according to the CompuLife API requirements
    const payload = {
      State: 5, // Changed from 0 to 5 based on curl example
      ZipCode: formData.zipCode,
      BirthMonth: 1,
      Birthday: 1,
      BirthYear: birthYear,
      Sex: formData.sex,
      Smoker: formData.smoker,
      Health: health,
      NewCategory: termLengthToCategory[formData.termLength],
      FaceAmount: formData.faceAmount,
      ModeUsed: "M",
      SortOverride1: "A", // Changed from "M" to "A" based on curl example
      LANGUAGE: "E",
      UserLocation: "json",
      REMOTE_IP: "74.113.157.69",
      CompRating: "4", // Added based on curl example
      DoHeightWeight: "ON",
      Feet: feet,
      Inches: inches,
      Weight: weight,
      DoSubAbuse: "ON",
      Alcohol: formData.alcoholUse,
      NitocinePouch: formData.nicotinePouch
    };

    try {
      const response = await fetch(`/api/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ COMPULIFE: payload })
      });

      if (!response.ok) {
        let errorMessage = "Failed to retrieve quote";
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorData.details || errorMessage;
        } catch (e) {
          // If response is not JSON, use text instead
          errorMessage = await response.text();
        }
        
        throw new Error(errorMessage);
      }

      const json = await response.json();
      const quotes = json?.Compulife_ComparisonResults?.Compulife_Results || [];

      if (quotes.length === 0) {
        setError("No quotes available for your profile. Please adjust your criteria and try again.");
        setLoading(false);
        return;
      }

      const filtered = quotes.filter(q => q.Compulife_company && (q.Compulife_premiumM || q.Compulife_premiumAnnual));

      const sorted = filtered.sort((a, b) => {
        const aPrice = parseFloat(a.Compulife_premiumM || a.Compulife_premiumAnnual || "9999");
        const bPrice = parseFloat(b.Compulife_premiumM || b.Compulife_premiumAnnual || "9999");
        return aPrice - bPrice;
      });

      setResults(sorted.slice(0, 15));
    } catch (err) {
      console.error("Quote fetch failed:", err);
      setError(err.message || "There was a problem retrieving your quote. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results.length && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [results]);

  const openQuoteForm = (quote) => {
    setSelectedQuote(quote);
    setShowModal(true);
  };

  const handleModalChange = (e) => {
    setUserContact((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleModalSubmit = async () => {
    try {
      setLoading(true);
      const { name, email } = userContact;
      const quote = selectedQuote;
      const amount = Number(formData.faceAmount).toLocaleString();
      
      // Prepare data for server endpoint
      const emailData = {
        name,
        email,
        companyName: quote.Compulife_company,
        product: quote.Compulife_product,
        termLength: formData.termLength,
        coverageAmount: amount
      };
      
      // Send the request to our backend API
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(emailData)
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to send email');
      }
      
      console.log("Email sent successfully");
      
      // Close the modal and show success message
      setShowModal(false);
      setShowSuccessMessage(true);
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setShowSuccessMessage(false);
      }, 5000);
    } catch (error) {
      console.error("Failed to send email:", error);
      alert("There was an error sending your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Render focused styles for inputs
  const renderInput = (name, value, placeholder = "", type = "text", required = true) => {
    const focus = useFocus();
    const inputStyle = {
      ...getResponsiveStyle(styles.input),
      ...(focus.isFocused ? styles.inputFocus : {})
    };
    
    return (
      <input 
        type={type} 
        name={name} 
        value={value} 
        placeholder={placeholder}
        onChange={handleChange} 
        onFocus={focus.handleFocus}
        onBlur={focus.handleBlur}
        style={inputStyle}
        required={required}
      />
    );
  };

  return (
    <div style={getResponsiveStyle(styles.container)}>
      <StyleInjector />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        style={getResponsiveStyle(styles.card)}
      >
        <div style={styles.cardAccent}></div>
        <div style={getResponsiveStyle(styles.header)}>
          <h2 style={getResponsiveStyle(styles.title)}>🛡️ Life Insurance Quotes</h2>
          <p style={getResponsiveStyle(styles.subtitle)}>Get instant, personalized term life insurance rates</p>
        </div>
        
        <form onSubmit={handleSubmit} style={getResponsiveStyle(styles.form)}>
          <div style={styles.formGroup}>
            <label style={styles.label}>ZIP Code</label>
            {renderInput("zipCode", formData.zipCode)}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Age</label>
            {renderInput("age", formData.age, "", "number")}
          </div>
          
          <div style={{...styles.formGroup, ...getResponsiveStyle(styles.fullWidth)}}>
            <label style={styles.label}>Height (ft & in)</label>
            <div style={getResponsiveStyle(styles.flexRow)}>
              {renderInput("heightFeet", formData.heightFeet, "ft", "number")}
              {renderInput("heightInches", formData.heightInches, "in", "number")}
            </div>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Weight (lbs)</label>
            {renderInput("weight", formData.weight, "", "number")}
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Coverage Amount</label>
            <select 
              name="faceAmount" 
              value={formData.faceAmount} 
              onChange={handleChange} 
              style={getResponsiveStyle(styles.select)}
              required
            >
              {[
                10000, 
                50000, 
                100000, 
                150000, 
                200000, 
                250000, 
                300000, 
                350000, 
                400000, 
                450000, 
                500000, 
                550000, 
                600000, 
                650000, 
                700000, 
                750000, 
                800000, 
                850000, 
                900000, 
                950000, 
                1000000, 
                1250000, 
                1500000, 
                1750000, 
                2000000, 
                2500000, 
                3000000, 
                3500000, 
                4000000, 
                4500000, 
                5000000
              ].map(val => (
                <option key={val} value={val}>${val.toLocaleString()}</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Term Length</label>
            <select 
              name="termLength" 
              value={formData.termLength} 
              onChange={handleChange} 
              style={getResponsiveStyle(styles.select)}
              required
            >
              {["10", "15", "20", "25", "30", "35", "40"].map(val => (
                <option key={val} value={val}>{val} Years</option>
              ))}
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Gender</label>
            <select 
              name="sex" 
              value={formData.sex} 
              onChange={handleChange} 
              style={getResponsiveStyle(styles.select)}
              required
            >
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Do you smoke?</label>
            <select 
              name="smoker" 
              value={formData.smoker} 
              onChange={handleChange} 
              style={getResponsiveStyle(styles.select)}
              required
            >
              <option value="N">No</option>
              <option value="Y">Yes</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Nicotine Pouches?</label>
            <select 
              name="nicotinePouch" 
              value={formData.nicotinePouch} 
              onChange={handleChange} 
              style={getResponsiveStyle(styles.select)}
              required
            >
              <option value="N">No</option>
              <option value="Y">Yes</option>
            </select>
          </div>
          
          <div style={styles.formGroup}>
            <label style={styles.label}>Alcohol Use?</label>
            <select 
              name="alcoholUse" 
              value={formData.alcoholUse} 
              onChange={handleChange} 
              style={getResponsiveStyle(styles.select)}
              required
            >
              <option value="N">No</option>
              <option value="Y">Yes</option>
            </select>
          </div>
          
          <button
            type="submit"
            disabled={loading}
            style={{
              ...getResponsiveStyle(styles.button),
              ...(loading ? styles.buttonDisabled : {})
            }}
            onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.buttonHover.backgroundColor)}
            onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.button.backgroundColor)}
          >
            {loading ? "Loading..." : "Get My Quote"}
          </button>
        </form>

        {error && <p style={styles.errorMessage}>{error}</p>}

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div 
              ref={resultsRef} 
              initial={{ opacity: 0, y: 20 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0 }} 
              style={{ marginTop: "3rem" }}
            >
              <h3 style={getResponsiveStyle(styles.resultsTitle)}>📋 Top 15 Cheapest Quotes</h3>
              <div style={getResponsiveStyle(styles.resultsGrid)}>
                {results.map((q, i) => (
                  <div 
                    key={i} 
                    style={{
                      ...getResponsiveStyle(styles.resultCard),
                      ...(hoverIndex === i ? styles.resultCardHover : {})
                    }}
                    onMouseEnter={() => setHoverIndex(i)}
                    onMouseLeave={() => setHoverIndex(null)}
                  >
                    <img 
                      src={companyLogoMap[q.Compulife_company] || fallbackLogo} 
                      alt={q.Compulife_company} 
                      style={{ width: "4rem", height: "4rem", objectFit: "contain", marginBottom: "1rem" }} 
                    />
                    <p style={{ fontWeight: "600", color: "#0a855c" }}>{q.Compulife_company}</p>
                    <p style={{ color: "#64748b", fontSize: "0.9rem" }}>{q.Compulife_product}</p>
                    <p style={getResponsiveStyle(styles.price)}>
                      {q.Compulife_premiumM ? 
                        `$${parseFloat(q.Compulife_premiumM).toFixed(2)} /mo` : 
                        `$${parseFloat(q.Compulife_premiumAnnual).toFixed(2)} /yr`}
                    </p>
                    <button 
                      onClick={() => openQuoteForm(q)} 
                      style={styles.ctaButton}
                      onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.ctaButtonHover.backgroundColor}
                      onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.ctaButton.backgroundColor}
                    >
                      Request Coverage
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {showModal && selectedQuote && (
            <motion.div 
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -50 }}
              transition={{ duration: 0.3 }}
              style={styles.modal}
            >
              <div style={getResponsiveStyle(styles.modalContent)}>
                <h3 style={getResponsiveStyle(styles.modalTitle)}>Request Coverage</h3>
                <p style={{ marginBottom: "0.5rem" }}><strong>Company:</strong> {selectedQuote.Compulife_company}</p>
                <p style={{ marginBottom: "0.5rem" }}><strong>Product:</strong> {selectedQuote.Compulife_product}</p>
                <p style={{ marginBottom: "1.5rem" }}>
                  <strong>Premium:</strong> {selectedQuote.Compulife_premiumM ? 
                    `$${parseFloat(selectedQuote.Compulife_premiumM).toFixed(2)} /mo` : 
                    `$${parseFloat(selectedQuote.Compulife_premiumAnnual).toFixed(2)} /yr`}
                </p>
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Your Name" 
                  autoComplete="name" 
                  value={userContact.name} 
                  onChange={handleModalChange} 
                  style={getResponsiveStyle(styles.modalInput)} 
                />
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Your Email" 
                  autoComplete="email" 
                  value={userContact.email} 
                  onChange={handleModalChange} 
                  style={getResponsiveStyle(styles.modalInput)} 
                />
                <div style={getResponsiveStyle(styles.buttonGroup)}>
                  <button 
                    onClick={() => setShowModal(false)} 
                    style={getResponsiveStyle(styles.cancelButton)}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = styles.cancelButtonHover.backgroundColor}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = styles.cancelButton.backgroundColor}
                  >
                    Cancel
                  </button>
                  <button 
                    onClick={handleModalSubmit} 
                    style={{
                      ...styles.ctaButton,
                      ...(loading ? { opacity: 0.7, cursor: 'wait' } : {})
                    }}
                    disabled={loading}
                    onMouseOver={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.ctaButtonHover.backgroundColor)}
                    onMouseOut={(e) => !loading && (e.currentTarget.style.backgroundColor = styles.ctaButton.backgroundColor)}
                  >
                    {loading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                        <span style={{ width: '16px', height: '16px', borderRadius: '50%', borderTop: '2px solid #fff', borderRight: '2px solid transparent', animation: 'spin 1s linear infinite' }}></span>
                        Sending...
                      </div>
                    ) : (
                      'Send'
                    )}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Success Message */}
      <AnimatePresence>
        {showSuccessMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed',
              bottom: '20px',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: '#0a855c',
              color: 'white',
              padding: '1rem 2rem',
              borderRadius: '0.75rem',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              zIndex: 1000,
              fontSize: '1rem',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
              <polyline points="22 4 12 14.01 9 11.01"></polyline>
            </svg>
            Quote request sent successfully! We'll be in touch soon.
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CalculatorForm;
