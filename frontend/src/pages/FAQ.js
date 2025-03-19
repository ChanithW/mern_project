import React, { useState } from "react";
import { motion } from "framer-motion";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import Header from '../components/header';

const faqData = [
  {
    question: "How to contact us?",
    answer: "You can contact us through our email: info@gurukandura.com or call us at +94 123 456 789."
  },
  {
    question: "Are there any job vacancies?",
    answer: "You can send your resume to hr@gurukandura.com."
  },
  {
    question: "Can I get tea leaves directly from the estate?",
    answer: "Yes, you can visit our estate directly  to get fresh tea leaves."
  },
  {
    question: "How to buy tea leaves?",
    answer: " If you are interested in purchasing tea leaves, feel free to contact us directly."
  },
  {
    question: "What types of tea do you offer?",
    answer: "We do not offer packaged tea for sale. However, we provide fresh tea leaves, cultivated with premium quality on our estate. If you are interested in purchasing tea leaves, feel free to contact us directly."
  },
];

function FAQ() {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAnswer = (index) => {
    if (openIndex === index) {
      setOpenIndex(null);
    } else {
      setOpenIndex(index);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
    <Header />
    <div className="min-h-screen bg-white text-white p-8">
      <div className="max-w-7xl mx-auto bg-white p-6 border-2 border-green-500 rounded-2xl shadow-lg">
        <h2 className="text-3xl font-bold text-black text-center mb-6">Frequently Asked Questions</h2>
        
        <div>
          {faqData.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mb-4"
            >
              <div
                className="flex justify-between items-center bg-green-600 text-white p-4 rounded-lg cursor-pointer"
                onClick={() => toggleAnswer(index)}
              >
                <h3 className="text-xl font-semibold">{faq.question}</h3>
                {openIndex === index ? (
                  <IoIosArrowUp size={20} />
                ) : (
                  <IoIosArrowDown size={20} />
                )}
              </div>
              {openIndex === index && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="bg-gray-100 text-black p-4 mt-2 rounded-lg"
                >
                  <p>{faq.answer}</p>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
    </div>

  );
}

export default FAQ;
