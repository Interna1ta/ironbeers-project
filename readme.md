
---
## Routes

## INDEX
Method   | Route                       | Whats does?                              |
|:-------|:----------------------------|:-----------------------------------------|
|get     |/                            | show the homepage                        |

---

## AUTH
Method   | Route                       | Whats does?                              |
|:-------|:----------------------------|:-----------------------------------------|
|get     |/auth/login                  | shows login form                         |
|post    |/auth/login                  | creates a new session                    |
|get     |/auth/login/recover          | shows the recovery form                  |
|post    |/auth/login/recover          | checks email vs email and send           |
|get     |/auth/login/new_password     | shows new password form                  |
|post    |/auth/login/new_password     | updates user information an logs them in |
|get     |/auth/signup                 | show the new user form                   |
|post    |/auth/signup                 | creates a new user and logs them in      |
|post    |/auth/logout                 | deletes user session                     |

---

## EVENTS
Method   | Route                       | Whats does?                              |
|:-------|:----------------------------|:-----------------------------------------|
|get     |/events                      | shows the list of events                 |
|get     |/events/create               | shows the event creation form            |
|post    |/events                      | creates a new event                      |
|get     |/events/:id                  | shows the events detail page             |
|get     |/events/:id/edit             | shows the edit event form                |
|post    |/events/:id/                 | updates an event                         |
|post    |/events/:id/cancel           | cancels the event                        |
|post    |/events/:id/invite           | sends a email with a link to events/:id  |
|post    |/events/:id/ignore/?         | removes user from guest list             |

---

## USER
Method   | Route                       | Whats does?                              |
|:-------|:----------------------------|:-----------------------------------------|
|get     |/users/:id                   | shows the users detail page              |

---

## PROFILE
Method   | Route                       | Whats does?                              |
|:-------|:----------------------------|:-----------------------------------------|
|get     |/profile/update              | shows the users edit form                |
|post    |/profile/update              | updates an user                          |

---

## ERRORS
Method   | Route                       | Whats does?                              |
|:-------|:----------------------------|:-----------------------------------------|
|get     |/404                         | shows the 404 page                       |
|post    |/500                         | shows the 500 page                       |

---
## STYLEGUIDE
Method   | Route                       | Whats does?                              |
|:-------|:----------------------------|:-----------------------------------------|
|get     |/styleguide                  | shows the styleguide                     |
