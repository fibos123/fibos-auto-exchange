import { exchange } from './lib/exchange';
import { getBalance } from './lib/get-balance';

const main = async () => {
  try {
    const balance = await getBalance();
    console.log(balance);
    if (balance > 100) {
      const res = await exchange(balance - 100);
      console.log(res);
    }
  } catch (e) {
    console.log('error:');
    console.error(e);
  }
};
main();

setInterval(main, 1 * 60 * 60 * 1000);
