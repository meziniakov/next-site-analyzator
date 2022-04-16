const file = require("../../../public/Anketa.json");

export default function getProjectById(req, res) {
  const { inn } = req.query;
  var projects = JSON.parse(JSON.stringify(file));
  let arr = [];
  projects.forEach((element) => {
    //создаем объект из каждого элемента массива по ключу и значению
    let obj = {};
    for (const key in element) {
      obj[`${element[key][0]}`] = element[key][1];
    }
    //отправляем в массив каждый созданный объект
    if (inn && obj["ИНН"] == inn) {
      arr.push(obj);
    }
  });

  res.status(200).json(arr);
}
