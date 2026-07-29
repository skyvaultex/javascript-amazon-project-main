import {formatCurrency} from "../scripts/utils/money.js";

console.log('test suite: format Currency:');
console.log('formats number correctly');
const isFormated = formatCurrency(2095) === '20.95' ? console.log('1') : console.log('0');
console.log(formatCurrency(2095));


console.log('works with zero');
console.log(formatCurrency(0));

console.log('rounds up correctly');
console.log(formatCurrency(2000.5));