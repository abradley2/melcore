# Melkor

Minimal Redux-ish implementation for Mithril.js, with middleware for handling asynchronous request via `m.request`

I really just wanted a library like Redux, with a built in middleware for handling 
requests using `m.request`, 
and a nicer way to write reducers so it won't fail quietly when one of my 
constants are mistyped. Other than those couple of reasons, this may as well
be titled "Discount knockoff-Redux". But "Melkor" sounds kewler and this with 
the "Mithril" theme I guess.

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