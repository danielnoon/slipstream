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