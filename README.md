# Melkor

Minimal Redux-ish implementation for Mithril.js, with middleware for handling asynchronous request via `m.request`

# The Store

# Actions and Action Creators

# Reducers

# Requests

Any action that has a `request` attribute will trigger a call on `m.request`, passing its content 


So when you dispatch an action with these contents:

```
{
  type: 'FETCH_TODOS',
  request: {
    method: 'GET',
    url: '/api/todos'
  }
}
```

another action will automaticall be dispatched when the request is finished. 

If the request finishes (promise.then)
```
{
  type: 'FETCH_TODOS',
  status: 'done',
  request: {
    method: 'GET',
    url: '/api/todos'
  },
  response: [
    {id: 1, title: 'Todo One'},
    {id: 2, title: 'Todo Two'}
  ]
}
```

else (promise.catch)
```
{
  type: 'FETCH_TODOS',
  status: 'error',
  request: {
    method: 'GET',
    url: '/api/todos'
  },
  response: {
    error: new Error( ... )
  }
}
```