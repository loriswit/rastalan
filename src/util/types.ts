export interface Event {
  id: number
  name: string
  number: number
  start_date: Date
  end_date: Date
}

export interface Registration {
  id: number
  name: string
  days: boolean[]
  date: Date
  registered: boolean
  conditions_read: boolean
  conditions_accepted: boolean
  event_id: number
  hardware: {
    pc: boolean
    laptop: boolean
    console: boolean
  }
}

export interface FormFields {
  name: string
  hardware: {
    pc: boolean
    laptop: boolean
    console: boolean
  }
  everyday: boolean
  notEveryDay: boolean
  days: boolean[]
  conditionsRead: boolean
  conditionsAccepted: boolean
  registered: Date
  eventNumber: number
}
