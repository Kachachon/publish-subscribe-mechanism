// Instructions
// 1. Build the Publish-Subscribe mechanism. Allow ISubscriber objects to register against an concrete IPublishSubscribService object for an event type. Implement the publish method
// so that when a publish event occurs, all subscribers of that the event type published will have a chance to handle the event. The subscribers should be working off a shared array of Machine
// objects, mutating them depending on the event received
// 2. Now add the method 'unsubscribe' on IPublishSubscribeService to allow handlers to unsubscribe from events. You may change the existing method signatures.
// 3. Implement MachineRefillSubscriber. It will increase the stock quantity of the machine.
// 4. Introduce a new subscriber called LowStockWarningSubscriber. It subscribes to MachineSaleEvents. If a machine stock levels drops below 3 a new Event, LowStockWarningEvent should
// have a 50% chance of firing, which causes any future MachineSaleEvents to be ignored until the stock goes above 3 (by a MachineRefill event). Think about how you will communicate this
// information. Remember subscribers should be notified in the order of the events occured.

// Your program should now allow you to create ISubscriber objects, register them using your IPublishSubscribService implementation. You can then create
// IEvent objects and call your IPublishSubscribService's implementations .publish() method. All handlers subscribed should have their 'handle' methods invoked.
// These handlers should be able to create new events (LowStockWarningSubscriber), getting handled after the existing events are handled.

// Note if subscribes subscribe after an event has already been published, they will not receive that event.

// You may make any changes to this codebase as long as you ultimately build a Pub-Sub application capable of handling events.

// interfaces
interface IEvent {
  type(): string;
  machineId(): string;
}

interface ISubscriber {
  handle(event: IEvent): void;
}

interface IPublishSubscribeService {
  publish(event: IEvent): void;
  subscribe(type: string, handler: ISubscriber): void;
  // unsubscribe ( /* Question 2 - build this feature */ );
}

// implementations
class MachineSaleEvent implements IEvent {
  constructor(
    private readonly _sold: number,
    private readonly _machineId: string
  ) {}

  machineId(): string {
    return this._machineId;
  }

  getSoldQuantity(): number {
    return this._sold;
  }

  type(): string {
    return "sale";
  }
}

class MachineRefillEvent implements IEvent {
  constructor(
    private readonly _refill: number,
    private readonly _machineId: string
  ) {}

  machineId(): string {
    throw new Error("Method not implemented.");
  }

  type(): string {
    throw new Error("Method not implemented.");
  }
}

class MachineSaleSubscriber implements ISubscriber {
  public machines: Machine[];

  constructor(machines: Machine[]) {
    this.machines = machines;
  }

  handle(event: MachineSaleEvent): void {
    this.machines[2].stockLevel -= event.getSoldQuantity();
  }
}

class MachineRefillSubscriber implements ISubscriber {
  handle(event: IEvent): void {
    throw new Error("Method not implemented.");
  }
}

// objects
class Machine {
  public stockLevel = 10;
  public id: string;
  constructor(id: string) {
    this.id = id;
  }
}

// helpers
const randomMachine = (): string => {
  const random = Math.random() * 3;
  if (random < 1) {
    return "001";
  } else if (random < 2) {
    return "002";
  }
  return "003";
};

const eventGenerator = (): IEvent => {
  const random = Math.random();
  if (random < 0.5) {
    const saleQty = Math.random() < 0.5 ? 1 : 2; // 1 or 2
    return new MachineSaleEvent(saleQty, randomMachine());
  }
  const refillQty = Math.random() < 0.5 ? 3 : 5; // 3 or 5
  return new MachineRefillEvent(refillQty, randomMachine());
};

// program
(async () => {
  // create 3 machines with a quantity of 10 stock
  const machines: Machine[] = [
    new Machine("001"),
    new Machine("002"),
    new Machine("003"),
  ];

  // create a machine sale event subscriber. inject the machines (all subscribers should do this)
  const saleSubscriber = new MachineSaleSubscriber(machines);

  // create the PubSub service
  const pubSubService: IPublishSubscribeService =
    null as unknown as IPublishSubscribeService; // implement and fix this

  // create 5 random events
  const events = [1, 2, 3, 4, 5].map((i) => eventGenerator());

  // publish the events
  events.map(pubSubService.publish);
})();
