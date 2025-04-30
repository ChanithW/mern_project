const Finance = require("../model/FMmodel");
const fs = require("fs");
const PDFDocument = require("pdfkit");
const path = require("path");

// Get all finance records
exports.getAllFinanceRecords = async (req, res) => {
  try {
    const records = await Finance.find();
    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

// Get a single finance record by ID
exports.getFinanceRecordById = async (req, res) => {
  try {
    const record = await Finance.findById(req.params.id);
    if (!record) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json(record);
  } catch (error) {
    res.status(500).json({ message: "Error fetching record", error });
  }
};

// Add a new finance record  
exports.addFinanceRecord = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    const { date, name, type, value } = req.body;
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      throw new Error("Value must be a valid number");
    }
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    console.log("Data to save:", { date, name, type, value: numericValue, image });
    const newRecord = new Finance({ date, name, type, value: numericValue, image });
    await newRecord.save();
    res.status(201).json({ message: "Record added successfully", newRecord });
  } catch (error) {
    console.error("Error adding record:", error);
    res.status(400).json({ message: "Error adding record", error: error.message });
  }
};

// Update an existing finance record
exports.updateFinanceRecord = async (req, res) => {
  try {
    console.log("Request body:", req.body);
    console.log("Uploaded file:", req.file);
    const { date, name, type, value } = req.body;
    const numericValue = Number(value);
    if (isNaN(numericValue)) {
      throw new Error("Value must be a valid number");
    }
    const image = req.file ? `/uploads/${req.file.filename}` : undefined;
    const updateData = { date, name, type, value: numericValue };
    if (image) {
      updateData.image = image;
    }
    console.log("Data to update:", updateData);
    const updatedRecord = await Finance.findByIdAndUpdate(req.params.id, updateData, { new: true });
    if (!updatedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record updated successfully", updatedRecord });
  } catch (error) {
    console.error("Error updating record:", error.message);
    res.status(400).json({ message: "Error updating record", error: error.message });
  }
};

// Delete a finance record
exports.deleteFinanceRecord = async (req, res) => {
  try {
    const deletedRecord = await Finance.findByIdAndDelete(req.params.id);
    if (!deletedRecord) {
      return res.status(404).json({ message: "Record not found" });
    }
    res.status(200).json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting record", error });
  }
};

// Download report as PDF
exports.downloadReport = async (req, res) => {
  try {
    const search = req.query.search || "";
    const searchLower = search.toLowerCase();
    const records = await Finance.find();
    const filteredRecords = records.filter((record) => {
      const nameMatch = record.name.toLowerCase().includes(searchLower);
      const dateMatch = record.date.toLowerCase().includes(searchLower);
      const valueMatch = record.value.toString().includes(searchLower);
      return nameMatch || dateMatch || valueMatch;
    });

    const doc = new PDFDocument();
    const pdfPath = path.join(__dirname, "../temp-report.pdf");
    const stream = fs.createWriteStream(pdfPath);
    doc.pipe(stream);

    doc.fontSize(20).text("Finance Report", { align: "center" });
    doc.moveDown();

    doc.fontSize(12).font("Helvetica-Bold");
    const tableTop = 100;
    const columnWidths = {
      date: 100,
      name: 150,
      type: 80,
      value: 80,
      image: 100,
    };
    let xPosition = 50;

    doc.text("Date", xPosition, tableTop);
    xPosition += columnWidths.date;
    doc.text("Transaction Name", xPosition, tableTop);
    xPosition += columnWidths.name;
    doc.text("Type", xPosition, tableTop);
    xPosition += columnWidths.type;
    doc.text("Value (LKR)", xPosition, tableTop);
    xPosition += columnWidths.value;
    doc.text("Image", xPosition, tableTop);

    doc
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();
    doc.moveDown();

    let yPosition = tableTop + 30;
    doc.font("Helvetica").fontSize(10);

    for (const record of filteredRecords) {
      xPosition = 50;
      doc.text(record.date, xPosition, yPosition);
      xPosition += columnWidths.date;
      doc.text(record.name, xPosition, yPosition);
      xPosition += columnWidths.name;
      doc.text(record.type, xPosition, yPosition);
      xPosition += columnWidths.type;
      doc.text(record.value.toFixed(2), xPosition, yPosition);
      xPosition += columnWidths.value;

      if (record.image) {
        const imagePath = path.join(__dirname, "../", record.image);
        try {
          if (fs.existsSync(imagePath)) {
            doc.image(imagePath, xPosition, yPosition - 10, { width: 50, height: 50 });
          } else {
            doc.text("Image not found", xPosition, yPosition);
          }
        } catch (err) {
          console.error(`Error loading image ${imagePath}:`, err);
          doc.text("Image error", xPosition, yPosition);
        }
      } else {
        doc.text("-", xPosition, yPosition);
      }

      yPosition += 60;
      if (yPosition > 700) {
        doc.addPage();
        yPosition = 50;
      }
    }

    doc.end();

    stream.on("finish", () => {
      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=Finance_Report.pdf");
      const fileStream = fs.createReadStream(pdfPath);
      fileStream.pipe(res);
      fileStream.on("end", () => {
        fs.unlinkSync(pdfPath);
      });
    });

    stream.on("error", (err) => {
      console.error("Error generating PDF:", err);
      res.status(500).json({ message: "Error generating report", error: err.message });
    });

  } catch (error) {
    console.error("Error in downloadReport:", error);
    res.status(500).json({ message: "Error generating report", error: error.message });
  }
};