const file = require("../../../public/Anketa.json");

export default function getXlsx(req, res) {
  const { sfera } = req.query;
  // console.log(sfera);
  var words = JSON.parse(JSON.stringify(file));
  let arr = [];
  words.forEach((element) => {
    //создаем объект из каждого элемента массива по ключу и значению
    let obj = {};
    for (const key in element) {
      obj[`${element[key][0]}`] = element[key][1];
    }
    //отправляем в массив каждый созданный объект
    console.log(sfera);
    if (sfera) {
      if (obj["Сфера применения производимой продукции"] === sfera) {
        arr.push(obj);
      }
    } else {
      arr.push(obj);
    }
  });

  res.status(200).json(arr);
}
