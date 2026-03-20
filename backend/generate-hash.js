const bcrypt = require('bcryptjs');

const password = 'Shangrilavote&2025@';
const hash = bcrypt.hashSync(password, 10);

console.log('Admin password hash:');
console.log(hash);
console.log('\nUpdate SQL with this hash');
