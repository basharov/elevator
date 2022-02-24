import { IDataStorage } from './types'

export const initDataStorage = (): IDataStorage => (
  {
    personsAwaiting: [],
    personsInCabin: [],
  }
)