export interface Event {
  id: number
  name: string
  number: number
  start_date: Date
  end_date: Date
}

export interface ExtendedEvent {
  id: number
  name: string
  number: number
  startDateTime: Date
  startDate: Date
  endDateTime: Date
  endDate: Date
  days: Date[]
  timezone: string
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
  registered: Date | false
  eventNumber: number
}

export interface Client {
  online: boolean
  name: string
  ip: string
  mac: string
  type: number
  iface: string
  realName?: string
}

export interface LanService {
  name: string
  uri: string
  web?: string
}
