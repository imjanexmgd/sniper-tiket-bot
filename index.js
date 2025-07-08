import fs from 'fs';
import bibiConcert from './src/core/bibi-concert.js';
import inquirer from 'inquirer';
import { sendMessageToChannel } from './src/bot/telegramBot.js';
import path from 'path';
function formatLog(message) {
  const now = new Date();
  const time =
    now.toLocaleTimeString('en-US', { hour12: false }) +
    '.' +
    now.getMilliseconds().toString().padStart(3, '0');
  return `[${time}] ${message}`;
}

(async () => {
  try {
    const targetPath = path.join(process.cwd(), 'target.txt');
    const url = fs.readFileSync(targetPath, 'utf-8');
    let i = 0;
    const { askMode } = await inquirer.prompt([
      {
        type: 'list',
        message: 'select to filter',
        name: 'askMode',
        choices: [
          {
            name: 'Membership (GL) PreSale',
            value: 0,
          },
          {
            name: 'Global Presale',
            value: 1,
          },
        ],
      },
    ]);

    // Membership (GL) Presale
    let result = [];
    if (askMode == 0) {
      let buttonDayOneStatus = false;
      let buttonDayTwoStatus = false;
      let data;
      while (true) {
        try {
          i++;
          data = await bibiConcert(url);
        } catch (error) {
          continue;
        }
        if (buttonDayOneStatus == false) {
          if (data?.layout?.sections[5]?.rows[1]?.columns[0]?.elements[1]) {
            let target = data.layout.sections[5].rows[1].columns[0].elements[1];
            if (target.link == '') {
              console.log(
                formatLog(`[MEMBERSHIP PRESALE] [1] [NOT FOUND] request ${i}`)
              );
            } else {
              const message = formatLog(
                `[MEMBERSHIP PRESALE] [1] [FOUND] ${target.link}`
              );
              console.log(message);
              await sendMessageToChannel(message);
              result.push({
                name: 'MEMBERSHIP PRESALE DAY 1',
                link: `${target.link}`,
                status: 'found',
              });
              buttonDayOneStatus = true;
            }
          } else {
            result.push({
              name: 'MEMBERSHIP PRESALE DAY 1',
              link: null,
              status: 'skipping',
            });
            buttonDayOneStatus = true;
          }
        }
        if (buttonDayTwoStatus == false) {
          if (data.layout.sections[5]?.rows[4]?.columns[0]?.elements[1]) {
            let target = data.layout.sections[5].rows[4].columns[0].elements[1];
            if (target.link == '') {
              console.log(
                formatLog(`[MEMBERSHIP PRESALE] [2] [NOT FOUND] request ${i}`)
              );
            } else {
              const message = formatLog(
                `[MEMBERSHIP PRESALE] [2] [FOUND] ${target.link}`
              );
              console.log(message);
              await sendMessageToChannel(message);
              result.push({
                name: 'MEMBERSHIP PRESALE DAY 2',
                link: `${target.link}`,
                status: 'found',
              });
              buttonDayTwoStatus == true;
            }
          } else {
            console.log(formatLog('[MEMBERSHIP PRESALE] [2] [SKIPPING]'));
            result.push({
              name: 'MEMBERSHIP PRESALE DAY 2',
              link: null,
              status: 'skipping',
            });
            buttonDayTwoStatus = true;
          }
        }
        console.log({
          buttonDayOneStatus,
          buttonDayTwoStatus,
        });

        if (buttonDayOneStatus == true && buttonDayTwoStatus == true) {
          break;
        }
        continue;
      }
    }
    // GLOBAL PRESALE
    if (askMode == 1) {
      let buttonDayOneStatus = false;
      let buttonDayTwoStatus = false;
      let data;
      while (true) {
        try {
          i++;
          data = await bibiConcert(url);
        } catch (error) {
          continue;
        }
        if (buttonDayOneStatus == false) {
          if (data.layout.sections[5]?.rows[1]?.columns[1]?.elements[1]) {
            let target =
              data.layout.sections[5]?.rows[1]?.columns[1]?.elements[1];
            if (target.link == '') {
              console.log(
                formatLog(`[GLOBAL PRESALE] [1] [NOT FOUND] request ${i}`)
              );
            } else {
              const message = formatLog(
                `[GLOBAL PRESALE] [1] [FOUND] ${target.link}`
              );
              console.log(message);
              await sendMessageToChannel(message);
              result.push({
                name: 'GLOBAL PRESALE DAY 1',
                link: `${target.link}`,
                status: 'found',
              });
              buttonDayOneStatus = true;
            }
          } else {
            result.push({
              name: 'GLOBAL PRESALE DAY 1',
              link: null,
              status: 'skipping',
            });
            buttonDayOneStatus = true;
            console.log(buttonDayOneStatus);
          }
        }
        if (buttonDayTwoStatus == false) {
          if (data.layout.sections[5]?.rows[4]?.columns[1]?.elements[1]) {
            let target = data.layout.sections[5].rows[4].columns[1].elements[1];
            if (target.link == '') {
              console.log(
                formatLog(`[GLOBAL PRESALE] [2] [NOT FOUND] request ${i}`)
              );
            } else {
              const message = formatLog(
                `[GLOBAL PRESALE] [2] [FOUND] ${target.link}`
              );
              console.log(message);
              await sendMessageToChannel(message);
              result.push({
                name: 'GLOBAL PRESALE DAY 2',
                link: `${target.link}`,
                status: 'found',
              });
              buttonDayTwoStatus = true;
            }
          } else {
            console.log(formatLog('[GLOBAL PRESALE] [2] [SKIPPING]'));
            result.push({
              name: 'GLOBAL PRESALE DAY 2',
              link: null,
              status: 'skipping',
            });
            buttonDayTwoStatus = true;
          }
        }
        console.log({
          buttonDayOneStatus,
          buttonDayTwoStatus,
        });

        if (buttonDayOneStatus == true && buttonDayTwoStatus == true) {
          break;
        }
        continue;
      }
    }
  } catch (error) {
    console.log(error);
  }
})();
