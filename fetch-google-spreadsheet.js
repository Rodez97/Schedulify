import { GoogleSpreadsheet } from "google-spreadsheet";
import { writeFile } from "fs";

const _client_email = import.meta.env.VITE_SA_CLIENT_EMAIL;
const _private_key = import.meta.env.VITE_SA_PRIVATE_KEY;

//# Initialize the sheet
const doc = new GoogleSpreadsheet(
  "1_z-3ov2vwPVZwHCiQhOB_UG7TEL40RwW1iE-FbXOQ6Y"
); //# spreadsheet ID

//# Initialize Auth
const init = async () => {
  await doc.useServiceAccountAuth({
    client_email: _client_email,
    private_key: _private_key,
  });
};

const read = async () => {
  await doc.loadInfo(); //# loads document properties and worksheets
  const sheet = doc.sheetsByTitle["1"]; //# get the sheet by title, I left the default title name. If you changed it, then you should use the name of your sheet
  await sheet.loadHeaderRow(); //# loads the header row (first row) of the sheet
  const colTitles = sheet.headerValues; //# array of strings from cell values in the first row
  const rows = await sheet.getRows({ limit: sheet.rowCount }); //# fetch rows from the sheet (limited to row count)
  let result = {};
  //# map rows values and create an object with keys as columns titles starting from the second column (languages names) and values as an object with key value pairs, where the key is a key of translation, and value is a translation in a respective language
  // eslint-disable-next-line array-callback-return
  rows.map((row) => {
    colTitles.slice(1).forEach((title) => {
      result[title] = result[title] || [];
      const key = row[colTitles[0]];
      result = {
        ...result,
        [title]: {
          ...result[title],
          [key]: row[title] !== "" ? row[title] : undefined,
        },
      };
    });
  });
  return result;
};

const write = (data) => {
  Object.keys(data).forEach((key) => {
    const tempObject = data[key];
    writeFile(
      `./public/locales/${key}/translation.json`,
      JSON.stringify(tempObject, null, 2),
      (err) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`File ${key} has been created`);
        }
      }
    );
  });
};

init()
  .then(() => read())
  .then((data) => write(data))
  .catch((err) => console.log("ERROR!!!!", err));
