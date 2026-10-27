# Diagrama de classes
```mermaid
classDiagram
 Client "1" --> "*" Appointment
 Client "1" --> "*" Analysis
 Client { int id string owner_id string name string phone date last_visit_date }
 Appointment { int id int client_id date date time string service string status }
 Analysis { int id int client_id string face_shape float symmetry json recommendations date date }
```
