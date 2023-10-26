const User = require("../models/user");

// Populates an array with stripped down version of friends
module.exports.populateFriends = async (friends) => {
  let populatedFriends = [];
  for (friend of friends) {
    const friendUser = await User.findById(friend);
    await friendUser.populate("outings");
    await friendUser.populate("outings.activity");

    const strippedOutings = [];
    for (outing of friendUser.outings) {
      strippedOutings.push({
        activity: { category: outing.activity.category },
      });
    }

    const friendData = {
      _id: friendUser._id,
      first_name: friendUser.first_name,
      last_name: friendUser.last_name,
      flake: friendUser.flake,
      outings: strippedOutings,
      status: friendUser.status,
      profile_picture: friendUser.profile_picture,
    };

    populatedFriends.push(friendData);
  }

  return populatedFriends;
};

// Generic user population
module.exports.populateUser = async (user) => {
  await user.populate("outings");
  await user.populate("outings.activity");
  await user.populate("outings.users");
  await user.populate("outings.users.outings");
  await user.populate("outings.users.outings.activity");
};
