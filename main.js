import fs from 'fs';
import inquirer from 'inquirer';
import { sendMessageToChannel } from './src/bot/telegramBot.js';
import path from 'path';
import dyandraGlobalStore from './src/core/dyandraGlobalStore.js';
import lodash from 'lodash';
function formatLog(message) {
  const now = new Date();
  const time =
    now.toLocaleTimeString('en-US', { hour12: false }) +
    '.' +
    now.getMilliseconds().toString().padStart(3, '0');
  return `[${time}] ${message}`;
}
const findColumnsWithLabel = (obj, keyword, pathTrace = '') => {
  let result = [];
  if (Array.isArray(obj)) {
    obj.forEach((item, index) => [
      (result = result.concat(
        findColumnsWithLabel(item, keyword, `${pathTrace}[${index}]`)
      )),
    ]);
  } else if (typeof obj == 'object' && obj != null) {
    if (obj.elements && Array.isArray(obj.elements)) {
      const hasLabel = obj.elements.some(
        (el) =>
          el.label && typeof el.label == 'string' && el.label.includes(keyword)
      );
      if (hasLabel) {
        result.push({ path: pathTrace, column: obj });
      }
    }
    for (const key in obj) {
      result = result.concat(
        findColumnsWithLabel(obj[key], keyword, `${pathTrace}.${key}`)
      );
    }
  }
  return result;
};
(async () => {
  try {
    process.stdout.write('\x1Bc');
    const targetPath = path.join(process.cwd(), 'target.txt');
    const url = fs.readFileSync(targetPath, 'utf-8');
    let data = await dyandraGlobalStore(url);
    const { inputKeyword } = await inquirer.prompt([
      {
        type: 'input',
        message: 'input keyword at button',
        name: 'inputKeyword',
      },
    ]);
    const matches = findColumnsWithLabel(data, inputKeyword);
    const { selectButtons } = await inquirer.prompt([
      {
        type: 'checkbox',
        message: 'select button to snipe',
        name: 'selectButtons',
        choices: matches.map((item) => ({
          name:
            item.column.elements.find((el) => el.label)?.label || '(no label)',
          value: item.path,
        })),
        validate: (answer) => {
          if (answer.length < 1) {
            return 'Pilih minimal satu tombol!';
          }
          return true;
        },
      },
    ]);

    const foundPaths = new Set();
    let i = 1;
    while (true) {
      const data = await dyandraGlobalStore(url);
      for (const path of selectButtons) {
        if (foundPaths.has(path)) continue;
        const selectedButton = matches.filter((e) => e.path == path)[0];
        const target = selectedButton.path.replace('.l', 'l');
        const rows = lodash.get(data, target);
        const targetedElements = rows?.elements[0];
        if (!targetedElements) {
          console.log(formatLog(`[ERROR] NOT FOUND ROWS`));
          break;
        }
        if (
          targetedElements.link == null ||
          targetedElements.link == undefined
        ) {
          console.log(formatLog(`[ERROR] NOT FOUND LINK AT ELEMENTS`));
          break;
        }
        if (targetedElements.link == '') {
          console.log(formatLog(`[WAITING] LINK NULL [REQUEST ${i}]`));
          i++;
        } else {
          const message = formatLog(
            `[FOUND] [${selectedButton.column.elements.find((el) => el.label)?.label}] [${url}]\n${targetedElements.link}`
          );
          console.log(message);
          await sendMessageToChannel(message);
          foundPaths.add(path);
        }
      }
      if (foundPaths.size == selectButtons.length) {
        console.log(formatLog(`[DONE] ALL BUTTON FIND`));
        break;
      }
    }
    return;
  } catch (error) {
    console.log(error);
  }
})();
