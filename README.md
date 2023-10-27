# LaundryTS
This is a full stack Laundry Management website built using 
- Typescript
- React JS - Frontend
- Express JS - Backend
- Redis - Caching
- MongoDB - Database
- Nodemailer - Sending Mails
- PassportJS - Oauth
- Mailtrap - Testing Nodemailer Sent Emails

There is a user and an owner login portal. User authentication is implemented using Google OAuth2 and Owner Auth is credential based (email and password)

## IMPORTANT INSTRUCTIONS
  Mails are sent in development mode so can be seen using Mail trap

## EXAMPLE ENV (to be created in the backend folder)

```
DATABASE_URL="MongoDB Database URL"
DATBASE_PASSWORD="MongoDB Database Password"
PORT="Your backend port
JWT_SECRET="Your JWT Secret"
JWT_EXPIRES_IN="No of Days"
GOOGLE_CLIENT_ID="Your Google Client Id"
GOOGLE_CLIENT_SECRET="Your Google Client Secret"
EMAIL_HOST=sandbox.smtp.mailtrap.io
EMAIL_USERNAME= "Your mailtrap user name"
EMAIL_PASSWORD= "Your mail trap password"
```
