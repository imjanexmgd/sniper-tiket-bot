import fs from 'fs';
import inquirer from 'inquirer';
import { sendMessageToChannel } from './src/bot/telegramBot.js';
import path from 'path';
import bibiConcert from './src/core/bibi-concert.js';

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
    process.stdout.write('\x1Bc');
    const targetPath = path.join(process.cwd(), 'target.txt');
    const url = fs.readFileSync(targetPath, 'utf-8');
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
    let result = [];
    let data;
    let buttonDayOneStatus = false;
    let buttonDayTwoStatus = false;
    let i = 1;
    // Membership Presale
    if (askMode == 0) {
      while (true) {
        try {
          data = await bibiConcert(url);
        } catch (error) {
          continue;
        }
        // check length for check day 2 or day 1 only
        const rows = data.layout.sections[5].rows;
        // just day 1
        if (rows.length == 4) {
          buttonDayTwoStatus = true;

          let target =
            data?.layout?.sections[5]?.rows[1]?.columns[0]?.elements[1];
          if (target) {
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
        } else {
          // any day 2

          //   getbuttondayOne
          if (data.layout?.sections[5]?.rows[2]?.columns[0]?.elements[1]) {
            let target = rows[2]?.columns[0].elements[1];
            if (target) {
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
          } else {
            console.log(
              formatLog(
                `[MEMBERSHIP PRESALE] [1] [NOT FOUND AT ROWS] request ${i}`
              )
            );
            result.push({
              name: 'MEMBERSHIP PRESALE DAY 1',
              link: null,
              status: 'skipping',
            });
            buttonDayOneStatus = true;
          }
          // get buttonDayTwo
          if (rows[4]?.columns[0]?.elements[1]) {
            let target = rows[4]?.columns[0]?.elements[1];
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
              buttonDayTwoStatus = true;
            }
          } else {
            console.log(
              formatLog(
                `[MEMBERSHIP PRESALE] [2] [NOT FOUND AT ROWS] request ${i}`
              )
            );
            result.push({
              name: 'MEMBERSHIP PRESALE DAY 2',
              link: null,
              status: 'skipping',
            });
            buttonDayTwoStatus = true;
          }
        }
        if (buttonDayOneStatus == true && buttonDayTwoStatus == true) {
          break;
        }
        i++;
      }
    }
    // Global Presale
    if (askMode == 1) {
      while (true) {
        try {
          data = await bibiConcert(url);
        } catch (error) {
          continue;
        }
        // check length for check day 2 or day only
        const rows = data.layout.sections[5].rows;

        // just day 1
        if (rows.length == 4) {
          buttonDayTwoStatus = true;
          let target = rows[1]?.columns[1]?.elements[1];
          if (target) {
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
          }
        } else {
          // get button day one
          if (rows[2]?.columns[1].elements[1]) {
            let target = rows[2]?.columns[1].elements[1];
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
          }
          // get button day two
          if (rows[4].columns[1].elements[1]) {
            let target = rows[4].columns[1].elements[1];
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
            result.push({
              name: 'GLOBAL PRESALE DAY 2',
              link: null,
              status: 'skipping',
            });
            buttonDayTwoStatus = true;
          }
        }
        if (buttonDayOneStatus == true && buttonDayTwoStatus == true) {
          break;
        }
        i++;
      }
    }
    console.log(result);
  } catch (error) {
    console.log(error);
  }
})();
