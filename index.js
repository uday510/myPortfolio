
const express = require('express');
const path = require('path');
const mongoose = require("mongoose");
const app = express();

const connectionString = "mongodb+srv://admin:zC7Fr5WR9izcKNEO@cluster0.zjfjzzt.mongodb.net/adminDB?retryWrites=true&w=majority&appName=Cluster0";

mongoose.connect(connectionString)
  .then(() => {
    console.log('Connected to MongoDB');
  })
  .catch(err => {
    console.error('Error connecting to MongoDB', err);
  });

const visitorSchema = new mongoose.Schema(
  {
    ip: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Visitor = mongoose.model("Visitor", visitorSchema);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.post('/track-visitor', async (req, res) => {
  const { ip } = req.body;

  if (!ip) {
    return res.status(400).send("IP address is required");
  }

  try {
    await Visitor.updateOne({ ip: ip }, { $setOnInsert: { ip: ip } }, { upsert: true });
    const count = await Visitor.countDocuments();
    res.json({ count: count });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});


app.get('/ttl', (req, res) => {
  // Get current timestamp
  const now = new Date();
  
  // Calculate total milliseconds difference
  const diffMs = now - dob;

  // Time unit constants
  const msInSecond = 1000;
  const msInMinute = msInSecond * 60;
  const msInHour = msInMinute * 60;
  const msInDay = msInHour * 24;
  const msInYear = msInDay * 365.25; // Accounting for leap years

  // Calculate time components
  const totalYears = Math.floor(diffMs / msInYear);
  const totalDays = Math.floor(diffMs / msInDay);
  const totalHours = Math.floor(diffMs / msInHour);
  const totalMinutes = Math.floor(diffMs / msInMinute);
  const totalSeconds = Math.floor(diffMs / msInSecond);

  // Calculate precise breakdown
  let years = now.getFullYear() - dob.getFullYear();
  let months = now.getMonth() - dob.getMonth();
  let days = now.getDate() - dob.getDate();
  let hours = now.getHours() - dob.getHours();
  let minutes = now.getMinutes() - dob.getMinutes();
  let seconds = now.getSeconds() - dob.getSeconds();

  // Normalize negative values
  if (seconds < 0) {
    minutes--;
    seconds += 60;
  }
  if (minutes < 0) {
    hours--;
    minutes += 60;
  }
  if (hours < 0) {
    days--;
    hours += 24;
  }
  if (days < 0) {
    months--;
    const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
    days += prevMonth.getDate();
  }
  if (months < 0) {
    years--;
    months += 12;
  }

  // Additional calculations
  const totalWeeks = Math.floor(totalDays / 7);
  const milliseconds = diffMs % 1000;

  // Create detailed response object
  const response = {
    breakdown: {
      years,
      months,
      days,
      hours,
      minutes,
      seconds,
      milliseconds
    },
    totals: {
      years: totalYears,
      weeks: totalWeeks,
      days: totalDays,
      hours: totalHours,
      minutes: totalMinutes,
      seconds: totalSeconds,
      milliseconds: diffMs
    },
    birthDetails: {
      date: dob.toISOString(),
      location: 'Shadnagar, Telangana, India (509216)',
      timezone: 'IST (UTC+5:30)'
    },
    vedicAstrology: vedicBirthChart,
    metadata: {
      calculationDate: now.toISOString(),
      calculationTimezone: Intl.DateTimeFormat().resolvedOptions().timeZone
    }
  };

  res.json({
    message: `Time elapsed since birth on ${dob.toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })}`,
    data: response,
    summary: {
      age: `${years} years, ${months} months, ${days} days`,
      vedicInsight: `Born under ${vedicBirthChart.nakshatra} Nakshatra with ${vedicBirthChart.ascendant} Ascendant. Current dasha: ${vedicBirthChart.dasha.split('current: ')[1]}.`
    }
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
