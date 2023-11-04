export const EASY = {
  rows: 9,
  cols: 9,
  mines: 10,
};

export const MEDIUM = {
  rows: 16,
  cols: 16,
  mines: 40,
};

export const EXPERT = {
  rows: 16,
  cols: 30,
  mines: 99,
};

// The initial values of a game of custom difficulty. There is no need for the
// object to change to reflect the new versions of the custom game parameters -
// the object is just needed to keep track of which difficulty is being played.
export const CUSTOM = {
  rows: 10,
  cols: 10,
  mines: 10,
};
