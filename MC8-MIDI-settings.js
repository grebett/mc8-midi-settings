const fs = require('fs');
const { access } = require('fs/promises');
const midi = require('midi');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

/////////
// Consts
/////////
const LAST_BANK_INDEX_PATH = '.lastBankIndex';
const MC8_PORT_NAME = 'MC-8';

////////
// Utils
////////
const sleep = (milliseconds) => {
  const start = new Date().getTime();
  for (var i = 0; i < 1e7; i++) {
    if ((new Date().getTime() - start) > milliseconds) {
      break;
    }
  }
};

//////////
// Helpers
//////////
const findMC8Index = () => {
  const output = new midi.Output();
  const outputs = output.getPortCount();
  let mc8 = null;
  for (let i = 0; i < outputs; i++) {
    if (output.getPortName(i) === MC8_PORT_NAME) {
      mc8 = i;
      break;
    }
  };
  return mc8;
};

const updateBank = ({ mc8Index, bank }) => {
  const output = new midi.Output();
  output.openPort(mc8Index);
  output.sendMessage([0xd0, 30]);
  sleep(50);
  for (let i = 0; i < Math.min(bank.length, 8); i++) {
    const [channel, cc] = bank[i];
    output.sendMessage([0xb0, 92 + i, channel]);
    sleep(50);
    output.sendMessage([0xb0, 100 + i, cc]);
  }
  sleep(50);
  output.closePort();
};

////////
// Main
////////

(async () => {
  try {
    const argv = yargs(hideBin(process.argv)).argv;
    const banks = JSON.parse(fs.readFileSync('./banks.json').toString());

    // 0) HELP
    if (argv['help'] || argv['h'] || Object.keys(argv).length === 2) {
      console.log(`Options:
    -h\t\t\tPrints this help
    -l\t--list\t\tList all banks
    -n\t--next\t\tUpload next bank
    -p\t--prev\t\tUpload previous bank
    --bank=[number]\tLoad a specific bank`);
      return;
    }

    // 1) LIST ALL BANKS
    if (argv['list'] || argv['l']) {
      banks.forEach((bank, i) => console.log(`\n• Bank n°${i}:\n-----------\nFADER\tCHAN.\tCC`, bank.map((data, j) => `\n(${j + 1})\t${data[0]}\t${data[1]}`).join('')));
      return;
    };

    // 2) CREATE LAST_BANK_INDEX IF NEEDED
    try {
      await access(LAST_BANK_INDEX_PATH, fs.constants.F_OK);
    } catch (e) {
      console.log(e);
      fs.writeFileSync(LAST_BANK_INDEX_PATH, '0');
    }

    // 3) COMPUTE BANK INDEX
    const lastBankIndex = parseInt(fs.readFileSync(LAST_BANK_INDEX_PATH).toString(), 10) || 0;
    const iterate = (argv['next'] || argv['n']) ? +1 : (argv['prev'] || argv['p']) ? -1 : 0;
    let newBankIndex = lastBankIndex + iterate;
    if (!!iterate) {
      if (newBankIndex < 0) {
        newBankIndex = banks.length - 1;
      } else if (newBankIndex > banks.length - 1) {
        newBankIndex = 0;
      }
      fs.writeFileSync(LAST_BANK_INDEX_PATH, newBankIndex.toString());
    }
    const bankIndex = !!iterate ? newBankIndex : parseInt(argv['bank'], 10) - 1 || 0;
    if (typeof banks[bankIndex] === 'undefined') {
      throw new Error('Sorry this bank does not exist');
    }

    // 4) FIND MC8 and update it!
    const index = findMC8Index();
    if (index === null) {
      throw new Error(`Oups, coudn't find your nakedboard MC-8. Are you sure it is correctly plugged and recognized by your machine?`);
    }
    updateBank({ mc8Index: findMC8Index(), bank: banks[bankIndex] });
    console.log(`🙌 Success! The bank n°${bankIndex + 1} has been updated to your nakedboard MC-8!\nGo make some music, will you?`);
  } catch (e) {
    console.log('❌', e);
  }
})();
