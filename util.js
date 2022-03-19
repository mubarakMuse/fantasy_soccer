const getPosition = (i) => {
  if (i <= 3) return "Goalkeeper";
  if (i <= 9) return "Defender";
  if (i <= 15) return "Midfielder";
  if (i <= 20) return "Attacker";
};

const getRandomAge = () => {
  return Math.floor(Math.random() * (40 - 18 + 1)) + 18;
};
const getRandomPlayerValue = () => {
  return (Math.floor(Math.random() * (100 - 10 + 1)) + 10) / 100 + 1;
};

const createDefaultTeam = (user) => {
  return {
    userId: user.id,
    country: "USA",
    name: "Team " + user.lastName,
    value: 20000000,
    budget: 5000000,
  };
};
const createDefaultPlayers = (user, team) => {
  let defaultPlayers = [];
  for (let i = 1; i <= 20; i++) {
    defaultPlayers.push({
      teamId: team.id,
      userId: user.id,
      country: "USA",
      firstName: "Player" + i + " " + user.firstName,
      lastName: "Player" + i + " " + user.lastName,
      position: getPosition(i),
      age: getRandomAge(),
      marketValue: 1000000,
    });
  }
  return defaultPlayers;
};

function removeHashedPassowrd(user) {
  const { hashedPassword, ...userWithoutHashedPassword } = user;
  return userWithoutHashedPassword;
}

module.exports = {
  createDefaultTeam,
  createDefaultPlayers,
  getRandomPlayerValue,
  removeHashedPassowrd
};
