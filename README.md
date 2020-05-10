# NODE JS Task 4: Build a server for an online tutoring app.

> Api for **onlie tutoring app** v1 with the follwing endpoints -that
> has three categories of users: Admin, tutors and students. A user can register as a student on this platform and also a tutor can become an admin.
> with the implementation of **access control middlwares** with which routes requires authentication and implement token-based authentication using JSON Web Token (JWT) and secure those routes using JSON Web Token (JWT)

### To get started :

#### Install:

- clone the repository online-tutoring-app to your desktop
- `cd online-tutoring-app`,
- `npm install`

### Admin Endpoints

- `PUT/api/v1/admin/makemeadmin`:
```bash
access private, to make a tutor an admin
REQ.BODY >>> { email }
```
- `POST/api/v1/admin/subject` : access private, to create suject in a category
- `PUT/api/v1/admin/subject/subjctId` : to up date subject by id
- `DELETE/api/v1/admin/subject/subjctId` : to up date subject by id
- `GET/api/v1/admin/tutor` : access private get all tutors
- `GET/api/v1/admin/tutor/:tutorId` : get tutors by id
- `PUT/api/v1/admin/tutor/:tutorId` : deactivate a tutor and deny tutor access to all routes
- `GET/api/v1/admin/lesson` : get all lessons
- `GET/api/v1/admin/lesson/:lesson` : get lessons by id
- `POST/api/v1/admin/lesson` : create a lesson

#### Tutor Endpoints

- `POST/api/v1/tutor/signup`: tutor can sign-up
- `POST/api/v1/tutor/login`: tutor can log-in
