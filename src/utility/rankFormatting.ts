import { css } from "@emotion/css";

export const textColor = (rank : number) => rank > 0 && rank < 4 ? "light" : "dark"; 

export const getRankCSS = (rank: number) => {
  const defaultColor = "#131313";
  const placementColors = ["transparent", "#d4af37", "#aaa9ad", "#cd7f32"];
  return css`
  --background: ${rank <= 3 ? placementColors[rank] : defaultColor};
  `
}

export const rankColors = ["first", "second", "third"]

export const ordinalException = (rank: number): boolean => {
    switch (rank % 100) {
      case 11:
      case 12:
      case 13:
        return true;
      default:
        return false;
    }
  }
  
export const getOrdinal = (rank: number): string => {
    if (ordinalException(rank)) {
      return "th";
    }
    switch (rank % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }