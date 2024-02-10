export interface CSVRow {
  NAME: string;
  EMAIL: string;
}

export default function parseEmployeesFromCSV(csvFile: string): CSVRow[] {
  const emailRegex = new RegExp(
    "^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9]" +
      "(?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?" +
      "(?:\\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$",
  );
  const rows: CSVRow[] = csvFile
    .trim()
    .split("\n")
    .reduce<CSVRow[]>((acc, row) => {
      const [name, email] = row.trim().split(",");
      // Validate email
      if (email.length === 0 || name.length === 0 || !emailRegex.test(email)) {
        return acc;
      }

      return [...acc, {NAME: name.trim(), EMAIL: email.trim()}];
    }, []);

  return rows;
}
