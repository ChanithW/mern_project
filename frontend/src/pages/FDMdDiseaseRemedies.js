import { useState } from "react";
import Header from "../components/header";

export default function DiseaseRemedies() {
  const [selectedDisease, setSelectedDisease] = useState("");
  const [remedies, setRemedies] = useState(null);

  const diseaseData = {
    // From disease.pdf
    "Nematodes": {
      "Nursery fumigation": {
        "Active ingredient": "Methyl Isothiocyanate/ Metam",
        "Trade name": "Metam Sodium",
        "ROP Registration No.": "D340000",
        "Dosage": "800 ml per one cube of soil",
        "Application": "Sprinkle the chemical evenly on the surface of soil heap and mix into the soil immediately",
        "PHI": "n/a"
      },
      "Prophylactic measures at planting": {
        "Active ingredient": "Fluopyram",
        "Trade name": "Velum 400 SC",
        "ROP Registration No.": "P060000",
        "Dosage": "2 L in 500 L water per ha (40 ml of solution per plant)",
        "Application": "Apply solution as soil drench after planting",
        "PHI": "n/a"
      },
      "Prophylactic measures after pruning": {
        "Active ingredient": "Fluopyram",
        "Trade name": "Velum 400 SC",
        "ROP Registration No.": "P060000",
        "Dosage": "2.5 L in 1000 L water per ha (80 ml of solution per plant)",
        "Application": "Apply solution as soil drench at tipping",
        "PHI": "n/a"
      }
    },
    "Tea Tortrix": {
      "Nursery plants": {
        "Active ingredient": "Emamectin benzoate",
        "Trade name": "Proclaim 5 SG",
        "ROP Registration No.": "H350000",
        "Dosage": "0.028% solution (2.8 g in 10 L of water), 2-4 L solution for 1000 plants",
        "Application": "Using Knapsack sprayer",
        "PHI": "n/a"
      },
      "Young tea": {
        "Active ingredient": "Emamectin benzoate",
        "Trade name": "Proclaim 5 SG",
        "ROP Registration No.": "H350000",
        "Dosage": "0.028% solution (2.8 g in 10 L of water), 140 g in 500 L of water per ha",
        "Application": "Using Knapsack sprayer",
        "PHI": "n/a"
      },
      "Mature tea fields": {
        "Active ingredient": "Emamectin benzoate",
        "Trade name": "Proclaim 5 SG",
        "ROP Registration No.": "H350000",
        "Dosage": "0.028% solution (2.8 g in 10 L of water), 252 g in 900 L of water per ha",
        "Application": "Using Knapsack sprayer",
        "PHI": "2 weeks"
      }
    },
    "Mites": {
      "Nursery plants": {
        "Active ingredient": "Sulphur 80%",
        "Trade names": "Baurs S, Kumulus S, Thiovit Jet S, Cosavet S",
        "ROP Registration No.": "5940100, 5940200, 2560000, K510000",
        "Dosage": "0.5% solution (5 g in 1 L of water), 2-4 L solution for 1000 plants",
        "Application": "Using Knapsack sprayer",
        "PHI": "n/a"
      },
      "Young tea": {
        "Active ingredient": "Sulphur 80%",
        "Trade names": "Baurs S, Kumulus S, Thiovit Jet S, Cosavet S",
        "ROP Registration No.": "5940100, 5940200, 2560000, K510000",
        "Dosage": "0.5% solution (5 g in 1 L of water), 3 kg in 600 L of water per ha",
        "Application": "Using Knapsack sprayer or Mist blower",
        "PHI": "n/a"
      },
      "Mature tea fields": {
        "Active ingredient": "Sulphur 80%",
        "Trade names": "Baurs S, Kumulus S, Thiovit Jet S, Cosavet S",
        "ROP Registration No.": "5940100, 5940200, 2560000, K510000",
        "Dosage": "0.5% solution (5 g in 1 L of water), 4.5 kg in 900 L of water per ha",
        "Application": "Using Knapsack sprayer or Mist blower",
        "PHI": "2 weeks",
        "Note": "Ensure bulking of tea from sprayed and unsprayed fields at 1:10 ratio"
      }
    },
    "Shot Hole Borer": {
      "Nursery plants": [
        {
          "Active ingredient": "Fipronil 50 SC",
          "Trade names": "Grand Fipronil, Baurs Fipronil",
          "ROP Registration No.": "9980200, 9980300",
          "Dosage": "5 ml in 4 L of water for 1000 nursery plants",
          "Application": "Spray onto susceptible stems and branches of 8-10 months old nursery plants",
          "PHI": "n/a"
        },
        {
          "Active ingredient": "Lime Sulphur",
          "Trade name": "Limbux or ordinary Lime and Sulphur",
          "ROP Registration No.": "n/a",
          "Dosage": "Lime:Sulphur 1:1 (100 g of Lime and 100 g of Sulphur in 4 L water for 1000 plants)",
          "Application": "Using Knapsack sprayer",
          "PHI": "n/a"
        }
      ],
      "Young tea": [
        {
          "Active ingredient": "Fipronil 50 SC",
          "Trade names": "Grand Fipronil, Baurs Fipronil",
          "ROP Registration No.": "9980200, 9980300",
          "Dosage": "1st Spray: 200 ml in 250 L of water per ha, 2nd Spray: 400 ml in 500 L of water per ha",
          "Application": "Spray onto susceptible stems/branches at 6-10 months and 2nd year",
          "PHI": "n/a"
        },
        {
          "Active ingredient": "Lime Sulphur",
          "Trade name": "Limbux or ordinary Lime and Sulphur",
          "ROP Registration No.": "n/a",
          "Dosage": "1st Spray: 6.25 kg of Lime and 6.25 kg of Sulphur in 250 L water per ha",
          "Application": "Using Knapsack sprayer",
          "PHI": "1 week"
        }
      ],
      "Mature tea fields": {
        "Active ingredient": "Lime Sulphur",
        "Trade name": "Limbux or ordinary Lime and Sulphur",
        "ROP Registration No.": "n/a",
        "Dosage": "25 kg of Lime and 25 kg of Sulphur in 1000 L water per ha",
        "Application": "Using Knapsack sprayer",
        "PHI": "1 week",
        "Note": "Stems/branches of pencil thickness in size are susceptible"
      }
    },
    "White Grubs": {
      "Treatment": {
        "Active ingredient": "Chlorantraniliprole 200 g/L SC",
        "Trade name": "Coragen",
        "ROP Registration No.": "N620000",
        "Dosage": "1 ml in 1 L of water (Apply 200-400 ml solution per immature plant as soil drench)",
        "PHI": "1 week"
      }
    },
    "Ants": [
      {
        "Active ingredient": "Diazinon 5% G (W/W)",
        "Trade names": "Dinoser Diazinon",
        "ROP Registration No.": "D280400",
        "Dosage": "Incorporate 10 g per square meter of soil",
        "Application": "Repeat after 2 weeks if necessary",
        "PHI": "1 week"
      },
      {
        "Active ingredient": "Diazinon 50% EC",
        "Trade names": "Diazol Diazinon",
        "ROP Registration No.": "C720000",
        "Dosage": "2 ml in 1 L of water",
        "Application": "Apply the solution onto ant nest using Knapsack sprayer",
        "PHI": "1 week"
      }
    ],
    
    // From diseas2.pdf
    "Blister Blight": {
      "Nursery": {
        "Contact Fungicides (4 day spray intervals)": [
          {
            "Active ingredient": "Copper oxide",
            "Trade name": "CIC Copper 50% WP",
            "ROP Registration No.": "N230000",
            "Dosage": "120 g/45 L water for 30,000 plants",
            "PHI": "n/a"
          },
          {
            "Active ingredient": "Copper hydroxide",
            "Trade name": "Champ Copper Hydroxide 37.5% WDG",
            "ROP Registration No.": "N690000",
            "Dosage": "45 g/45 L water",
            "PHI": "n/a"
          },
          {
            "Active ingredient": "Copper sulphate",
            "Trade name": "Cuproxat @ 345 g/L SC",
            "ROP Registration No.": "P750000",
            "Dosage": "200 ml/45 L water",
            "PHI": "n/a"
          }
        ],
        "Systemic Fungicides (10 day spray intervals)": [
          {
            "Active ingredient": "Hexaconazole",
            "Trade name": "Eraser EC",
            "ROP Registration No.": "F020100",
            "Dosage": "25 ml/45 L water",
            "PHI": "n/a"
          },
          {
            "Active ingredient": "Tebuconazole",
            "Trade name": "Folicur 250 EC",
            "ROP Registration No.": "9370100",
            "Dosage": "25 ml/45 L water",
            "PHI": "n/a"
          },
          {
            "Active ingredient": "Propiconazole",
            "Trade name": "Bumper",
            "ROP Registration No.": "N750000",
            "Dosage": "25 ml/45 L water",
            "PHI": "n/a"
          }
        ]
      },
      "Fields not in plucking": {
        "Contact Fungicides (4-5 day spray intervals)": [
          {
            "Active ingredient": "Copper oxide",
            "Trade name": "CIC Copper 50% WP",
            "ROP Registration No.": "N230000",
            "Dosage": "450-560 g/170 L water per hectare",
            "PHI": "n/a"
          },
          {
            "Active ingredient": "Copper hydroxide",
            "Trade name": "Champ Copper Hydroxide 37.5% WDG",
            "ROP Registration No.": "N690000",
            "Dosage": "136-170 g in 170 L water",
            "PHI": "n/a"
          },
          {
            "Active ingredient": "Copper sulphate",
            "Trade name": "Cuproxat @ 345 g/L SC",
            "ROP Registration No.": "P750000",
            "Dosage": "700-850 ml in 170L water",
            "PHI": "n/a"
          }
        ],
        "Systemic Fungicides (10 day spray intervals)": [
          {
            "Active ingredient": "Hexaconazole",
            "Trade name": "Eraser EC",
            "ROP Registration No.": "F020100",
            "Dosage": "85 ml/170 L water",
            "PHI": "n/a"
          },
          {
            "Active ingredient": "Tebuconazole",
            "Trade name": "Folicur 250 EC",
            "ROP Registration No.": "9370100",
            "Dosage": "85 ml/170 L water",
            "PHI": "n/a"
          },
          {
            "Active ingredient": "Propiconazole",
            "Trade name": "Bumper",
            "ROP Registration No.": "N750000",
            "Dosage": "85 ml/170 L water",
            "PHI": "n/a"
          }
        ]
      },
      "Plucking fields": {
        "Contact Fungicides (7-10 day spray intervals)": [
          {
            "Active ingredient": "Copper oxide",
            "Trade name": "CIC Copper 50% WP",
            "ROP Registration No.": "N230000",
            "Dosage": "280-420 g/170 L water per hectare",
            "PHI": "1 week"
          },
          {
            "Active ingredient": "Copper hydroxide",
            "Trade name": "Champ Copper Hydroxide 37.5% WDG",
            "ROP Registration No.": "N690000",
            "Dosage": "136-170 g/170 L water",
            "PHI": "1 week"
          },
          {
            "Active ingredient": "Copper sulphate",
            "Trade name": "Cuproxat @ 345 g/L SC",
            "ROP Registration No.": "P750000",
            "Dosage": "700-850 ml in 170L water",
            "PHI": "1 week"
          }
        ],
        "Note": "Systemic Fungicides: Not recommended for plucking fields"
      }
    },
    "Black Blight": {
      "Treatment": {
        "Active ingredient": "Copper oxide",
        "Trade name": "CIC Copper 50% WP",
        "ROP Registration No.": "N230000",
        "Dosage": "0.25% solution (25 g in 10 L of water), 450-500 L of solution per hectare",
        "Application": "Drench in new clearings using Knapsack sprayer",
        "Remarks": "If rain continues, second spraying should be undertaken after 14 days",
        "PHI": "1 week"
      },
      "Alternative Treatments": [
        {
          "Active ingredient": "Copper hydroxide",
          "Trade name": "Champ Copper Hydroxide 37.5% WDG",
          "ROP Registration No.": "N690000",
          "Dosage": "0.25% solution (25 g in 10 L of water)"
        },
        {
          "Active ingredient": "Copper sulphate",
          "Trade name": "Cuproxat @ 345 g/L SC",
          "ROP Registration No.": "P750000",
          "Dosage": "0.25% solution (25 ml in 10 L of water)"
        }
      ],
      "Note": "This disease is confined to Low country regions"
    },
    "Red Rust": {
      "Treatment": {
        "Active ingredient": "Copper oxide",
        "Trade name": "CIC Copper 50% WP",
        "ROP Registration No.": "N230000",
        "Dosage": "0.25% solution (25 g in 10 L of water), 170 L of solution per hectare",
        "Application": "Apply three rounds per year",
        "Remarks": "For young tea: First spray in late April, Second spray in May, Third spray in June",
        "PHI": "1 week",
        "Note": "Essential to wet the green stems and older wood with the spray solution"
      },
      "Alternative Treatments": [
        {
          "Active ingredient": "Copper hydroxide",
          "Trade name": "Champ Copper Hydroxide 37.5% WDG",
          "ROP Registration No.": "N690000",
          "Dosage": "0.25% solution (25 g in 10 L of water)"
        },
        {
          "Active ingredient": "Copper sulphate",
          "Trade name": "Cuproxat @ 345 g/L SC",
          "ROP Registration No.": "P750000",
          "Dosage": "0.25% solution (25 ml in 10 L of water)"
        }
      ],
      "Note": "This disease is prevalent in Low country region"
    },
    "Canker Diseases": {
      "Treatment": {
        "Active ingredient": "Hexaconazole",
        "Trade name": "Eraser EC",
        "ROP Registration No.": "F020100",
        "Dosage": "0.05% solution (5 ml in 10 L of water), 170 L of solution per hectare",
        "Application": "Apply with a knapsack sprayer",
        "Frequency": "Minimum of 3 rounds at 2-3 monthly intervals for new clearings",
        "Note": "Recommended only for new clearings and pruned fields"
      },
      "Alternative Treatments": [
        {
          "Active ingredient": "Tebuconazole",
          "Trade name": "Folicur EC",
          "ROP Registration No.": "9370100"
        }
      ]
    },
    "Root Diseases": {
      "Treatment": {
        "Active ingredient": "Hexaconazole",
        "Trade name": "Eraser EC",
        "ROP Registration No.": "F020100",
        "Peripheral bushes": "0.2% solution (20 ml in 10 L of water)",
        "Infills": "0.1% solution (10 ml in 10 L of water)",
        "Frequency": "Minimum of 3 rounds at 2-3 monthly intervals",
        "Note": "Rest the treated tea bushes without harvesting for 8 weeks"
      },
      "Alternative Treatments": [
        {
          "Active ingredient": "Tebuconazole",
          "Trade name": "Folicur EC",
          "ROP Registration No.": "9370100"
        },
        {
          "Active ingredient": "Propiconazole",
          "Trade name": "Bumper",
          "ROP Registration No.": "N750000"
        }
      ]
    },
    "Wood Rots": {
      "Treatment": {
        "Active ingredient": "Tar Acids 80 g/L SL",
        "Trade name": "Brunolium Plantarium",
        "ROP Registration No.": "N220000",
        "Dosage": "15% solution (1.5 L in 8.5 L water), 35 L in 200 L of water",
        "Application": "Paint/spray on to individual prune cuts 2-3 days from pruning",
        "Note": "Add a colour for identification purposes",
        "PHI": "n/a"
      }
    },
    "Horse-Hair Blight": {
      "Treatment": {
        "Active ingredient": "Hydrated Lime",
        "Trade name": "Commercially available products",
        "ROP Registration No.": "n/a",
        "Dosage": "20% solution (2 Kg in 10 L water), 1000 L solution per hectare",
        "Application": "Spray on to bush frames after each pruning",
        "PHI": "n/a"
      }
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedDisease && diseaseData[selectedDisease]) {
      setRemedies(diseaseData[selectedDisease]);
    }
  };

  const handleReset = () => {
    setSelectedDisease("");
    setRemedies(null);
  };

  const renderRemedies = () => {
    if (!remedies) return null;

    const renderObject = (obj, level = 0) => {
      return Object.entries(obj).map(([key, value]) => {
        if (Array.isArray(value)) {
          return (
            <div key={key} className={`mt-${level > 0 ? 2 : 4}`}>
              <h3 className={`font-bold ${level > 0 ? 'text-green-700' : 'text-green-800'}`}>{key}:</h3>
              <div className="ml-4">
                {value.map((item, index) => (
                  <div key={index} className="mt-2 p-2 bg-gray-50 rounded">
                    {renderObject(item, level + 1)}
                  </div>
                ))}
              </div>
            </div>
          );
        } else if (typeof value === 'object' && value !== null) {
          return (
            <div key={key} className={`mt-${level > 0 ? 2 : 4}`}>
              <h3 className={`font-bold ${level > 0 ? 'text-green-700' : 'text-green-800'}`}>{key}:</h3>
              <div className="ml-4">
                {renderObject(value, level + 1)}
              </div>
            </div>
          );
        } else {
          return (
            <p key={key} className="mt-1">
              <span className="font-semibold">{key}:</span> {value}
            </p>
          );
        }
      });
    };

    return (
      <div className="bg-white p-5 rounded shadow border border-green-400">
        <h3 className="text-lg font-bold text-green-700">{selectedDisease} Remedies</h3>
        <div className="mt-4 space-y-4">
          {renderObject(remedies)}
        </div>
        <div className="mt-6 p-3 bg-yellow-50 border border-yellow-200 rounded">
          <h4 className="font-bold text-yellow-700">Special Considerations:</h4>
          <p>Ensure worker safety by using Personal Protective Equipment (PPE) such as masks and eye protectants when using PPPs.</p>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex bg-green-100 min-h-screen p-10">
        <div className="w-1/2 bg-white p-5 rounded shadow border border-green-400">
          <h2 className="text-xl font-bold text-green-700">Disease Remedy Finder</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-green-700">Select Disease:</label>
              <select 
                value={selectedDisease} 
                onChange={(e) => setSelectedDisease(e.target.value)} 
                className="border p-2 w-full border border-green-400"
              >
                <option value="">Select a Disease</option>
                {Object.keys(diseaseData).map(disease => (
                  <option key={disease} value={disease}>{disease}</option>
                ))}
              </select>
            </div>
            <button 
              type="submit" 
              className="bg-green-700 text-white p-2 w-full rounded"
              disabled={!selectedDisease}
            >
              Find Remedies
            </button>
            <button 
              type="button" 
              onClick={handleReset} 
              className="bg-black text-white p-2 w-full rounded"
            >
              Reset
            </button>
          </form>
        </div>
        <div className="w-1/2 p-5">
          {!remedies ? (
            <div className="bg-white p-5 rounded shadow border border-green-400">
              <h3 className="text-lg font-bold text-green-700">Results will appear here</h3>
              <p className="mt-2 text-gray-600">Select a disease from the dropdown and click "Find Remedies" to see treatment options.</p>
            </div>
          ) : (
            renderRemedies()
          )}
        </div>
      </div>
    </div>
  );
}