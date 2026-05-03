import Banner from "./components/Banner";
import ColdPressedFlour from "./components/ColdPressedFlour";
import SeedToBottle from "./components/SeedToBottle";
import SideBySide from "./components/SideBySide";

export const METHODS = {
  "wood-pressed": {
    Banner: {
      image: "/banners/wood.jpg",
      title: "Wood Pressed",
    },
    ColdPressedFlour: {
      title: "About Wood Pressed Extraction",
      description:
        "Our wood-pressed oils are extracted using traditional wooden Ghani at low temperatures, preserving all natural nutrients and flavors.",
    },
    SeedToBottle: {
      title: "The Cold Extraction Process",
      description:
        "No heat is applied during the process, ensuring that the oil remains in its most natural and healthy state.",
    },
    SideBySide: {
      title: "The Cold Extraction Process",
      description:
        "No heat is applied during the process, ensuring that the oil remains in its most natural and healthy state.",
    },
  },

  "cold-pressed": {
    Banner: {
      image: "/banners/cold.jpg",
      title: "Cold Pressed",
    },
    ColdPressedFlour: {
      title: "About Cold Pressed Extraction",
      description:
        "Cold pressed oils are obtained by pressing seeds at room temperature. This method retains the oil's natural aroma and nutritional value.",
    },
    SeedToBottle: {
      title: "Nutritional Integrity",
      description:
        "The absence of heat helps in maintaining the essential fatty acids and vitamins found in the seeds.",
    },
    SideBySide: {
      title: "Nutritional Integrity",
      description:
        "The absence of heat helps in maintaining the essential fatty acids and vitamins found in the seeds.",
    },
  },

  "stone-pressed": {
    Banner: {
      image: "/banners/stone.jpg",
      title: "Stone Pressed",
    },
    ColdPressedFlour: {
      title: "About Stone Pressed Extraction",
      description:
        "Using heavy stone grinders, this ancient method extracts oil slowly, ensuring maximum purity and a rich, traditional taste.",
    },
    SeedToBottle: {
      title: "Ancient Wisdom",
      description:
        "The slow stone rotation prevents friction-induced heat, keeping the oil's bio-active compounds intact.",
    },
    SideBySide: {
      title: "Ancient Wisdom",
      description:
        "The slow stone rotation prevents friction-induced heat, keeping the oil's bio-active compounds intact.",
    },
  },
};
