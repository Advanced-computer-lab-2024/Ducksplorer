const Activity = require("../../Models/activityModel");

const filterActivities = async (req, res) => {
  const { price, date, rating, category } = req.body;

  const query = {
    $and: [
      { price: { $lte: price } },
      { date: date },
      { rating: { $gte: rating } },
      { category: category },
    ],
  };

  return Activity.find(query)
    .then((results) => {
      console.log(results);
    })
    .catch((err) => {
      console.log(err);
    });
};

module.exports(filterActivities);

//service contains the logic of the function
//controller executes the functions and returns success or failure messages
