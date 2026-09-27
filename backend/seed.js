require('dotenv').config();
const mongoose = require('mongoose');
const Brokerage = require('./src/models/Brokerage');
const User = require('./src/models/User');

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Brokerage.deleteMany({});
    await User.deleteMany({});
    console.log('Cleared existing data');

    // Create brokerages
    const brokerage1 = await Brokerage.create({
      name: 'MortgageMax Berlin',
      email: 'admin@mortgagemax.de',
      country: 'Germany',
    });
    console.log(`Created Brokerage 1: ${brokerage1._id}`);

    const brokerage2 = await Brokerage.create({
      name: 'HomeFinder Munich',
      email: 'admin@homefinder.de',
      country: 'Germany',
    });
    console.log(`Created Brokerage 2: ${brokerage2._id}`);

    // Create users for brokerage 1
    const admin1 = await User.create({
      brokerageId: brokerage1._id,
      email: 'admin@mortgagemax.de',
      password: 'admin123',
      name: 'Admin One',
      role: 'brokerage_admin',
    });
    console.log(`Created Admin 1: ${admin1._id}`);

    const advisor1 = await User.create({
      brokerageId: brokerage1._id,
      email: 'advisor@mortgagemax.de',
      password: 'advisor123',
      name: 'Advisor One',
      role: 'advisor',
    });
    console.log(`Created Advisor 1: ${advisor1._id}`);

    // Create users for brokerage 2
    const admin2 = await User.create({
      brokerageId: brokerage2._id,
      email: 'admin@homefinder.de',
      password: 'admin123',
      name: 'Admin Two',
      role: 'brokerage_admin',
    });
    console.log(`Created Admin 2: ${admin2._id}`);

    const advisor2 = await User.create({
      brokerageId: brokerage2._id,
      email: 'advisor@homefinder.de',
      password: 'advisor123',
      name: 'Advisor Two',
      role: 'advisor',
    });
    console.log(`Created Advisor 2: ${advisor2._id}`);

    console.log('\n=== TEST LOGINS ===');
    console.log('Brokerage 1 (MortgageMax):');
    console.log(`  Admin: admin@mortgagemax.de / admin123`);
    console.log(`  Advisor: advisor@mortgagemax.de / advisor123`);
    console.log(`  BrokerageId: ${brokerage1._id}`);
    console.log('\nBrokerage 2 (HomeFinder):');
    console.log(`  Admin: admin@homefinder.de / admin123`);
    console.log(`  Advisor: advisor@homefinder.de / advisor123`);
    console.log(`  BrokerageId: ${brokerage2._id}`);

    await mongoose.connection.close();
    console.log('\nSeeding complete!');
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
};

seed();