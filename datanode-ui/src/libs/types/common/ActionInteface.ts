export interface ActionInterface<Actions, Payload = any> {
    type: Actions,
    payload?: Payload
}