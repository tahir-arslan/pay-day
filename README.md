# Pay Day
## Project Description
This project allows users to record a timestamp for work (clock-in/out to a shift). Work hours are then calculated with pay-rates (based on the authenticated user) to accurately display their pay-stub. It is intended for use on a local server for better security and data breach prevention.

![Project Screenshot](assests\images\project_screenshot.jpg)

In a company with multiple roles (ex. Manager, Accountant, Employee, etc) different data is generated and available for changes based on that role. Hence, the following user stories were kept in mind when creating the project:
```sh
As a user, I want to have my work hours be tracked so that I can get paid accurately.
-	Display clock upon authentication, to record time of shift start/end
-	After punch, display page with all recorded times
-	Calculate total hours worked, and display total after summary of worked hours minus any mandatory off time (ex. Break, lunch, etc).
```
```sh
As a manager, I want to oversee all time activities to ensure accurate time stamps and work efficiency.
-	After login, manager account is authenticated to give access to approval/denial of any time punch edits
-	After punch, display page with overview of employee/team’s time sheet
```
```sh
As an accountant, I want to view total work hours/vacation hours used to calculate pay of all employees
-	After login, accountant account is authenticated to give access to pay rates and work hours
-	After punch, display page with overview of employee/team’s time sheet
```
#### Technologies Used
All tech used in this project is in compliance to the project's requirements as listed below:
- Node.js
- Express.js
- Handlebars.js
- Day.js
- Bootstrap
- MySQL
- Sequalize ORM
- Heroku

- challenges faced and features that will be implemened in the future
## How to Install
Just run the following command at the root of your project:
```sh
npm i
```
Or use default answers with the following command:
```sh
npm i -y
```
## How to use

## Future Development

## Support
Please spam our professor's github and pressure him into giving us a perfect score on all of our projects (including this one)! Last day of class is <insert date>, so don't hesitate to show your support before then.
## Credits
- [[Shu Yang](https://github.com/NewChap2022)]
- [[Rafael Gomes](https://github.com/rfabreu)]
- [[Charles (Dexter) Zacour](https://github.com/DexZax)]
- [[Arslan Tahir](https://github.com/tahir-arslan)]
## Licenses
