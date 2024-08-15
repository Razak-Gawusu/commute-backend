user

- firstName
- lastName
- password
- email
- phone
- role


Driver

- firstName
- lastName
- email
- phone
- license(driver)
- vehicleNumber
  - Dashboard
    1. summary of trips
  - profile
    (name, vehicle no., licence, vehicle model)
  - trips
    1. list of all trips
  - trip requests
    1. list of requested trips
       trip card(parent ID, school, location, status, start)

School

- name
- location
- email
- phone
- password
  - Dashboard
    (parents, students, trips)
  - parent 1. Table of all parents
    (id, name, location, ward)
    action(view, delete, edit) 2. Invite parent
    (fullname, email) 3. Auth page for parents - confirm account page
    (name, email, password)
    - trips
      1. Table for all trips
         (id, driver, parent, ward statu)
         actions(confirm arrivals, report with reason on trip)

Parent

- firstName
- lastName
- email
- phone
  - Dashboard 1. summary of trips - profile
    (name, should, ward details)
  - trips 1. list of all trips
  - request for a trip 1. list of all drivers
    (driver details, name, email, phone, number of trips, request for trip)

Admin

- Dashboard

  1. Summary of schools and drivers
  2. Summary of trips

- Schools

  1. Table of all schools
     (id, name, email, location)
     actions(view, edit, delete)
  2. Detailed page for schools

- Drivers

  1. Table of all drivers
     (id, name, email, phone, location, license)
     actions(view, edit, delete)
  2. Detailed page for drivers

- Trips

  1. pending
  2. successful
  3. canceled

- Settings
