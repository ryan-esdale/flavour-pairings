export interface Flavour {
      id: number,
      name: string
}

export interface Pairing {
      primary_flavour_id: number,
      secondary_flavour_id: number,
      comments: string
}