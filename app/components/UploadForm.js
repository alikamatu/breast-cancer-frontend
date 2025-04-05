"use client";

import React, { useState } from "react";
import axios from "axios";
import { ClipLoader } from "react-spinners";
import { motion, AnimatePresence } from "framer-motion";

const PredictionForm = () => {
  const [prediction, setPrediction] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [patientName, setPatientName] = useState("");
  const [patientId, setPatientId] = useState("");
  const [imagePreview, setImagePreview] = useState("");
  const [fileName, setFileName] = useState("");
  const [history, setHistory] = useState([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Set file name and preview
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target.result);
    reader.readAsDataURL(file);

    const formData = new FormData();
    formData.append("image", file);

    setLoading(true);
    setPrediction("");
    setError("");

    try {
      const response = await axios.post("https://breast-cancer-backend.vercel.app/predict", formData);
      setPrediction(response.data.prediction);
    } catch (err) {
      setError("An error occurred while predicting. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateReport = async () => {
    try {
      const response = await axios.post(
        "https://breast-cancer-backend.vercel.app/generate-report",
        {
          patientName,
          patientId,
          prediction,
          image: imagePreview
        },
        { responseType: 'blob' }
      );

      // Create blob URL for the PDF
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' });
      const pdfUrl = URL.createObjectURL(pdfBlob);
      
      // Open in new tab for printing/download
      const printWindow = window.open(pdfUrl);
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (err) {
      setError("Failed to generate report. Please try again.");
      console.error("Report generation error:", err);
    }
  };

  const fetchHistory = async () => {
    try {
      const response = await axios.get("https://breast-cancer-backend.vercel.app/history");
      setHistory(response.data);
      setShowHistory(!showHistory);
    } catch (err) {
      setError("Failed to fetch history");
      console.error("History fetch error:", err);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/images/Breast-Cancer-Logo.png')] bg-cover bg-center flex items-center justify-center p-4">
      <motion.div
        className="bg-white/60 rounded-2xl shadow-xl p-8 w-full max-w-md"
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
      >
        {/* Header */}
        <motion.h1
          className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-pink-600 mb-6 text-center"
          initial={{ y: -30, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          Breast Cancer Prediction
        </motion.h1>

        {/* Patient Details Form */}
        <motion.div
          className="mb-6 space-y-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="patientName">
              Patient Name
            </label>
            <input
              id="patientName"
              type="text"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Enter patient name"
            />
          </div>
          <div>
            <label className="block text-gray-700 font-medium mb-2" htmlFor="patientId">
              Patient ID
            </label>
            <input
              id="patientId"
              type="text"
              value={patientId}
              onChange={(e) => setPatientId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition"
              placeholder="Enter patient ID"
            />
          </div>
        </motion.div>

        {/* File Upload */}
        <motion.label
          className="flex flex-col items-center justify-center w-full p-4 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg cursor-pointer shadow-lg transition-all duration-300 hover:from-indigo-600 hover:to-purple-600"
          whileHover={{ scale: 1.03, boxShadow: "0 10px 20px rgba(0, 0, 0, 0.15)" }}
          whileTap={{ scale: 0.98 }}
        >
          <span className="text-lg font-medium">Upload Image</span>
          <span className="text-sm opacity-80 mt-1">{fileName || "No file selected"}</span>
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            accept="image/*"
          />
        </motion.label>

        {/* Image Preview */}
        <AnimatePresence>
          {imagePreview && (
            <motion.div
              className="mt-4 flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.3 }}
            >
              <div className="relative">
                <img
                  src={imagePreview}
                  alt="Uploaded preview"
                  className="max-h-48 rounded-lg shadow-md border border-gray-200"
                />
                <motion.div
                  className="absolute inset-0 bg-black bg-opacity-30 rounded-lg flex items-center justify-center"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: loading ? 1 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  {loading && (
                    <ClipLoader color="#ffffff" size={30} />
                  )}
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Loading State */}
        <AnimatePresence>
          {loading && !imagePreview && (
            <motion.div
              className="flex flex-col items-center mt-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.3 }}
            >
              <ClipLoader color="#6366f1" size={50} />
              <p className="text-gray-600 mt-3 font-medium">Analyzing...</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Prediction Result */}
        <AnimatePresence>
          {prediction && (
            <motion.div
              className="mt-6 p-4 bg-green-100 rounded-lg"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="text-green-700 text-lg font-semibold">
                Prediction: <span className="font-bold">{prediction}</span>
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action Buttons */}
        <div className="mt-6 space-y-3">
          {prediction && (
            <motion.button
              onClick={handleGenerateReport}
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-indigo-700 transition"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Generate PDF Report
            </motion.button>
          )}

          <motion.button
            onClick={fetchHistory}
            className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-gray-700 transition"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {showHistory ? "Hide History" : "View History"}
          </motion.button>
        </div>

        {/* History Panel */}
        {showHistory && (
          <motion.div
            className="mt-4 p-4 bg-gray-100 rounded-lg max-h-60 overflow-y-auto"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <h3 className="font-bold text-gray-800 mb-2">Previous Predictions</h3>
            {history.length > 0 ? (
              <ul className="space-y-2">
                {history.map((item, index) => (
                  <li key={index} className="border-b border-gray-200 pb-2">
                    <p className="text-sm">
                      <span className="font-medium">{new Date(item.timestamp).toLocaleString()}:</span> {item.prediction}
                    </p>
                    {item.patientName && (
                      <p className="text-xs text-gray-600">Patient: {item.patientName}</p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-500 text-sm">No history available</p>
            )}
          </motion.div>
        )}

        {/* Error Message */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="mt-6 p-4 bg-red-100 rounded-lg text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <p className="text-red-700 text-lg font-semibold">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default PredictionForm;
