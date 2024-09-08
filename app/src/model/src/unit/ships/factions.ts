const DESCRIPTION_ED = `Earth Domain is an authoritarian Earth centric faction. Their ideology states that Earth still is the center of human civilization and restoration of Earth's habitability is of utmost importance. They are a treaty faction of several major Earthbound nations with some members from Mars. They do not exercise total control of Earth, but hold practically total military supremacy in the Earth - Luna system.`;

const DESCRIPTION_GVP = `Galilean Pact is originally a federation of the United Vesta and several colonies in the Jovian system. The pact was a consolidation of power against piracy and Earth Domain’s overreach. Galilean Pact has recently grown in strength with new members and completion of two new orbital habitats.`;

export const FACTIONS: Faction[] = [
  {
    name: "Earth Domain",
    description: DESCRIPTION_ED,
    logo: "/img/logo_earthdomainnavy.png",
    ships: ["Constantin"],
  },
  {
    name: "Galilean Pact",
    description: DESCRIPTION_GVP,
    logo: "/img/logo_galilean-vesta-pact.png",
    ships: ["Caliope", "Fulcrum", "Mouros"],
  },
  //new Faction("United Colonies", ["UcRhino", "Haka"]),
  //new Faction("The Expanse Protecorate", ["Caliope", "Fulcrum", "Mouros"]),
  //new Faction("Federation Navy", ["Impetous", "Constantin"]),
];

export type Faction = {
  name: string;
  description: string;
  logo: string;
  ships: string[];
};

/*
("/img/logo_earthdomainnavy.png");

("Galilean-Vesta Pact");
("Earth Domain");

("Veridian Republic");
("United Meridian");
*/
