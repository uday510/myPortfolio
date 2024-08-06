
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

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
