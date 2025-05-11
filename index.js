
const express = require('express');
const path = require('path');
const { MongoClient, ObjectId } = require('mongodb');
const app = express();
const moment = require('moment-timezone');
const mongo_uri = 'mongodb+srv://admin:zC7Fr5WR9izcKNEO@cluster0.zjfjzzt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'
const db_name = 'mydb';
const collection_name = 'my_info';


async function connect_to_mongo() {
  const client = new MongoClient(mongo_uri);
  try {
    await client.connect();
    const db = client.db(db_name);
    const collection = db.collection(collection_name);
    
    return { client, collection };
  } catch (err) {
    console.error('MongoDB connection error:', err);
    throw err;
  }
}

app.set('views', path.join(__dirname, 'public')); 
app.use(express.json());
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/lifetime', async (req, res) => {
  let client;
  try {
    // Connect to MongoDB
    const { client: mongo_client, collection } = await connect_to_mongo();
    client = mongo_client;

    // Fetch user data from MongoDB
    const user = await collection.findOne({});
    if (!user) {
      throw new Error('User not found in database');
    }

    // return res.send(user);

    const dob = moment.tz(user.dob, 'Asia/Kolkata').toDate();
    if (!moment(dob).isValid()) {
      throw new Error('Invalid date of birth');
    }
    const now = new Date();
    const diff_ms = now - dob;

    // Time unit constants
    const ms_in_second = 1000;
    const ms_in_minute = ms_in_second * 60;
    const ms_in_hour = ms_in_minute * 60;
    const ms_in_day = ms_in_hour * 24;
    const ms_in_year = ms_in_day * 365.25; // Accounting for leap years

    // Calculate time components
    const total_years = Math.floor(diff_ms / ms_in_year);
    const total_days = Math.floor(diff_ms / ms_in_day);
    const total_hours = Math.floor(diff_ms / ms_in_hour);
    const total_minutes = Math.floor(diff_ms / ms_in_minute);
    const total_seconds = Math.floor(diff_ms / ms_in_second);

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
      const prev_month = new Date(now.getFullYear(), now.getMonth(), 0);
      days += prev_month.getDate();
    }
    if (months < 0) {
      years--;
      months += 12;
    }

    // Additional calculations
    const total_weeks = Math.floor(total_days / 7);
    const milliseconds = diff_ms % 1000;

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
        years: total_years,
        weeks: total_weeks,
        days: total_days,
        hours: total_hours,
        minutes: total_minutes,
        seconds: total_seconds,
        milliseconds: diff_ms
      },
      metadata: {
        calculation_date: now.toISOString(),
        dob: dob.toISOString(),
        time_zone: user.birth_time_zone,
        location: user.birth_place,
        coordinates: user.birth_location.coordinates
      },
      user_profile: user
    };

    // Send enhanced JSON response
    res.json({
      message: `Time elapsed since ${user.full_name}'s birth on ${moment(dob).tz('Asia/Kolkata').format('DD MMMM YYYY')} at ${moment(dob).tz('Asia/Kolkata').format('hh:mm A')}`,
      data: response,
      astrological_note: `Born under ${user.vedic_astrology.nakshatra} Nakshatra with ${user.vedic_astrology.ascendant} Ascendant, indicating a blend of innovation, emotional depth, and leadership qualities.`
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error', details: err.message });
  } finally {
    if (client) {
      await client.close();
    }
  }
});

app.get('/lifetime-ui', async (req, res) => {
  try {
    const { client, collection } = await connect_to_mongo();
    const user_data = await collection.findOne({});
    if (!user_data) return res.status(404).send('User not found');
    res.render('lifetime', { user_data });
    client.close();
  } catch (err) {
    console.error(err);
    res.status(500).send('Error loading profile');
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
