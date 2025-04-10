import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { companyLogos } from "./data/companyLogos.js";
import dotenv from 'dotenv';

const termLengthToCategory = (term) => {
  const map = {
    "10": "3",
    "15": "4",
    "20": "5",
    "25": "6",
    "30": "7",
    "35": "9",
    "40": "0"
  };
  return map[term] || "5"; // default to 20-year if undefined
};

const zipToState = (zip) => {
  return "0"; 
};
 

const companyLogoMap = companyLogos.reduce((acc, item) => {
  acc[item.Name] = item.Logos?.Medium;
  return acc;
}, {});


const fallbackLogo = "https://static.wixstatic.com/media/586e34_2f4819e07ef240dfaaaa4cd81f4ad4d2~mv2.png";

const CalculatorForm = () => {
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
  });

  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [userContact, setUserContact] = useState({ name: "", email: "" });
  const resultsRef = useRef(null);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setResults([]);

    try {
      const age = parseInt(formData.age || "30");
      const feet = parseInt(formData.heightFeet || "0");
      const inches = parseInt(formData.heightInches || "0");
      const weight = parseInt(formData.weight || "180");
      const heightInInches = (feet * 12) + inches;
      const bmi = (weight / (heightInInches * heightInInches)) * 703;

      let health = "PP";
      let smokerStatus = formData.smoker;

      if (formData.nicotinePouch === "Y" && formData.smoker === "N") {
        health = "RP";
        smokerStatus = "N";
      }

      if (formData.nicotinePouch === "Y" && formData.smoker === "Y") {
        health = "R";
        smokerStatus = "Y";
      }

      if (formData.nicotinePouch === "N" && formData.smoker === "Y") {
        health = "R";
        smokerStatus = "Y";
      }

      if (formData.nicotinePouch === "N" && formData.smoker === "N") {
        health = (bmi < 30 && age < 60) ? "PP" : "RP";
        smokerStatus = "N";
      }

      const payload = {
        BirthMonth: "1", // Default if not provided
        BirthYear: (new Date().getFullYear() - age).toString(),
        Birthday: "1", // Default if not provided
        CompRating: "4",
        FaceAmount: formData.faceAmount,
        Health: health,
        LANGUAGE: "E",
        ModeUsed: "M",
        NewCategory: termLengthToCategory(formData.termLength),
        REMOTE_IP: "74.113.157.69",
        Sex: formData.sex,
        Smoker: smokerStatus,
        SortOverride1: "A",
        State: zipToState(formData.zipCode),
        ZipCode: formData.zipCode,
        UserLocation: "json"
      };
      
      
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/quote`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ COMPULIFE: payload }),
      });
      

if (!response.ok) {
  const errorText = await response.text();
  console.error("Raw API error:", errorText);
  throw new Error("API Error");
}

const json = await response.json();
const quotes = json?.Compulife_ComparisonResults?.Compulife_Results || [];

      const filtered = quotes.filter(
        (q) => q.Compulife_company && (q.Compulife_premiumM || q.Compulife_premiumAnnual)
      );

      const sorted = filtered.sort((a, b) => {
        const priceA = parseFloat(a.Compulife_premiumM || a.Compulife_premiumAnnual || "9999");
        const priceB = parseFloat(b.Compulife_premiumM || b.Compulife_premiumAnnual || "9999");
        return priceA - priceB;
      });

      setResults(sorted.slice(0, 15));
    } catch (err) {
      console.error("Error fetching quotes:", err);
      setError("There was a problem retrieving your quote. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (results.length > 0 && resultsRef.current) {
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

  const handleModalSubmit = () => {
    const { name, email } = userContact;
    const { Compulife_company } = selectedQuote;
    const term = formData.termLength;
    const amount = Number(formData.faceAmount).toLocaleString();

    const body = `I am interested in submitting an application for ${name}, ${term}-year term, $${amount}, ${Compulife_company}.%0D%0A%0D%0AEmail: ${email}`;
    const mailto = `mailto:mattmims@insurems.com?subject=Quote Request - ${Compulife_company}&body=${encodeURIComponent(body)}`;
    console.log("📧 Triggering mailto:", mailto);
    window.location.href = mailto;
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-5xl bg-white shadow-2xl rounded-3xl px-10 py-12 border border-green-100 relative"
      >
        <h2 className="text-4xl font-extrabold text-center text-[#407C51] mb-10">
          🛡️ Life Insurance Quotes
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <label>ZIP Code<input type="text" name="zipCode" value={formData.zipCode} onChange={handleChange} className="input" /></label>
          <label>Age<input type="number" name="age" value={formData.age} onChange={handleChange} className="input" /></label>
          <label>Height (ft & in)
            <div className="flex gap-2">
              <input type="number" name="heightFeet" placeholder="ft" value={formData.heightFeet} onChange={handleChange} className="input w-1/2" />
              <input type="number" name="heightInches" placeholder="in" value={formData.heightInches} onChange={handleChange} className="input w-1/2" />
            </div>
          </label>
          <label>Weight (lbs)<input type="number" name="weight" value={formData.weight} onChange={handleChange} className="input" /></label>
          <label>Coverage Amount
            <select name="faceAmount" value={formData.faceAmount} onChange={handleChange} className="input">
              {[100000,200000,300000,400000,500000,750000,1000000,1500000,2000000].map(val => (
                <option key={val} value={val}>${val.toLocaleString()}</option>
              ))}
            </select>
          </label>
          <label>Term Length
            <select name="termLength" value={formData.termLength} onChange={handleChange} className="input">
              {[10,15,20,25,30].map(val => (
                <option key={val} value={val}>{val} Years</option>
              ))}
            </select>
          </label>
          <label>Gender
            <select name="sex" value={formData.sex} onChange={handleChange} className="input">
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </label>
          <label>Do you smoke?
            <select name="smoker" value={formData.smoker} onChange={handleChange} className="input">
              <option value="N">No</option>
              <option value="Y">Yes</option>
            </select>
          </label>
          <label>Nicotine Pouches?
            <select name="nicotinePouch" value={formData.nicotinePouch} onChange={handleChange} className="input">
              <option value="N">No</option>
              <option value="Y">Yes</option>
            </select>
          </label>
          <button type="submit" disabled={loading} className="md:col-span-2 mt-4 w-full bg-[#407C51] text-white py-3 rounded-xl font-semibold text-lg">
            {loading ? "Loading..." : "Get My Quote"}
          </button>
        </form>

        {error && <p className="mt-5 text-sm text-red-600 text-center">{error}</p>}

        <AnimatePresence>
          {results.length > 0 && (
            <motion.div ref={resultsRef} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="mt-12">
              <h3 className="text-xl font-bold text-gray-800 text-center mb-2">📋 Top 15 Cheapest Quotes</h3>
              <div className="grid md:grid-cols-3 gap-6 mt-6">
                {results.map((quote, idx) => (
                  <div key={idx} className="bg-white border border-gray-200 rounded-xl p-6 shadow-md hover:shadow-lg transition flex flex-col items-center text-center">
                    <img src={companyLogoMap[quote.Compulife_company] || fallbackLogo} alt={quote.Compulife_company} className="w-16 h-16 object-contain mb-4" />
                    <p className="text-lg font-semibold text-[#407C51] mb-1">{quote.Compulife_company}</p>
                    <p className="text-sm text-gray-500 mb-3">{quote.Compulife_product}</p>
                    <p className="text-xl font-bold text-green-600 mb-4">
                      {quote.Compulife_premiumM ? `$${parseFloat(quote.Compulife_premiumM).toFixed(2)} /mo` : `$${parseFloat(quote.Compulife_premiumAnnual).toFixed(2)} /yr`}
                    </p>
                    <button onClick={() => openQuoteForm(quote)} className="bg-[#407C51] hover:bg-[#326c43] text-white text-sm px-5 py-2 rounded-lg shadow-sm transition">
                      Request Coverage
                    </button>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showModal && selectedQuote && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[9999]">
            <div className="bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-xl font-bold mb-4">Request Coverage</h3>
              <p className="mb-2"><strong>Company:</strong> {selectedQuote.Compulife_company}</p>
              <p className="mb-2"><strong>Product:</strong> {selectedQuote.Compulife_product}</p>
              <p className="mb-4"><strong>Premium:</strong> {selectedQuote.Compulife_premiumM ? `$${parseFloat(selectedQuote.Compulife_premiumM).toFixed(2)} /mo` : `$${parseFloat(selectedQuote.Compulife_premiumAnnual).toFixed(2)} /yr`}</p>
              <input type="text" name="name" placeholder="Your Name" autoComplete="name" value={userContact.name} onChange={handleModalChange} className="w-full mb-2 p-2 border rounded" />
              <input type="email" name="email" placeholder="Your Email" autoComplete="email" value={userContact.email} onChange={handleModalChange} className="w-full mb-4 p-2 border rounded" />
              <div className="flex justify-end gap-2">
                <button onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
                <button onClick={handleModalSubmit} className="px-4 py-2 bg-[#407C51] text-white rounded">Send</button>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default CalculatorForm;


