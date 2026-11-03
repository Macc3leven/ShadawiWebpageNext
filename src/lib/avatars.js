// Mage portraits a player picks when creating their account. Ids match the User API.
export const AVATARS = [
  { id: "mage_male", label: "Male", src: "/images/avatars/mage-male.webp" },
  { id: "mage_female", label: "Female", src: "/images/avatars/mage-female.webp" },
];

// Accounts made before portraits existed have none yet; they get the first one
export const avatarSrc = (id) => (AVATARS.find((a) => a.id === id) || AVATARS[0]).src;
