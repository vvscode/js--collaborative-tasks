export class EventEmitter<EventsMap> {
  events = {} as {
    [key in keyof EventsMap]: {
      handler: (data: EventsMap[key]) => void;
      isOnce: boolean;
    }[];
  };

  on<T extends keyof EventsMap>(
    eventName: T,
    handler: (data: EventsMap[typeof eventName]) => void,
    isOnce = false
  ) {
    if (!this.events[eventName]) {
      this.events[eventName] = [];
    }

    this.events[eventName].push({ handler, isOnce });
  }

  trigger<T extends keyof EventsMap>(
    eventName: T,
    data: EventsMap[typeof eventName]
  ) {
    this.events[eventName]?.forEach((item) => {
      item.handler(data);
      if (item.isOnce) {
        this.off(eventName, item.handler);
      }
    });
  }

  off<T extends keyof EventsMap>(
    eventName: T,
    handler: (data: EventsMap[typeof eventName]) => void
  ) {
    this.events[eventName] = (this.events[eventName] || []).filter(
      (item) => item.handler !== handler
    );
  }
}
