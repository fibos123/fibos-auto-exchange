const FIBOS = require('fibos.js');
require('ssl').loadRootCerts();
const config = require('./config');

const fibos = FIBOS({
  chainId: config['chain-id'],
  keyProvider: config['producer-priKey'],
  httpEndpoint: config['http-end-point'],
});

mian();
setInterval(mian, 1 * 60 * 60 * 1000); // ever 1 hours do it

async function mian() {
  try {
    const account = fibos.getTableRowsSync({
      json: true,
      code: 'eosio.token',
      scope: config['producer-name'],
      table: 'accounts',
      table_key: '',
      lower_bound: '',
      upper_bound: '',
      limit: 100,
    });

    let balance = 0;
    if (account.rows && account.rows.length) {
      account.rows.map(a => {
        if (a.balance.quantity.substr(-2) === 'FO' && a.balance.contract === 'eosio') {
          balance = parseFloat(a.balance.quantity);
        }
      });
    }
    console.log({ balance });

    if (balance < 10) {
      return;
    }

    const balance4 = balance.toFixed(4);
    console.log({ balance4 });

    const eosioTokenContract = await fibos.contract('eosio.token');
    const result = await eosioTokenContract.exchange(
      {
        owner: config['producer-name'],
        quantity: `${balance4} FO@eosio`,
        to: '0.000000 FOUSDT@eosio',
        price: 0,
        id: config['producer-name'],
        memo: `${balance4} FO@eosio 0.000000 FOUSDT@eosio`,
      },
      {
        authorization: config['producer-name'],
      }
    );

    console.log(result);
  } catch (e) {
    console.error(e);
  }
}
