export interface Ship {
  id: string;
  class: number | null;
  image: string | null;
  name: string;
  active: boolean;
  __typename: string;
  missions: Mission[] | null;
}

export interface Mission {
  flight: string;
  name: string;
}
