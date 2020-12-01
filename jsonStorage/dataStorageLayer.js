"use strict";

const path = require("path");
const fs = require("fs").promises;

const storageConfig = require("./storageConfig.json");
const storageFile = path.join(__dirname, storageConfig.storageFile);

//wrapper function
function createDataStorage() {
  const { CODES, MESSAGES } = require(path.join(
    __dirname,
    storageConfig.errorCodes
  ));

  //private API

  async function readStorage() {
    try {
      const data = await fs.readFile(storageFile, "utf8");
      return JSON.parse(data);
    } catch (err) {
      return [];
    }
  }

  async function writeStorage(data) {
    try {
      await fs.writeFile(storageFile, JSON.stringify(data, null, 4), {
        encoding: "utf8",
        flag: "w",
      });
      return MESSAGES.WRITE_OK();
    } catch (err) {
      return MESSAGES.WRITE_ERROR(err.message);
    }
  }

  async function getFromStorage(number) {
    return (await readStorage()).find((game) => game.number == number) || null;
  }

  async function addToStorage(newGame) {
    const storage = await readStorage();
    if (storage.find((game) => game.number == newGame.number)) {
      return false;
    } else {
      storage.push({
        number: +newGame.number,
        name: newGame.name,
        year: newGame.year,
        quantity: newGame.quantity,
        genre: newGame.genre,
      });
      await writeStorage(storage);
      return true;
    }
  } //end of addStorage

  async function removeFromStorage(number) {
    let storage = await readStorage();
    const i = storage.findIndex((game) => game.number == number);
    if (i < 0) return false;
    storage.splice(i, 1);
    await writeStorage(storage);
    return true;
  }

  async function updateStorage(game) {
    let storage = await readStorage();
    const oldGame = storage.find((oldGm) => oldGm.number == game.number);
    if (oldGame) {
      Object.assign(oldGame, {
        number: +game.number,
        name: game.name,
        year: game.year,
        quantity: game.quantity,
        genre: game.genre,
      });
      await writeStorage(storage);
      return true;
    } else {
      return false;
    }
  }

  class Datastorage {
    get CODES() {
      return CODES;
    }

    getAll() {
      return readStorage();
    }

    get(number) {
      return new Promise(async (resolve, reject) => {
        if (!number) {
          reject(MESSAGES.NOT_FOUND("<empty number>"));
        } else {
          const result = await getFromStorage(number);
          if (result) {
            resolve(result);
          } else {
            reject(MESSAGES.NOT_FOUND(number));
          }
        }
      });
    }
    insert(game) {
      return new Promise(async (resolve, reject) => {
        if (!(game && game.number && game.name && game.year)) {
          reject(MESSAGES.NOT_INSERTED());
        } else {
          if (await addToStorage(game)) {
            resolve(MESSAGES.INSERT_OK(game.number));
          } else {
            reject(MESSAGES.ALREADY_IN_USE(game.number));
          }
        }
      });
    }

    remove(number) {
      return new Promise(async (resolve, reject) => {
        if (!number) {
          reject(MESSAGES.NOT_FOUND("<empty>"));
        } else {
          if (await removeFromStorage(number)) {
            resolve(MESSAGES.REMOVE_OK(number));
          } else {
            reject(MESSAGES.NOT_REMOVED());
          }
        }
      });
    }

    update(game) {
      return new Promise(async (resolve, reject) => {
        if (!(game && game.number && game.name && game.year)) {
          reject(MESSAGES.NOT_UPDATED());
        } else {
          if (await updateStorage(game)) {
            resolve(MESSAGES.UPDATE_OK(game.number));
          } else {
            reject(MESSAGES.NOT_UPDATED());
          }
        }
      });
    }
  } // class end

  return new Datastorage();
} //wrapper end

module.exports = {
  createDataStorage,
};
