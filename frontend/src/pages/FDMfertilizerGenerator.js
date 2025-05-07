import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/header";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

export default function FertilizerSchedule() {
  const [region, setRegion] = useState("");
  const [yieldValue, setYieldValue] = useState("");
  const [area, setArea] = useState("");
  const [schedule, setSchedule] = useState(null);
  const resultRef = useRef();
  const navigate = useNavigate();

  const fertilizerData = {
    "mid/up country": [
      { max: 130, formula: "VP/UM 910 : 2 * 75kg (Twice per year)", composition: { urea: 587, erp: 123, mop: 200 } },
      { max: 249, formula: "VP/UM 910 : 3 * 75kg (3 times per year)", composition: { urea: 587, erp: 123, mop: 200 } },
      { max: 374, formula: "VP/UM 910 : 4 * 75kg (4 times per year)", composition: { urea: 587, erp: 123, mop: 200 } },
      { max: 524, formula: "VP/UM 1020 : 4 * 100kg (4times per year)", composition: { urea: 695, erp: 125, mop: 200 } },
      { max: Infinity, formula: "VP/UM 1020 : 4 * 125kg (4times per year)", composition: { urea: 695, erp: 125, mop: 200 } }
    ],
    "low country": [
      { max: 130, formula: "VP/LC 880 : 2 * 75kg (Twice per year)", composition: { urea: 587, erp: 126, mop: 167 } },
      { max: 249, formula: "VP/LC 880 : 3 * 75kg (3 times per year)", composition: { urea: 587, erp: 126, mop: 167 } },
      { max: 374, formula: "VP/LC 880 : 4 * 75kg (4 times per year)", composition: { urea: 587, erp: 126, mop: 167 } },
      { max: 524, formula: "VP/LC 1075 : 4 * 100kg (4 times per year)", composition: { urea: 782, erp: 126, mop: 167 } },
      { max: Infinity, formula: "VP/LC 1075 : 4 * 125kg (4 times per year)", composition: { urea: 782, erp: 126, mop: 167 } }
    ],
    "Uva": [
      { max: 130, formula: "VP/Uva 945 : 2 * 75kg (Twice per year)", composition: { urea: 587, erp: 125, mop: 233 } },
      { max: 249, formula: "VP/Uva 945 : 3 * 75kg (3 times per year)", composition: { urea: 587, erp: 125, mop: 233 } },
      { max: 374, formula: "VP/Uva 945 : 3 * 100kg (4 times per year)", composition: { urea: 587, erp: 125, mop: 233 } },
      { max: 524, formula: "VP/Uva 1055 : 4 * 100kg (4 times per year)", composition: { urea: 695, erp: 127, mop: 233 } },
      { max: Infinity, formula: "VP/Uva 1055 : 4 * 125kg (4 times per year)", composition: { urea: 695, erp: 127, mop: 233 } }
    ]
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const selectedRange = fertilizerData[region].find(item => yieldValue <= item.max);
    const calculatedComposition = {
      urea: selectedRange.composition.urea * area,
      erp: selectedRange.composition.erp * area,
      mop: selectedRange.composition.mop * area
    };
    setSchedule({ formula: selectedRange.formula, composition: calculatedComposition });
  };

  const handleReset = () => {
    setRegion("");
    setYieldValue("");
    setArea("");
    setSchedule(null);
  };

  const downloadPDF = async () => {
    const input = resultRef.current;
    const button = input.querySelector(".no-print");

    if (button) button.style.display = "none"; // hide button temporarily

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const width = pdf.internal.pageSize.getWidth();
    const height = (canvas.height * width) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, width, height);
    pdf.save("fertilizer-schedule.pdf");

    if (button) button.style.display = "block"; // restore button
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* Inline style for print control */}
      <style>{`.no-print { display: block; } .print-hide { display: none !important; }`}</style>

      <div className="flex bg-green-100 min-h-screen p-10">
        <div className="w-1/2 bg-white p-5 rounded shadow border border-green-400">
          {/* Back Button */}
          <button
            onClick={() => navigate(-1)}
            className="mb-4 px-4 py-2 bg-green-700 text-white rounded hover:bg-green-600"
          >
            Back
          </button>

          <h2 className="text-xl font-bold text-green-700">Fertilizer Schedule Generator</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-green-700">Region:</label>
              <select value={region} onChange={(e) => setRegion(e.target.value)} className="border p-2 w-full border-green-400">
                <option value="">Select Region</option>
                <option value="mid/up country">Mid/Up Country</option>
                <option value="low country">Low Country</option>
                <option value="Uva">Uva</option>
              </select>
            </div>
            <div>
              <label className="block text-green-700">Average Yield (kg/ac/month):</label>
              <input type="number" value={yieldValue} onChange={(e) => setYieldValue(e.target.value)} className="border p-2 w-full border-green-400" />
            </div>
            <div>
              <label className="block text-green-700">Estate Area (acres):</label>
              <input type="number" value={area} onChange={(e) => setArea(e.target.value)} className="border p-2 w-full border-green-400" />
            </div>
            <button type="submit" className="bg-green-700 text-white p-2 w-full rounded">Generate Schedule</button>
            <button type="button" onClick={handleReset} className="bg-black text-white p-2 w-full rounded">Reset</button>
          </form>
        </div>

        <div className="w-1/2 p-5" ref={resultRef}>
          {!schedule ? (
            <div className="bg-white p-5 rounded shadow border border-green-400">
              <h3 className="text-lg font-bold text-green-700">Results will appear here</h3>
            </div>
          ) : (
            <div className="bg-white p-5 rounded shadow border border-green-400">
              <h3 className="text-lg font-bold text-green-700">Schedule Result</h3><br />
              <h3><b>Fertilizer Mixture</b></h3>
              <p className="text-black">{schedule.formula}</p><br />
              <h3><b>Composition of Ingredients for full Area (per 1 time)</b></h3>
              <p className="text-black">Urea: {schedule.composition.urea} parts</p>
              <p className="text-black">ERP: {schedule.composition.erp} parts</p>
              <p className="text-black">MOP: {schedule.composition.mop} parts</p><br />
              <h3>
                The recommended months for fertilizing are <b>October, November, and December</b>, as these months coincide with the rainy season. The rainfall during this period helps in the effective absorption of nutrients from the fertilizer, ensuring optimal growth for your plants. 🌱
              </h3>

              {/* Download PDF Button - Hidden during export */}
              <button onClick={downloadPDF} className="no-print mt-4 bg-green-700 text-white p-2 rounded hover:bg-green-600">
                Download as PDF
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
