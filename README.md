# NODE JS Task 4: Build a server for an online tutoring app.

> Api for **onlie tutoring app** v1 with the follwing endpoints -that
> has three categories of users: Admin, tutors and students. A user can register as a student on this platform and also a tutor can become an admin.
> with the implementation of **access control middlwares** with which routes requires authentication and implement token-based authentication using JSON Web Token (JWT) and secure those routes using JSON Web Token (JWT)

### To get started :

#### Install:

- clone the repository online-tutoring-app to your desktop
- `cd online-tutoring-app`
- `npm install`

#### Admin login details

- `Email`: "iblack.xyz@gmail.com"
- `Password`: "test1234"

### Admin Endpoints

- `POST/api/v1/admin/makemeadmin` : access private, to make a tutor an admin

```javascript
POST req.body >>> { email }
```

- `POST/api/v1/admin/subject` : access private, to create suject in a category

```javascript
POST req.body >>> {  name, category, dataUrl }
```

- `PUT/api/v1/admin/subject/:subjectId` : to update subject by id

```javascript
PUT req.params >>> <subjectId> { name, category, dataUrl }
```

- `DELETE/api/v1/admin/subject/:subjctId` : to up date subject by id

```javascript
DELETE req.params  >>> <subjectId>
```

- `GET/api/v1/admin/tutor` : access private, get all tutors

```javascript
 GET req.body >>> data: { }
```

- `GET/api/v1/admin/tutor/:tutorId` : get tutors by id

```javascript
GET req.body >>> <toutorId> data: { }
```

- `POST/api/v1/admin/tutor` : deactivate a tutor and deny tutor access to all routes

```javascript
POST req.body >>> { email }
```

- `GET/api/v1/admin/lesson` : get all lessons

```javascript
GET req.body >>>   data: { }
```

- `GET/api/v1/admin/lesson/:lessonId` : get lessons by id

```javascript
GET req.body >>> <lessonId>
```

- `POST/api/v1/admin/lesson` : create a lesson

```javascript
POST req.body >>> { subject, category, title, tutorId, timeStart, timeEnd }

NOTE: to create a lesson enter a valid <subject>, <category> and <tutorId> "tutorId" is the tutor "email"
```

<!-- TODO: create a delete lesson route -->
<!-- TODO: create a update lesson route -->

### Tutor Endpoints 👩🏾‍🏫👨🏾‍🏫

- `POST/api/v1/tutor/signup`: tutor can sign-up

```javascript
 POST req.body >>> {  name, email, password } sign-up.
```

- `POST/api/v1/tutor/login`: tutor can log-in

```javascript
POST req.body >>> { email, password } data: { token }
```

- `POST/api/v1/tutor/registersubject` : access private, tutor can register subject

```javascript
POST req.post >>> { name, category }
NOTE: subject name and category must be a valid subject
```

- `GET/api/v1/registered/subject` : access private, get subjects tutor registered

```javascript
GET req.body >>> data: {  }
```

- `PUT/ap/v1/egistered/:subjectId` : update registered subject

```javascript
PUT req.params >>> <subjectId> { name, category, dataUrl }
```

- `DELETE/ap/v1/egistered/:subjectId` : update registered subject

```javascript
DELETE req.params >>> <subjectId>
```
