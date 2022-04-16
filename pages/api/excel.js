import XLSX from "xlsx";
import fs from "fs";
// const file = require("../../public/reestr.xlsx");

export default function getXlsx(req, res) {
  // console.log(__dirname.join("server"));
  var buf = fs.readFileSync(__dirname + "/reestr.xlsx");
  // var buf = fs.ReadStream(require("../../public/reestr.xlsx"));
  var wb = XLSX.read(buf, { type: "buffer" });

  var data = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]);
  // await db.collection('coll').insertMany(data, { ordered: true });
  // console.log(data);
  res.status(200).json(data);
}
