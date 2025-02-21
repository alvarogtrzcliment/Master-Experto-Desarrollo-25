import { type ImmutableObject } from 'seamless-immutable'

export interface Config {
  exampleConfigProperty: string
  propiedadEjemplo: string
}

export type IMConfig = ImmutableObject<Config>
