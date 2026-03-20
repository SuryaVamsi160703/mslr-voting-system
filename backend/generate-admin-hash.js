const bcrypt = require('bcryptjs');

const password = 'Shangrilavote&2025@';
const hash = bcrypt.hashSync(password, 10);

console.log('='.repeat(60));
console.log('ADMIN PASSWORD HASH GENERATED');
console.log('='.repeat(60));
console.log('\nPassword: Shangrilavote&2025@');
console.log('Hash:', hash);
console.log('\nCopy this hash to update the database:');
console.log(hash);
console.log('\nSQL Command:');
console.log(`UPDATE users SET password_hash='${hash}' WHERE email='ec@referendum.gov.sr';`);
console.log('='.repeat(60));
