export enum Line {
  WARSZAWA = "WARSZAWA",
  SIEDLCE = "SIEDLCE",
}

export const description: { [key in Line]: string } = {
  [Line.WARSZAWA]: "Sokołów Podlaski - Warszawa",
  [Line.SIEDLCE]: "Sokołów Podlaski - Siedlce"
}

export const availableLines: Line[] = Object.values(Line)

